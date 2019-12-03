/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI */

"use strict";

this.testingOverrides = class extends ExtensionAPI {
  getAPI(context) {
    const { Preferences } = ChromeUtils.import(
      "resource://gre/modules/Preferences.jsm",
      {},
    );

    const { ExtensionUtils } = ChromeUtils.import(
      "resource://gre/modules/ExtensionUtils.jsm",
      {},
    );
    const { ExtensionError } = ExtensionUtils;

    const addonTestPrefNamespace =
      "extensions.messaging-system-personalization-experiment-1.test";

    return {
      privileged: {
        testingOverrides: {
          getScoringBehaviorOverride: async function getScoringBehaviorOverride() {
            try {
              return Preferences.get(
                `${addonTestPrefNamespace}.scoringBehaviorOverride`,
                false,
              );
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },
          getPeriodicPollingPeriodInMinutesOverride: async function getPeriodicPollingPeriodInMinutesOverride() {
            try {
              const value = Preferences.get(
                `${addonTestPrefNamespace}.periodicPollingPeriodInMinutesOverride`,
                false,
              );
              if (!value) {
                return false;
              }
              return parseFloat(value);
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },
        },
      },
    };
  }
};
