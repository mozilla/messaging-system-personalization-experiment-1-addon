/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(performSanityChecks)" }]*/

const performSanityChecks = async (
  computedScores,
  configuredScoreThreshold,
) => {
  console.debug({ computedScores, configuredScoreThreshold });

  console.info("Sanity checking written prefs");
  const scoreThreshold = await browser.privileged.personalizedCfrPrefs.getScoreThreshold();
  const scores = await browser.privileged.personalizedCfrPrefs.getScores();
  console.debug({ scoreThreshold, scores });
  // TODO: Sanity check
};
