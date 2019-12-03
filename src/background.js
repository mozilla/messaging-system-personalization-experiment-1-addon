const configByAddonId = {
  "messaging-system-personalization-experiment-1-addon-control@mozilla.org": {
    branch: "control",
    asRouterCfrProviderConfig: {
      bucket: "cfr-control",
      cohort: "PERSONALIZATION_EXPERIMENT_1_CONTROL",
    },
  },
  "messaging-system-personalization-experiment-1-addon-treatment@mozilla.org": {
    branch: "treatment",
    asRouterCfrProviderConfig: {
      bucket: "cfr-experiment",
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

    // Imports models from remote settings (`cfr-models` bucket)
    // Drives update cycle so that the computations gets updated on each update
    console.info("Subscribing to model updates from remote settings");
    browser.privileged.messagingSystem.onCfrModelsSync.addListener(
      onCfrModelsSync,
    );

    // Force sync after 10 seconds and then every 60 minutes
    const alarmListener = async alarm => {
      if (alarm.name === periodicAlarmName) {
        console.info(`Force syncing "cfr-models" bucket contents`);
        await browser.privileged.remoteSettings.clearLocalDataAndForceSync(
          "cfr-models",
        );
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
    browser.privileged.messagingSystem.onCfrModelsSync.removeListener(
      onCfrModelsSync,
    );
    await browser.privileged.personalizedCfrPrefs.clearScoreThreshold();
    await browser.privileged.personalizedCfrPrefs.clearScores();
  } catch (e) {
    console.error("Error occurred in the unenroll callback");
    console.error(e);
  }
};

const onCfrModelsSync = async syncEvent => {
  try {
    console.log("onCfrModelsSync", { syncEvent });
    const { data } = syncEvent;
    console.log({ data });

    console.info("Getting current messages from `cfr-experiment`");
    const cfrExperimentMessages = await browser.privileged.messagingSystem.getCfrBucketMessages(
      bucket,
      cohort,
    );
    console.log({ cfrExperimentMessages });

    console.info("Getting model inputs from ASRouterTargeting.jsm");
    const asRouterTargetingGetters = await browser.privileged.messagingSystem.getASRouterTargetingGetters(
      ["isFxAEnabled", "usesFirefoxSync", "profileAgeCreated"],
    );
    console.log({ asRouterTargetingGetters });

    console.info("Computing scores etc - TODO");
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
