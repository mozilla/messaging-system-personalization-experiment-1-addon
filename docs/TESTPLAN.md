# Test plan for this add-on

## Manual / QA TEST Instructions

### Expected User Experience / Functionality

The add-on modifies certain preferences that affect how often and which messages from the messaging system are displayed.

For the sake of testing this add-on however, it is enough to verify that the add-on has modified the relevant preferences.

### Surveys

No surveys are fired by this add-on.

### Preparations

- Download a Pre-Release version of Firefox (Firefox Developer Edition or Nightly)
- (Create profile: <https://developer.mozilla.org/Firefox/Multiple_profiles>, or via some other method)

### Using the Remote Settings development server

Until the experiment-specific remote settings buckets (`cfr-control`, `cfr-experiment` and `cfr-models`) are provisioned in a live environment, we use the Remote Settings development server when testing the add-on:

- Check existing Remote Settings development server contents using:

```
curl https://kinto.dev.mozaws.net/v1//buckets/main/collections/cfr-control/records
curl https://kinto.dev.mozaws.net/v1//buckets/main/collections/cfr-experiment/records
curl https://kinto.dev.mozaws.net/v1//buckets/main/collections/cfr-models/records
```

- If there is no data to be found, run the following in a terminal (has to be run once each day the add-on is to be tested since the development server is reset every 24h):

```
SERVER=https://kinto.dev.mozaws.net/v1

# create user
curl -X PUT ${SERVER}/accounts/devuser \
     -d '{"data": {"password": "devpass"}}' \
     -H 'Content-Type:application/json'

BASIC_AUTH=devuser:devpass

# control test data
CID=cfr-control
curl -X PUT ${SERVER}/buckets/main/collections/${CID} \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}
curl -X POST ${SERVER}/buckets/main/collections/${CID}/records \
     -d '{"data":{"id":"panel_local_testing", "cohort": "PERSONALIZATION_EXPERIMENT_1_CONTROL"}}' \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}

# treatment test data
CID=cfr-experiment
curl -X PUT ${SERVER}/buckets/main/collections/${CID} \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}
curl -X POST ${SERVER}/buckets/main/collections/${CID}/records \
     -d '{"data":{"id":"panel_local_testing", "cohort": "PERSONALIZATION_EXPERIMENT_1_TREATMENT"}}' \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}
CID=cfr-models
curl -X PUT ${SERVER}/buckets/main/collections/${CID} \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}
curl -X POST ${SERVER}/buckets/main/collections/${CID}/records \
     -d '{"data":{"foo": "bar"}}' \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}
```

- Start firefox
- Add if not exists and set the `services.settings.server` preference to `https://kinto.dev.mozaws.net/v1`
- Install the Remote Settings Devtools add-on (Go to https://github.com/mozilla/remote-settings-devtools/releases and install directly from the `remote-settings-devtools@mozilla.com-1.2.0-signed.xpi` release link).
- Click the rightmost green puzzle icon to visit the Remote Settings Devtools.
- Verify that the collections `cfr-control`, `cfr-experiment` and `cfr-models` are listed in the Remote Settings Devtools UI
- Verify that the dev server messages from above are listed when clicking on each model in the Remote Settings Devtools UI

### Enroll in the study and install the add-on

Either install the add-on using a Normandy server or follow the following steps:

- Open the browser console using Firefox's top menu at `Tools > Web Developer > Browser Console`
- Go into DevTools -> Settings (F1) and enable the checkbox for "Enable browser chrome and add-on debugging toolboxes"
- Base on the variant that is being tested (control or treatment), run one of the following in the Browser Console:

Treatment:

```js
const { AddonStudies } = ChromeUtils.import(
  "resource://normandy/lib/AddonStudies.jsm",
);
await AddonStudies.add({
  recipeId: 42,
  slug: "messaging-system-personalization-experiment-1-addon",
  userFacingName: "Messaging System Personalization Experiment 1",
  userFacingDescription: "messaging-system-personalization-experiment-1-addon",
  branch: "treatment",
  active: true,
  addonId:
    "messaging-system-personalization-experiment-1-addon-treatment@mozilla.org",
  addonUrl:
    "https://example.com/messaging-system-personalization-experiment-1-addon-treatment@mozilla.org-foo.xpi",
  addonVersion: "0.0.0",
  extensionApiId: 1,
  extensionHash: "badhash",
  hashAlgorithm: "sha256",
  studyStartDate: "2019-11-26T07:00:09.991Z",
  studyEndDate: null,
});
```

Control:

```js
const { AddonStudies } = ChromeUtils.import(
  "resource://normandy/lib/AddonStudies.jsm",
);
await AddonStudies.add({
  recipeId: 42,
  slug: "messaging-system-personalization-experiment-1-addon",
  userFacingName: "Messaging System Personalization Experiment 1",
  userFacingDescription: "messaging-system-personalization-experiment-1-addon",
  branch: "control",
  active: true,
  addonId:
    "messaging-system-personalization-experiment-1-addon-control@mozilla.org",
  addonUrl:
    "https://example.com/messaging-system-personalization-experiment-1-addon-control@mozilla.org-foo.xpi",
  addonVersion: "0.0.0",
  extensionApiId: 1,
  extensionHash: "badhash",
  hashAlgorithm: "sha256",
  studyStartDate: "2019-11-26T07:05:55.772Z",
  studyEndDate: null,
});
```

- Go to [this experiment's feature bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1594422) and note which is the latest set of add-on xpi files
- If the tested add-on is signed with the testing certificate set the following pref:
  - Have the "xpinstall.signatures.required" boolean pref to "false".
  - Have the "xpinstall.signatures.dev-root" boolean pref created with the "true" value.
- If the tested add-on is not signed
  - Have the "extensions.legacy.enabled" boolean pref created with the "true" value.
- Install either the latest `control` or `treatment` add-on xpi file

### Do these tests (in addition to ordinary regression tests)

**Control does nothing but set the CFR bucket and cohort**

- Install the `control` add-on as per above
- Verify that the study runs
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has the following attributes:
  - `bucket: "cfr-control"`
  - `cohort: "PERSONALIZATION_EXPERIMENT_1_CONTROL"`
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference does not have the following attributes:
  - `personalized`
  - `personalizedModelVersion`
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is empty or does not exist
- Visit the Remote Settings Devtools page
- Next to the cfr-models entry, click `Force Sync`.
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is empty or does not exist

**Treatment does not set the CFR bucket and cohort before the first update cycle has finisheds**

- Install the `treatment` add-on as per above
- Verify that the study runs
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has a `bucket` attribute with a value of `cfr`, no `cohort` attribute (or at least not one that starts with `PERSONALIZATION_EXPERIMENT_1_`), no `personalized` attribute and no `personalizedModelVersion` attribute.

**Treatment updates scores upon each `cfr-models` Remote Settings bucket update**

- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `random_between_1_and_9999` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "random_between_1_and_9999")`)
- Install the `treatment` add-on as per above
- Verify that the study runs
- Wait about 10 seconds for the first sync to be triggered
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to integer `5000`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":X}` where `X` is a value between `1` and `9999`
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has the following attributes:
  - `bucket: "cfr-experiment"`
  - `cohort: "PERSONALIZATION_EXPERIMENT_1_TREATMENT"`
  - `personalized: true`
  - `personalizedModelVersion: "X"` where X is any string (can be `"-1"` during testing/development)
- Either wait 60 minutes or:
  - Visit the Remote Settings Devtools page
  - Next to the `cfr-models` entry, click `Force Sync`
  - Wait a few seconds
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to integer `5000`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":X}` where `X` is a value between `1` and `9999` (different from last time)
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has the following attributes:
  - `bucket: "cfr-experiment"`
  - `cohort: "PERSONALIZATION_EXPERIMENT_1_TREATMENT"`
  - `personalized: true`
  - `personalizedModelVersion: "X"` where X is any string (can be `"-1"` during testing/development)

**Treatment force syncs `cfr-models` Remote Settings bucket contents periodically using a testing override**

- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.periodicPollingPeriodInMinutesOverride` preference to `0.1` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.periodicPollingPeriodInMinutesOverride", "0.1")`)
- Install the `treatment` add-on as per above
- Verify that the study runs
- Wait about 10 seconds for the first sync to be triggered
- Verify that new updates are triggered about every 6 seconds

**Treatment force syncs `cfr-models` Remote Settings bucket contents periodically**

- Clear/remove the `extensions.messaging-system-personalization-experiment-1.test.periodicPollingPeriodInMinutesOverride` preference if exists (`Services.prefs.clearUserPref("extensions.messaging-system-personalization-experiment-1.test.periodicPollingPeriodInMinutesOverride")`)
- Install the `treatment` add-on as per above
- Verify that the study runs
- Wait about 10 seconds for the first sync to be triggered
- Verify that new updates are triggered every 60 minutes

**Treatment updates scores to zero using a testing override**

- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `fixed_value_0` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "fixed_value_0")`)
- Install the `treatment` add-on as per above
- Verify that the study runs
- Wait about 10 seconds for the first sync to be triggered
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to integer `5000`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":0}`
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has the following attributes:
  - `bucket: "cfr-experiment"`
  - `cohort: "PERSONALIZATION_EXPERIMENT_1_TREATMENT"`
  - `personalized: true`
  - `personalizedModelVersion: "X"` where X is any string (can be `"-1"` during testing/development)

**Treatment updates scores to 10000 using a testing override**

- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `fixed_value_10000` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "fixed_value_10000")`)
- Install the `treatment` add-on as per above
- Verify that the study runs
- Wait about 10 seconds for the first sync to be triggered
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to integer `5000`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":10000}`
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has the following attributes:
  - `bucket: "cfr-experiment"`
  - `cohort: "PERSONALIZATION_EXPERIMENT_1_TREATMENT"`
  - `personalized: true`
  - `personalizedModelVersion: "X"` where X is any string (can be `"-1"` during testing/development)

**Treatment updates scores to a value above the threshold using a testing override**

- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `fixed_value_slightly_over_threshold` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "fixed_value_slightly_over_threshold")`)
- Install the `treatment` add-on as per above
- Verify that the study runs
- Wait about 10 seconds for the first sync to be triggered
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to integer `5000`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":X}` where `X` is a value above `5000`
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has the following attributes:
  - `bucket: "cfr-experiment"`
  - `cohort: "PERSONALIZATION_EXPERIMENT_1_TREATMENT"`
  - `personalized: true`
  - `personalizedModelVersion: "X"` where X is any string (can be `"-1"` during testing/development)

**Treatment updates scores to a value above the threshold using a testing override**

- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `fixed_value_slightly_over_threshold` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "fixed_value_slightly_over_threshold")`)
- Install the `treatment` add-on as per above
- Verify that the study runs
- Wait about 10 seconds for the first sync to be triggered
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to integer `5000`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":X}` where `X` is a value above `5000`
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has the following attributes:
  - `bucket: "cfr-experiment"`
  - `cohort: "PERSONALIZATION_EXPERIMENT_1_TREATMENT"`
  - `personalized: true`
  - `personalizedModelVersion: "X"` where X is any string (can be `"-1"` during testing/development)

**Not showing in `about:addons`**

- Install a signed add-on as per above
- Verify that the study runs
- Verify that the study does not show up in `about:addons` (note: only signed study add-ons are hidden)

**Cleans up preferences upon Normandy unenrollment**

- Enroll a client using the Normandy staging server
- Verify that the study runs
- Verify that `browser.messaging-system.personalized-cfr.score-threshold` has a non-default value
- Unenroll a client using the Normandy staging server
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is empty or does not exist
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has a `bucket` attribute with a value of `cfr`, no `cohort` attribute (or at least not one that starts with `PERSONALIZATION_EXPERIMENT_1_`), no `personalized` attribute and no `personalizedModelVersion` attribute.

## Debug

To see the log output from the add-on, go to `about:debugging#/runtime/this-firefox` and click `Inspect` next to the add-on, then switch to the Console tab. Note that this only works for unsigned builds of the add-on, since the signed builds will not show up here.
