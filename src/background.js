/* global getClientContext, BernoulliNB */

const configByAddonId = {
  "messaging-system-personalization-experiment-1-addon-control@mozilla.org": {
    branch: "control",
    asRouterCfrProviderConfig: {
      bucket: "cfr-ml-control",
      cohort: "PERSONALIZATION_EXPERIMENT_1_CONTROL",
    },
  },
  "messaging-system-personalization-experiment-1-addon-treatment@mozilla.org": {
    branch: "treatment",
    asRouterCfrProviderConfig: {
      bucket: "cfr-ml-experiments",
      cohort: "PERSONALIZATION_EXPERIMENT_1_TREATMENT",
    },
    scoreThreshold: 5000,
  },
};
const config = configByAddonId[browser.runtime.id];
const { bucket, cohort } = config.asRouterCfrProviderConfig;
console.info("Experiment add-on background.js", browser.runtime.id);
console.debug({ config });
const periodicAlarmName = `${browser.runtime.id}:periodicCfrModelsPolling`;

const onError = e => {
  console.error(e);
  browser.normandyAddonStudy.endStudy("CAUGHT_ERROR");
};

const run = async () => {
  try {
    if (!isEligible()) {
      console.info("Not eligible");
      browser.normandyAddonStudy.endStudy("Not eligible");
    } else {
      console.info("Eligible");
    }

    // TODO - double-check that study has not already ended
    const study = await browser.normandyAddonStudy.getStudy();
    console.debug({ study });

    const { hasRunInitiationAtLeastOnce } = await browser.storage.local.get(
      "hasRunInitiationAtLeastOnce",
    );
    if (hasRunInitiationAtLeastOnce !== true) {
      await firstRun();
      await browser.storage.local.set({ hasRunInitiationAtLeastOnce: true });
    }
    await everyRun();
  } catch (e) {
    onError(e);
  }
};

const isEligible = async () => {
  console.info("Checking study eligibility");
  const permanentPrivateBrowsing = await browser.privileged.privacyContext.permanentPrivateBrowsing();
  console.debug({ permanentPrivateBrowsing });
  return !permanentPrivateBrowsing;
};

const firstRun = async () => {
  console.info(`Force syncing "${bucket}" bucket contents`);
  await browser.privileged.remoteSettings.clearLocalDataAndForceSync(bucket);

  if (config.branch === "control") {
    console.info("Writing hard-coded provider cfr pref", { bucket, cohort });
    await browser.privileged.messagingSystem.setASRouterCfrProviderPref(
      bucket,
      cohort,
    );
    return;
  }

  console.info("Writing hard-coded score threshold", config.scoreThreshold);
  await browser.privileged.personalizedCfrPrefs.setScoreThreshold(
    config.scoreThreshold,
  );
};

const everyRun = async () => {
  try {
    // Do nothing on every run in control branch
    if (config.branch === "control") {
      return;
    }

    // Poll endpoint after 10 seconds and then every 60 minutes
    // Drives update cycle so that the computations gets updated on each update
    const alarmListener = async alarm => {
      if (alarm.name === periodicAlarmName) {
        console.info(`Force syncing "cfr-ml-model" bucket contents`);
        // Imports models from remote settings (`cfr-ml-model` bucket)
        const cfrMlModelsCollectionRecords = await browser.privileged.remoteSettings.fetchFromEndpointDirectly(
          "cfr-ml-model",
        );
        await computeScores(cfrMlModelsCollectionRecords);
      }
    };
    browser.alarms.onAlarm.addListener(alarmListener);
    const delayInMinutes = (1 / 60.0) * 10; // 10 seconds
    const periodInMinutesOverride = await browser.privileged.testingOverrides.getPeriodicPollingPeriodInMinutesOverride();
    const periodInMinutes = periodInMinutesOverride || 60.0;
    browser.alarms.create(periodicAlarmName, {
      delayInMinutes,
      periodInMinutes,
    });
  } catch (e) {
    onError(e);
  }
};

const onUnenroll = async reason => {
  console.info("Unenrolling", { reason });
  try {
    await browser.privileged.messagingSystem.clearASRouterCfrProviderPref();

    // Do nothing more in control branch
    if (config.branch === "control") {
      return;
    }

    await browser.alarms.clear(periodicAlarmName);
    await browser.privileged.personalizedCfrPrefs.clearScoreThreshold();
    await browser.privileged.personalizedCfrPrefs.clearScores();
  } catch (e) {
    console.error("Error occurred in the unenroll callback");
    console.error(e);
  }
};

const computeScores = async cfrMlModelsCollectionRecords => {
  /**
   * @typedef {Object} Classifier
   * @property {float[]} priors Priors
   * @property {float[][]} delProbs Delta probs
   * @property {float[][]} negProbs Neg probs
   */
  /**
   * @typedef {Object} CfrMlModelsRecord
   * @property {string} version Model version
   * @property {Object.<string, Classifier>} models_by_cfr_id Models by CFR id
   */

  try {
    /**
     * @type CfrMlModelsRecord
     */
    const cfrMlModelsRecord = cfrMlModelsCollectionRecords[0];
    console.debug({ cfrMlModelsRecord });

    const experimentCfrIds = Object.keys(cfrMlModelsRecord.models_by_cfr_id);
    console.log({ experimentCfrIds });

    console.info(`Getting current client context`);
    const clientContext = await getClientContext();

    console.info("Computing scores etc based on the following model input", {
      clientContext,
    });
    const computedScores = {};
    const scoringBehaviorOverride = await browser.privileged.testingOverrides.getScoringBehaviorOverride();
    console.debug({ scoringBehaviorOverride });

    if (scoringBehaviorOverride) {
      experimentCfrIds.push("PERSONALIZED_CFR_MESSAGE");
    }

    const featureNames = [
      "has_firefox_as_default_browser", // index 0
      "has_more_than_five_days_of_active_ticks", // index 1
      "has_more_than_1000_total_uri_count", // index 2
      "about_preferences_non_default_value_count", // index 3
      "has_at_least_one_self_installed_addon", // index 4
      "has_at_least_one_self_installed_popular_privacy_security_addon", // index 5
      "has_at_least_one_self_installed_theme", // index 6
      "dark_mode_active", // index 7
      "has_more_than_5_bookmarks", // index 8
      "has_at_least_one_login_saved_in_the_browser", // index 9
      "firefox_accounts_configured", // index 10
      "profile_at_least_7_days_old", // index 11
      "main_monitor_screen_width_gt_2000", // index 12
      "is_release_channel", // index 13
      "locale_is_en_us", // index 14
      "locale_is_de", // index 15
    ];

    const features = featureNames.map(feature => clientContext[feature]);

    console.log({ features });

    const computeScore = cfrId => {
      switch (scoringBehaviorOverride) {
        case "fixed_value_0":
          return 0;
        case "fixed_value_10000":
          return 10000;
        case "fixed_value_slightly_below_threshold":
          return config.scoreThreshold - 1;
        case "fixed_value_slightly_over_threshold":
          return config.scoreThreshold + 1;
        case "random_between_1_and_9999":
          return Math.round(Math.random() * 9998 + 1);
      }

      const model = cfrMlModelsRecord.models_by_cfr_id[cfrId];

      console.log("TODO compute score", { cfrId, model, clientContext });

      // Return -1 if no model exists for the given CFR id
      if (model === undefined) {
        return -1;
      }

      const { priors, negProbs, delProbs } = model;

      const clf = new BernoulliNB(priors, negProbs, delProbs);
      const prediction = clf.predict(features);
      console.log({ prediction });

      return -1;
    };

    experimentCfrIds.map(cfrId => {
      computedScores[cfrId] = computeScore(cfrId);
    });

    console.info("Writing computed scores into prefs");
    await browser.privileged.personalizedCfrPrefs.setScores(computedScores);

    const personalizedModelVersion = cfrMlModelsRecord.version;

    console.info("Sanity checking written prefs");
    const scoreThreshold = await browser.privileged.personalizedCfrPrefs.getScoreThreshold();
    const scores = await browser.privileged.personalizedCfrPrefs.getScores();
    console.debug({ scoreThreshold, scores });
    // TODO: Sanity check

    console.info(
      "Setting the CFR provider pref with bucket, cohort and personalizedModelVersion",
      { bucket, cohort, personalizedModelVersion },
    );
    await browser.privileged.messagingSystem.setASRouterCfrProviderPref(
      bucket,
      cohort,
      personalizedModelVersion,
    );

    console.info("onCfrModelsSync callback finished");
  } catch (e) {
    onError(e);
  }
};

browser.normandyAddonStudy.onUnenroll.addListener(async reason => {
  await onUnenroll(reason);
});

run();
