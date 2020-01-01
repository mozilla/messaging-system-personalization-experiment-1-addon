# Developing this add-on

## Engineering notes specific to this study

### Understanding what the add-on does and how

This add-on uses console.info and console.debug statements to explain what is going on during runtime.

Access the output from these messages via [about:debugging#/runtime/this-firefox]() -> `Inspect` -> `Console`.

The console statements also serves as documentation within the source code.

### Bundled Experiment APIs

- `addonsMetadata`: Provides som add-on metadata used to determine some contextual client features
- `clientContext`: For probing some of the contextual features on the client
- `messagingSystem`: Access to certain parts of the messaging system
- `personalizedCfrPrefs`: Read and write specific preferences under the `browser.messaging-system.personalized-cfr.*` namespace
- `privacyContext`: Provides some information about private browsing context
- `remoteSettings`: Access up to date remote settings collections contents
- `testingOverrides`: Accesses additional preferences used for study testing

### Background scripts

- `BernoulliNB.js`: Contains a Bernoulli Naive Bayes classifier implementation
- `clientContext.js`: Probes contextual features on the client
- `computeScores.js`: Computes scores
- `performSanityChecks.js`: Various sanity checks for good measure
- `uploadEvaluatedFeatures.js`: Makes evaluated features available to the model training job
- `validate.js`: The generated ajv schema validation class, for validating the telemetry payload before sending the telemetry
- `background.js`: Connects everything

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

## Other useful commands

Runs prettier and eslint --fix, tidying up the source code:

```bash
yarn run format
```

Generates and validates the web extension experiment schema JSON files based on the YAML schema definitions (see [https://github.com/mozilla/webext-experiment-utils]()):

```bash
yarn run generate
```

## Base template

This repository was based on [https://github.com/mozilla/normandy-nextgen-study-example]().
