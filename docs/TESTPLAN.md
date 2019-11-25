# Test plan for this add-on

## Manual / QA TEST Instructions

### Preparations

- Download a Release version of Firefox

### Install the add-on and enroll in the study

- (Create profile: <https://developer.mozilla.org/Firefox/Multiple_profiles>, or via some other method)
- Navigate to _about:config_ and set the following preferences. (If a preference does not exist, create it be right-clicking in the white area and selecting New -> String)
- Set `shieldStudy.logLevel` to `info`. This permits shield-add-on log output in browser console.
- Go to [this experiment's feature bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1234) and install the latest add-on zip file
- (If you are installing an unsigned version of the add-on, you need to set `extensions.legacy.enabled` to `true` before installing the add-on)

### Testing remote settings

Main docs: https://github.com/mozilla/activity-stream/blob/master/docs/v2-system-addon/remote_cfr.md

In a terminal:
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
curl -X PUT ${SERVEwR}/buckets/main/collections/${CID} \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}
curl -X POST ${SERVER}/buckets/main/collections/${CID}/records \
     -d '{"data":{"foo": "bar"}}' \
     -H 'Content-Type:application/json' \
     -u ${BASIC_AUTH}
```

Double check using:

```
curl https://kinto.dev.mozaws.net/v1//buckets/main/collections/cfr-control/records
curl https://kinto.dev.mozaws.net/v1//buckets/main/collections/cfr-experiment/records
curl https://kinto.dev.mozaws.net/v1//buckets/main/collections/cfr-models/records
```

Then, when the add-on is running, run the following in the browser console:

```
Services.prefs.setStringPref("services.settings.server", "https://kinto.dev.mozaws.net/v1");
const { RemoteSettings } = ChromeUtils.import("resource://services-settings/remote-settings.js", {});
RemoteSettings("cfr-control").verifySignature = false;
RemoteSettings("cfr-experiment").verifySignature = false;
RemoteSettings("cfr-models").verifySignature = false;
```

Verify that the dev server messages are loaded via:

```
await RemoteSettings("cfr-control").get()
await RemoteSettings("cfr-experiment").get()
await RemoteSettings("cfr-models").get()
```

Check that they are the same as the values we added above.

Now install the Remote Settings Devtools add-on (Go to https://github.com/mozilla/remote-settings-devtools/releases and install directly from the `remote-settings-devtools@mozilla.com-1.2.0-signed.xpi` release link).

Click the green puzzle icon to visit the devtools.

Next to cfr-models, choose Force sync.

## Expected User Experience / Functionality

No user interface elements are modified directly by this add-on.

### Surveys

No surveys are fired by this add-on.

### Do these tests (in addition to ordinary regression tests)

TODO
