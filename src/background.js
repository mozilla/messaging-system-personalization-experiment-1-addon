/* global getClientContext */

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
  try {
    const cfrMlModelsRecordOfInterest = cfrMlModelsCollectionRecords[0];
    console.debug({ cfrMlModelsRecordOfInterest });

    console.info(`Getting current messages from "${bucket}"`);
    const cfrExperimentProviderMessages = await browser.privileged.messagingSystem.getCfrProviderMessages(
      bucket,
      cohort,
    );
    const experimentCfrs = cfrExperimentProviderMessages.messages;
    console.log({ experimentCfrs });

    console.info(`Getting current client context`);
    const clientContext = await getClientContext();

    console.info("Computing scores etc based on the following model input", {
      clientContext,
    });
    let computedScores;
    const scoringBehaviorOverride = await browser.privileged.testingOverrides.getScoringBehaviorOverride();
    console.debug({ scoringBehaviorOverride });
    switch (scoringBehaviorOverride) {
      case "fixed_value_0":
        computedScores = {
          PERSONALIZED_CFR_MESSAGE: 0,
        };
        break;
      case "fixed_value_10000":
        computedScores = {
          PERSONALIZED_CFR_MESSAGE: 10000,
        };
        break;
      case "fixed_value_slightly_below_threshold":
        computedScores = {
          PERSONALIZED_CFR_MESSAGE: config.scoreThreshold - 1,
        };
        break;
      case "fixed_value_slightly_over_threshold":
        computedScores = {
          PERSONALIZED_CFR_MESSAGE: config.scoreThreshold + 1,
        };
        break;
      case "random_between_1_and_9999":
        computedScores = {
          PERSONALIZED_CFR_MESSAGE: Math.round(Math.random() * 9998 + 1),
        };
        break;
      default:
        computedScores = {};
    }

    console.info("Writing computed scores into prefs");
    await browser.privileged.personalizedCfrPrefs.setScores(computedScores);

    const personalizedModelVersion = -1;

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
