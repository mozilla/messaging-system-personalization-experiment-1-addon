/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI */

"use strict";

this.clientContext = class extends ExtensionAPI {
  getAPI(context) {
    const { Services } = ChromeUtils.import(
      "resource://gre/modules/Services.jsm",
      {},
    );
    const { ExtensionUtils } = ChromeUtils.import(
      "resource://gre/modules/ExtensionUtils.jsm",
      {},
    );
    const { ExtensionError } = ExtensionUtils;

    return {
      privileged: {
        clientContext: {
          /* Get scalar: active_ticks */
          getActiveTicks: async function getActiveTicks() {
            try {
              console.log("Called getActiveTicks()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get scalar: total_uri_count */
          getTotalUriCount: async function getTotalUriCount() {
            try {
              console.log("Called getTotalUriCount()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get number of prefs changed (specifically those in about:preferences) */
          getAboutPreferencesNonDefaultValueCount: async function getAboutPreferencesNonDefaultValueCount() {
            try {
              // loop through the prefs listed in https://dxr.mozilla.org/mozilla-central/source/browser/locales/en-US/browser/preferences/preferences.ftl, and look for non-default values (https://dxr.mozilla.org/mozilla-central/source/browser/components/aboutconfig/content/aboutconfig.js#106-111)
              console.log("Called getAboutPreferencesNonDefaultValueCount()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get whether or not Firefox accounts are configured */
          getFxAConfigured: async function getFxAConfigured() {
            try {
              // , based on identity.fxaccounts.account.device.name and identity.fxaccounts.lastSignedInUserHash
              console.log("Called getFxAConfigured()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get if dark mode is active or not */
          getDarkModeActive: async function getDarkModeActive() {
            try {
              return Services.prefs.getBoolPref(`browser.in-content.dark-mode`);
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get count of logins saved in the browser */
          getLoginsSavedInBrowserCount: async function getLoginsSavedInBrowserCount() {
            try {
              //  await Services.logins.getAllLogins();
              console.log("Called getLoginsSavedInBrowserCount()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get main monitor screen width */
          getMainMonitorScreenWidth: async function getMainMonitorScreenWidth() {
            try {
              // environment.system.gfx.monitors[0].screenWidth
              console.log("Called getMainMonitorScreenWidth()");
              return undefined;
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
