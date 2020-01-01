/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(performSanityChecks)" }]*/

const performSanityChecks = async (
  computedScores,
  configuredScoreThreshold,
) => {
  console.debug({ computedScores });

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
