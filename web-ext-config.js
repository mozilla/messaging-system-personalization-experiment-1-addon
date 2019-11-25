/* eslint-env node */

const defaultConfig = {
  run: {
    firefox: process.env.FIREFOX_BINARY || "firefoxdeveloperedition",
    browserConsole: true,
    startUrl: [
      "about:debugging#/runtime/this-firefox",
      "https://github.com/mozilla/remote-settings-devtools/releases",
    ],
    pref: ["extensions.legacy.enabled=true"],
  },
};

module.exports = defaultConfig;
