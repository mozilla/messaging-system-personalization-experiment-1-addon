/* global getClientContext, computeScores, performSanityChecks, uploadEvaluatedFeatures */

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
const configuredScoreThreshold = config.scoreThreshold;

const onError = async e => {
  console.error(e);
  if (e.message.indexOf("NetworkError") > -1) {
    // Do not unenroll on network errors
    return;
  }
  const study = await browser.normandyAddonStudy.getStudy();
  if (study) {
    console.info(
      "An unexpected error was thrown - telling Normandy to end study",
    );
    browser.normandyAddonStudy.endStudy("CAUGHT_ERROR");
  } else {
    console.info(
      "An unexpected error was thrown during development mode / without Normandy - running onUnenroll callback directly",
    );
    onUnenroll("CAUGHT_ERROR");
  }
};

const run = async () => {
  try {
    if (!isEligible()) {
      console.info("Not eligible");
      browser.normandyAddonStudy.endStudy("Not eligible");
    } else {
      console.info("Eligible");
    }

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
  if (config.branch === "control") {
    console.info("Writing hard-coded provider cfr pref", { bucket, cohort });
    await browser.privileged.messagingSystem.setASRouterCfrProviderPref(
      bucket,
      cohort,
    );
    return;
  }

  console.info("Writing hard-coded score threshold", configuredScoreThreshold);
  await browser.privileged.personalizedCfrPrefs.setScoreThreshold(
    configuredScoreThreshold,
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
        console.info(
          `Fetching "cfr-ml-model" bucket contents directly from the remote settings server endpoint`,
        );
        // Imports models from remote settings (`cfr-ml-model` bucket)
        const cfrMlModelsCollectionRecords = await browser.privileged.remoteSettings.fetchFromEndpointDirectly(
          "cfr-ml-model",
        );
        await onModelUpdate(cfrMlModelsCollectionRecords);
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

const onModelUpdate = async cfrMlModelsCollectionRecords => {
  /**
   * @typedef {Object} Model
   * @property {float[]} priors Priors
   * @property {float[][]} delProbs Delta probs
   * @property {float[][]} negProbs Neg probs
   */
  /**
   * @typedef {Object} CfrMlModelsRecord
   * @property {string} version Model version
   * @property {Object.<string, Model>} models_by_cfr_id Models by CFR id
   */

  try {
    /**
     * @type CfrMlModelsRecord
     */
    const cfrMlModelsRecord = cfrMlModelsCollectionRecords[0];

    console.info(`Getting current client context`);
    const clientContext = await getClientContext();

    console.info(
      "Computing scores etc based on the following model and input",
      {
        cfrMlModelsRecord,
        clientContext,
      },
    );
    const { computedScores, booleanFeatures, features } = await computeScores(
      cfrMlModelsRecord,
      clientContext,
      configuredScoreThreshold,
    );

    console.info("Writing computed scores into prefs");
    await browser.privileged.personalizedCfrPrefs.setScores(computedScores);

    const personalizedModelVersion = cfrMlModelsRecord.version;

    console.info("Performing sanity checks");
    await performSanityChecks(computedScores, configuredScoreThreshold);

    console.info(
      "Submitting evaluated features for consumption by the model training job",
    );
    await uploadEvaluatedFeatures(
      personalizedModelVersion,
      clientContext,
      booleanFeatures,
      features,
    );

    console.info(
      "Setting the CFR provider pref with bucket, cohort and personalizedModelVersion",
      { bucket, cohort, personalizedModelVersion },
    );
    await browser.privileged.messagingSystem.setASRouterCfrProviderPref(
      bucket,
      cohort,
      personalizedModelVersion,
    );

    console.info("onModelUpdate callback finished");
  } catch (e) {
    onError(e);
  }
};

browser.normandyAddonStudy.onUnenroll.addListener(async reason => {
  await onUnenroll(reason);
});

run();
