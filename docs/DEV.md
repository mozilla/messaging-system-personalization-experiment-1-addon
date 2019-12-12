# Developing this add-on

## Engineering notes specific to this study

### What the add-on does

- Imports model from remote settings (`cfr-ml-model` bucket)
  - Drives update cycle so that the computations gets updated on each update. (No need to in the add-on to hard code a periodic update cycle with this setup.)
- Prepares the updated CFR provider pref that will activate the experiment (modifying `bucket` and `cohort`, but does not set it yet
- Imports
  - Get messages from `MessageLoaderUtils` (in `ASRouter.jsm`) using the prepared CFR provider configuration
  - `MessageLoaderUtils` reads list of CFR messages from `cfr-ml-experiments`
- Imports `ASRouterTargeting.jsm` to get targeting getter values (for model inputs)
- Computes scores
  - Intent is to offload computation during idle and not impact startup performance
- Writes computed scores into prefs
- Sets the prepared CFR provider pref (activates the experiment in the perspective of messaging system) after checking that the relevant prefs are in place
- Error handling: On failure, bail out, revert, end the experiment

### Experiment APIs

- `messagingSystem`: Access to certain parts of the messaging system
- `personalizedCfrPrefs`: Read and write specific preferences under the `browser.messaging-system.personalized-cfr.*` namespace
- `testingOverrides`: Accesses additional preferences used for study testing

### Background scripts

- `background.js` connects everything.

## Development

```bash
yarn install
yarn build
```

Several built add-ons will be placed in `./web-ext-artifacts/`. Each is
nearly identical except for the extension ID, which includes the name of the
variant built. The variants are "control" and "treatment". Nothing changes about the
add-on in each variant except the ID.

## Building and installing the add-on

Builds all variants then runs one of the built variants:

```bash
yarn run start:control
yarn run start:treatment
```
