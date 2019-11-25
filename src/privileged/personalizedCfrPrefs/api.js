/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI */

this.personalizedCfrPrefs = class extends ExtensionAPI {
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
    const prefNameBase = "browser.messaging-system.personalized-cfr";
    return {
      privileged: {
        personalizedCfrPrefs: {
          /* Get the `score-threshold` preference's value */
          getScoreThreshold: async function getScoreThreshold() {
            try {
              const value = Services.prefs.getStringPref(
                `${prefNameBase}.score-threshold`,
              );
              return parseFloat(value);
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Set the `score-threshold` preference's value */
          setScoreThreshold: async function setScoreThreshold(value) {
            try {
              const stringifiedValue = JSON.stringify(value);
              return Services.prefs.setStringPref(
                `${prefNameBase}.score-threshold`,
                stringifiedValue,
              );
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Clear the `score-threshold` preference's non-default value */
          clearScoreThreshold: async function clearScoreThreshold() {
            try {
              return Services.prefs.clearUserPref(
                `${prefNameBase}.score-threshold`,
              );
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get the `scores` preference's value */
          getScores: async function getScores() {
            try {
              const value = Services.prefs.getStringPref(
                `${prefNameBase}.scores`,
              );
              return JSON.parse(value);
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Set the `scores` preference's value */
          setScores: async function setScores(value) {
            try {
              const stringifiedValue = JSON.stringify(value);
              return Services.prefs.setStringPref(
                `${prefNameBase}.scores`,
                stringifiedValue,
              );
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Clear the `scores` preference's non-default value */
          clearScores: async function clearScores() {
            try {
              return Services.prefs.clearUserPref(`${prefNameBase}.scores`);
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get the `model-version` preference's value */
          getModelVersion: async function getModelVersion() {
            try {
              return Services.prefs.getIntPref(`${prefNameBase}.model-version`);
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Set the `model-version` preference's value */
          setModelVersion: async function setModelVersion(value) {
            try {
              return Services.prefs.setIntPref(
                `${prefNameBase}.model-version`,
                value,
              );
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Clear the `model-version` preference's non-default value */
          clearModelVersion: async function clearModelVersion() {
            try {
              return Services.prefs.clearUserPref(
                `${prefNameBase}.model-version`,
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
