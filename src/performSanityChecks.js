/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(performSanityChecks)" }]*/

const performSanityChecks = async (
  computedScores,
  configuredScoreThreshold,
) => {
  const scoresArray = Object.keys(computedScores).map(
    key => computedScores[key],
  );

  console.info("Checking that scores all are of integer values");
  const foundNonIntegerScore =
    scoresArray.find(score => {
      return !Number.isInteger(score);
    }) !== undefined;
  if (foundNonIntegerScore) {
    throw new Error("Scores must be integer values");
  }

  console.info("Sanity checking written prefs");
  const scoreThresholdReadFromPrefs = await browser.privileged.personalizedCfrPrefs.getScoreThreshold();
  if (scoreThresholdReadFromPrefs !== configuredScoreThreshold) {
    console.debug({
      scoreThresholdReadFromPrefs,
      configuredScoreThreshold,
    });
    throw new Error(
      "The preference-written score threshold is different from the configured score threshold",
    );
  }
  const scoresReadFromPrefs = await browser.privileged.personalizedCfrPrefs.getScores();
  if (JSON.stringify(scoresReadFromPrefs) !== JSON.stringify(computedScores)) {
    console.debug({ scoresReadFromPrefs, computedScores });
    throw new Error(
      "The preference-written scores are different from the computed scores",
    );
  }
  console.info("Sanity checking related targeting getters");
  const asRouterTargetingGetters = await browser.privileged.messagingSystem.getASRouterTargetingGetters(
    ["scores", "scoreThreshold"],
  );
  const { scores, scoreThreshold } = asRouterTargetingGetters;
  if (scoreThreshold !== configuredScoreThreshold) {
    console.debug({
      scoreThreshold,
      configuredScoreThreshold,
    });
    throw new Error(
      "The score threshold from ASRouterTargetingGetters is different from the configured score threshold",
    );
  }
  if (JSON.stringify(scores) !== JSON.stringify(computedScores)) {
    console.debug({ scores, computedScores });
    throw new Error(
      "The scores from ASRouterTargetingGetters are different from the computed scores",
    );
  }
};
