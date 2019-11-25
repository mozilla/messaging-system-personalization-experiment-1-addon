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

    const { extension } = this;

    // Copied here from tree
    function makeWidgetId(id) {
      id = id.toLowerCase();
      return id.replace(/[^a-z0-9_-]/g, "_");
    }

    const widgetId = makeWidgetId(extension.manifest.applications.gecko.id);

    return {
      privileged: {
        testingOverrides: {
          getBlackboxPlaceholderBehavior: async function getBlackboxPlaceholderBehavior() {
            try {
              return Preferences.get(
                `extensions.${widgetId}.test.surveyDaysFromExpiration`,
                false,
              );
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
