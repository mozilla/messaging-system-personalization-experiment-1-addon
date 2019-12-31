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

    const { EventManager } = ExtensionCommon;

    const { ExtensionUtils } = ChromeUtils.import(
      "resource://gre/modules/ExtensionUtils.jsm",
      {},
    );
    const { ExtensionError } = ExtensionUtils;

    const { TelemetryFeed } = ChromeUtils.import(
      "resource://activity-stream/lib/TelemetryFeed.jsm",
      {},
    );
    const { RemoteSettings } = ChromeUtils.import(
      "resource://services-settings/remote-settings.js",
      {},
    );
    const { ASRouterTargeting } = ChromeUtils.import(
      "resource://activity-stream/lib/ASRouterTargeting.jsm",
      {},
    );
    const { MessageLoaderUtils } = ChromeUtils.import(
      "resource://activity-stream/lib/ASRouter.jsm",
      {},
    );

    const PREF_ASROUTER_CFR_PROVIDER =
      "browser.newtabpage.activity-stream.asrouter.providers.cfr";

    const getUpdatedCfrProviderPref = (
      bucket,
      cohort,
      personalizedModelVersion = null,
    ) => {
      const existingValue = Services.prefs.getStringPref(
        PREF_ASROUTER_CFR_PROVIDER,
      );
      if (!existingValue) {
        throw new Error(
          `The return value when getting the "${PREF_ASROUTER_CFR_PROVIDER}" pref is not truthy`,
        );
      }
      const parsedExistingValue = JSON.parse(existingValue);
      let newValue = {
        ...parsedExistingValue,
        bucket,
        cohort,
      };
      if (personalizedModelVersion !== null) {
        newValue = {
          ...newValue,
          personalized: true,
          personalizedModelVersion: String(personalizedModelVersion),
        };
      }
      return newValue;
    };

    return {
      privileged: {
        messagingSystem: {
          /* getCfrProviderMessages */
          getCfrProviderMessages: async function getCfrProviderMessages(
            bucket,
            cohort,
          ) {
            try {
              // Get messages from the prepared CFR provider configuration
              // ASRouter reads list of CFR messages from `cfr-ml-experiments`
              const cfrProviderPref = getUpdatedCfrProviderPref(bucket, cohort);
              return MessageLoaderUtils.loadMessagesForProvider(
                cfrProviderPref,
                {},
              );
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* getOrCreateImpressionId */
          getOrCreateImpressionId: async function getOrCreateImpressionId() {
            try {
              const tf = new TelemetryFeed();
              return tf.getOrCreateImpressionId();
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
              const getterValues = await Promise.all(
                gettersList.map(async getterReference => {
                  return ASRouterTargeting.Environment[getterReference];
                }),
              );
              return Object.assign(
                {},
                ...gettersList.map((n, index) => ({
                  [n]: getterValues[index],
                })),
              );
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
            personalizedModelVersion = null,
          ) {
            try {
              const cfrProviderPref = getUpdatedCfrProviderPref(
                bucket,
                cohort,
                personalizedModelVersion,
              );
              const stringifiedValue = JSON.stringify(cfrProviderPref);
              return Services.prefs.setStringPref(
                PREF_ASROUTER_CFR_PROVIDER,
                stringifiedValue,
              );
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* clearASRouterCfrProviderPref */
          clearASRouterCfrProviderPref: async function clearASRouterCfrProviderPref() {
            try {
              return Services.prefs.clearUserPref(PREF_ASROUTER_CFR_PROVIDER);
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
              RemoteSettings("cfr-ml-model").on("sync", listener);
              return () => {
                RemoteSettings("cfr-ml-model").off("sync", listener);
              };
            },
          }).api(),
        },
      },
    };
  }
};
