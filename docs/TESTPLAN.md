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
- Enable the "Enable browser chrome and addon-debugging toolboxes" switch in devtools settings.
- Open the browser console using Firefox's top menu at `Tools > Web Developer > Browser Console`
- Run the following in the browser console:

```
Services.prefs.setStringPref("services.settings.server", "https://kinto.dev.mozaws.net/v1");
const { RemoteSettings } = ChromeUtils.import("resource://services-settings/remote-settings.js", {});
RemoteSettings("cfr-control").verifySignature = false;
RemoteSettings("cfr-experiment").verifySignature = false;
RemoteSettings("cfr-models").verifySignature = false;
```

- Install the Remote Settings Devtools add-on (Go to https://github.com/mozilla/remote-settings-devtools/releases and install directly from the `remote-settings-devtools@mozilla.com-1.2.0-signed.xpi` release link).
- Click the rightmost green puzzle icon to visit the Remote Settings Devtools.
- Verify that the dev server messages are loaded via (run in the Browser Console):

```
await RemoteSettings("cfr-control").get()
await RemoteSettings("cfr-experiment").get()
await RemoteSettings("cfr-models").get()
```

Check that they are the same as the values we added above.

### Enroll in the study and install the add-on

Either install the add-on using a Normandy server or follow the following steps:

- Open the browser console using Firefox's top menu at `Tools > Web Developer > Browser Console`
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

- Go to [this experiment's feature bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1594422) and install either the latest `control` or `treatment` add-on xpi file (Note: if you are installing an unsigned version of the add-on, you need to set `extensions.legacy.enabled` to `true` before installing the add-on)

### Do these tests (in addition to ordinary regression tests)

**Control does nothing but set the CFR bucket and cohort**

- Install the `control` add-on as per above
- Verify that the study runs
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has a bucket value of `cfr-control` and a cohort value of `PERSONALIZATION_EXPERIMENT_1_CONTROL`
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is empty or does not exist
- Visit the Remote Settings Devtools page
- Next to the cfr-models entry, click `Force Sync`.
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is empty or does not exist
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is empty or does not exist

**Treatment sets the CFR bucket and cohort**

- Install the `treatment` add-on as per above
- Verify that the study runs
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has a bucket value of `cfr-experiment` and a cohort value of `PERSONALIZATION_EXPERIMENT_1_TREATMENT`

**Treatment updates scores upon each `cfr-models` Remote Settings bucket update**

- Install the `treatment` add-on as per above
- Verify that the study runs
- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `random_between_0_and_10` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "random_between_0_and_10")`)
- Visit the Remote Settings Devtools page
- Next to the `cfr-models` entry, click `Force Sync`
- Wait a few seconds
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to `1.6`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":X}` where `X` is a value between `0.0` and `10.0`
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is set to an integer (can be `-1` during testing/development)
- Visit the Remote Settings Devtools page
- Next to the `cfr-models` entry, click `Force Sync`
- Wait a few seconds
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to `1.6`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":X}` where `X` is a value between `0.0` and `10.0` (different from last time)
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is set to an integer (can be `-1` during testing/development)

**Treatment updates scores to zero using a testing override**

- Install the `treatment` add-on as per above
- Verify that the study runs
- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `zero` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "zero")`)
- Visit the Remote Settings Devtools page
- Next to the `cfr-models` entry, click `Force Sync`
- Wait a few seconds
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to `1.6`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":0}`
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is set to an integer (can be `-1` during testing/development)

**Treatment updates scores to a value above the threshold using a testing override**

- Install the `treatment` add-on as per above
- Verify that the study runs
- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `fixed_value_over_threshold` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "fixed_value_over_threshold")`)
- Visit the Remote Settings Devtools page
- Next to the `cfr-models` entry, click `Force Sync`
- Wait a few seconds
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to `1.6`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":X}` where `X` is a value above `1.6`
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is set to an integer (can be `-1` during testing/development)

**Treatment updates scores to 2/3 using a testing override**

- Install the `treatment` add-on as per above
- Verify that the study runs
- Add if not exists and set the `extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride` preference to `two_thirds` (`Services.prefs.setStringPref("extensions.messaging-system-personalization-experiment-1.test.scoringBehaviorOverride", "two_thirds")`)
- Visit the Remote Settings Devtools page
- Next to the `cfr-models` entry, click `Force Sync`
- Wait a few seconds
- Verify that the `browser.messaging-system.personalized-cfr.score-threshold` preference is set to `1.6`
- Verify that the `browser.messaging-system.personalized-cfr.scores` preference is set to `{"PERSONALIZED_CFR_MESSAGE":0.6666666666666666}`
- Verify that the `browser.messaging-system.personalized-cfr.model-version` preference is set to an integer (can be `-1` during testing/development)

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
- Verify that the `browser.newtabpage.activity-stream.asrouter.providers.cfr` preference has a bucket value of `cfr` and no cohort value (or at least not one that starts with `PERSONALIZATION_EXPERIMENT_1_`)

## Debug

To see the log output from the add-on, go to `about:debugging#/runtime/this-firefox` and click `Inspect` next to the add-on, then switch to the Console tab. Note that this only works for unsigned builds of the add-on, since the signed builds will not show up here.
