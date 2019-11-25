/* eslint-env commonjs */
/* eslint no-unused-vars: off */
/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI */

"use strict";

this.messagingSystem = class extends ExtensionAPI {
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
        messagingSystem: {
          /* getCfrBucketMessages */
          getCfrBucketMessages: async function getCfrBucketMessages(
            bucket,
            cohort,
          ) {
            try {
              console.log(
                "Called getCfrBucketMessages(bucket, cohort)",
                bucket,
                cohort,
              );
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* getASRouterTargetingGetters */
          getASRouterTargetingGetters: async function getASRouterTargetingGetters(
            gettersList,
          ) {
            try {
              console.log(
                "Called getASRouterTargetingGetters(gettersList)",
                gettersList,
              );
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* setASRouterCfrProviderPref */
          setASRouterCfrProviderPref: async function setASRouterCfrProviderPref(
            bucket,
            cohort,
          ) {
            try {
              console.log(
                "Called setASRouterCfrProviderPref(bucket, cohort)",
                bucket,
                cohort,
              );
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* clearASRouterCfrProviderPref */
          clearASRouterCfrProviderPref: async function clearASRouterCfrProviderPref() {
            try {
              console.log("Called clearASRouterCfrProviderPref()");
              return undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          // https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/events.html
          /* Fires when the Cfr models remote settings bucket has been updated. */
          onCfrModelsSync: new EventManager({
            context,
            name: "privileged.messagingSystem:onCfrModelsSync",
            register: fire => {
              const listener = async (...args) => {
                await fire.async(...args);
              };
              apiEventEmitter.on("cfrModelsSync", listener);
              return () => {
                apiEventEmitter.off("cfrModelsSync", listener);
              };
            },
          }).api(),
        },
      },
    };
  }
};
