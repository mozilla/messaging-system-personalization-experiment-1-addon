/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI, Ci */

"use strict";

this.addonsMetadata = class extends ExtensionAPI {
  getAPI(context) {
    const { TelemetryEnvironment } = ChromeUtils.import(
      "resource://gre/modules/TelemetryEnvironment.jsm",
    );
    const { TelemetryUtils } = ChromeUtils.import(
      "resource://gre/modules/TelemetryUtils.jsm",
    );
    const Utils = TelemetryUtils;
    const { AddonManager } = ChromeUtils.import(
      "resource://gre/modules/AddonManager.jsm",
    );

    const { ExtensionUtils } = ChromeUtils.import(
      "resource://gre/modules/ExtensionUtils.jsm",
      {},
    );
    const { ExtensionError } = ExtensionUtils;

    return {
      privileged: {
        addonsMetadata: {
          /* getListOfInstalledAddons */
          getListOfInstalledAddons: async function getListOfInstalledAddons() {
            try {
              await TelemetryEnvironment.onInitialized();

              // Use general addon metadata from the already prepared addons information in the telemetry environment
              const telAddons =
                TelemetryEnvironment.currentEnvironment.addons.activeAddons;

              // Return general addon metadata as an array
              return Object.keys(telAddons).map(addonId => {
                return {
                  ...telAddons[addonId],
                  id: addonId,
                };
              });
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* getListOfInstalledThemes */
          getListOfInstalledThemes: async function getListOfInstalledThemes() {
            try {
              // The maximum length of a string (e.g. description) in the addons section.
              const MAX_ADDON_STRING_LENGTH = 100;

              /**
               * Enforces the parameter to a boolean value.
               * @param aValue The input value.
               * @return {Boolean|Object} If aValue is a boolean or a number, returns its truthfulness
               *         value. Otherwise, return null.
               */
              const enforceBoolean = aValue => {
                if (typeof aValue !== "number" && typeof aValue !== "boolean") {
                  return null;
                }
                return Boolean(aValue);
              };

              /**
               * Returns a substring of the input string.
               *
               * @param {String} aString The input string.
               * @param {Integer} aMaxLength The maximum length of the returned substring. If this is
               *        greater than the length of the input string, we return the whole input string.
               * @return {String} The substring or null if the input string is null.
               */
              const limitStringToLength = (aString, aMaxLength) => {
                if (typeof aString !== "string") {
                  return null;
                }
                return aString.substring(0, aMaxLength);
              };

              // Request themes, asynchronously.
              const { addons: themes } = await AddonManager.getActiveAddons([
                "theme",
              ]);

              // Return theme information in the same format as TelemetryEnvironment._getActiveTheme
              return themes.map(theme => {
                // Make sure to have valid dates.
                const installDate = new Date(Math.max(0, theme.installDate));
                const updateDate = new Date(Math.max(0, theme.updateDate));

                return {
                  id: theme.id,
                  blocklisted:
                    theme.blocklistState !==
                    Ci.nsIBlocklistService.STATE_NOT_BLOCKED,
                  description: limitStringToLength(
                    theme.description,
                    MAX_ADDON_STRING_LENGTH,
                  ),
                  name: limitStringToLength(
                    theme.name,
                    MAX_ADDON_STRING_LENGTH,
                  ),
                  userDisabled: enforceBoolean(theme.userDisabled),
                  appDisabled: theme.appDisabled,
                  version: limitStringToLength(
                    theme.version,
                    MAX_ADDON_STRING_LENGTH,
                  ),
                  scope: theme.scope,
                  foreignInstall: enforceBoolean(theme.foreignInstall),
                  hasBinaryComponents: false,
                  installDay: Utils.millisecondsToDays(installDate.getTime()),
                  updateDay: Utils.millisecondsToDays(updateDate.getTime()),
                };
              });
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
