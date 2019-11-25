# Developing this add-on

## Engineering notes specific to this study

### General workflow

- Imports model from remote settings (`personalized-cfr-models` bucket)
  - Drives update cycle so that the computations gets updated on each update. No need to in the add-on to hard code an update cycle with this setup.
- Prepares the updated CFR provider pref that will activate the experiment, but does not set it yet
- Imports `ASRouter.jsm`
  - Get messages from the prepared CFR provider configuration
  - ASRouter reads list of CFR messages from `cfr-experiment`
- Imports `ASRouterTargeting.jsm` to get model inputs
- Writes computed scores into prefs
  - Intent is to offload computation during idle and not impact startup performance
- Sets the prepared CFR provider pref (activates the experiment in the perspective of messaging system) after checking that the relevant prefs are in place
- Error handling: On failure, bail out, revert, end the experiment
