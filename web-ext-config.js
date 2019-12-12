/* eslint-env node */

const defaultConfig = {
  run: {
    firefox: process.env.FIREFOX_BINARY || "firefoxdeveloperedition",
    browserConsole: true,
    startUrl: [
      "about:debugging#/runtime/this-firefox",
      "about:config",
      "https://github.com/mozilla/remote-settings-devtools/releases",
    ],
    pref: [
      "browser.aboutConfig.showWarning=false",
      "extensions.legacy.enabled=true",
      "services.settings.server=https://kinto.dev.mozaws.net/v1",
      "extensions.messaging-system-personalization-experiment-1.test.periodicPollingPeriodInMinutesOverride=0.2",
    ],
  },
};

module.exports = defaultConfig;
