/* eslint-env commonjs */
/* eslint no-unused-vars: off */
/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI */

"use strict";

this.personalizedCfrPrefs = class extends ExtensionAPI {
  getAPI(context) {
    const { Services } = ChromeUtils.import(
      "resource://gre/modules/Services.jsm",
      {},
    );

    const { ExtensionCommon } = ChromeUtils.import(
      "resource://gre/modules/ExtensionCommon.jsm",
      {},
    );

    const { EventManager, EventEmitter } = ExtensionCommon;

    const { ExtensionUtils } = ChromeUtils.import(
      "resource://gre/modules/ExtensionUtils.jsm",
      {},
    );
    const { ExtensionError } = ExtensionUtils;

    const apiEventEmitter = new EventEmitter();
    return {
      privileged: {
        personalizedCfrPrefs: {
          /* Get the `score-threshold` preference's value */
          getScoreThreshold: async function getScoreThreshold() {
            try {
              console.log("Called getScoreThreshold()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Set the `score-threshold` preference's value */
          setScoreThreshold: async function setScoreThreshold(value) {
            try {
              console.log("Called setScoreThreshold(value)", value);
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Clear the `score-threshold` preference's non-default value */
          clearScoreThreshold: async function clearScoreThreshold() {
            try {
              console.log("Called clearScoreThreshold()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get the `scores` preference's value */
          getScores: async function getScores() {
            try {
              console.log("Called getScores()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Set the `scores` preference's value */
          setScores: async function setScores(value) {
            try {
              console.log("Called setScores(value)", value);
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Clear the `scores` preference's non-default value */
          clearScores: async function clearScores() {
            try {
              console.log("Called clearScores()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get the `model-version` preference's value */
          getModelVersion: async function getModelVersion() {
            try {
              console.log("Called getModelVersion()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Set the `model-version` preference's value */
          setModelVersion: async function setModelVersion(value) {
            try {
              console.log("Called setModelVersion(value)", value);
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Clear the `model-version` preference's non-default value */
          clearModelVersion: async function clearModelVersion() {
            try {
              console.log("Called clearModelVersion()");
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
