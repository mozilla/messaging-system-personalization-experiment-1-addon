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
    scoreThreshold: 1.6,
  },
};
const config = configByAddonId[browser.runtime.id];
const { bucket, cohort } = config.asRouterCfrProviderConfig;
console.info("Experiment add-on background.js", browser.runtime.id);
console.debug({ config });

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
  try {
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
  } catch (e) {
    onError(e);
  }
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

    browser.privileged.messagingSystem.onCfrModelsSync.removeListener(
      onCfrModelsSync,
    );
    await browser.privileged.personalizedCfrPrefs.clearScoreThreshold();
    await browser.privileged.personalizedCfrPrefs.clearScores();
    await browser.privileged.personalizedCfrPrefs.clearModelVersion();
  } catch (e) {
    console.error("Error occurred in the unenroll callback");
    console.error(e);
  }
};

// For add-on debugging and development
browser.browserAction.onClicked.addListener(async () => {
  await browser.tabs.create({
    url: "debug-page/index.html",
  });
});

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
    const blackboxPlaceholderBehavior = await browser.privileged.testingOverrides.getBlackboxPlaceholderBehavior();
    console.debug({ blackboxPlaceholderBehavior });
    switch (blackboxPlaceholderBehavior) {
      case "zeroes":
        computedScores = {
          BOOKMARK_SYNC_CFR: 0,
          YOUTUBE_ENHANCE_3: 0,
        };
        break;
      case "random_within_bounds":
        computedScores = {
          BOOKMARK_SYNC_CFR: 0.123,
          YOUTUBE_ENHANCE_3: 0.456,
        };
        break;
      default:
      case "fixed_values":
        computedScores = {
          BOOKMARK_SYNC_CFR: 0.123,
          YOUTUBE_ENHANCE_3: 0.456,
        };
        break;
    }

    console.info("Writing computed scores into prefs");
    await browser.privileged.personalizedCfrPrefs.setScores(computedScores);

    console.info("Writing model version to pref");
    await browser.privileged.personalizedCfrPrefs.setModelVersion(-1);

    const { syncCallbackHasRun } = await browser.storage.local.get(
      "syncCallbackHasRun",
    );
    if (syncCallbackHasRun !== true) {
      console.info("Sanity checking written prefs");
      const scoreThreshold = await browser.privileged.personalizedCfrPrefs.getScoreThreshold();
      const scores = await browser.privileged.personalizedCfrPrefs.getScores();
      const modelVersion = await browser.privileged.personalizedCfrPrefs.getModelVersion();
      console.debug({ scoreThreshold, scores, modelVersion });
      // TODO: Sanity check

      console.info(
        "Since this is the first time the onCfrModelsSync callback is " +
          "running: Setting the CFR provider pref, hereby activating " +
          "the experiment in the perspective of messaging system",
      );
      await browser.privileged.messagingSystem.setASRouterCfrProviderPref(
        bucket,
        cohort,
      );

      await browser.storage.local.set({ syncCallbackHasRun: true });
    }

    console.info("onCfrModelsSync callback finished");
  } catch (e) {
    onError(e);
  }
};

browser.normandyAddonStudy.onUnenroll.addListener(async reason => {
  await onUnenroll(reason);
});

run();
