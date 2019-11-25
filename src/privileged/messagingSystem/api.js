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

    const generateCfrProviderPref = (bucket, cohort) => {
      return {
        id: "cfr",
        enabled: true,
        type: "remote-settings",
        bucket,
        frequency: { custom: [{ period: "daily", cap: 1 }] },
        categories: ["cfrAddons", "cfrFeatures"],
        updateCycleInMs: 3600000,
        cohort,
      };
    };

    return {
      privileged: {
        messagingSystem: {
          /* getCfrBucketMessages */
          getCfrBucketMessages: async function getCfrBucketMessages(
            bucket,
            cohort,
          ) {
            try {
              // Get messages from the prepared CFR provider configuration
              // ASRouter reads list of CFR messages from `cfr-experiment`
              const cfrProviderPref = generateCfrProviderPref(bucket, cohort);
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

          /* getASRouterTargetingGetters */
          getASRouterTargetingGetters: async function getASRouterTargetingGetters(
            gettersList,
          ) {
            try {
              const getterValues = await Promise.all(
                gettersList.map(async getterReference => {
                  console.log({ getterReference });
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
          ) {
            try {
              const cfrProviderPref = generateCfrProviderPref(bucket, cohort);
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
              RemoteSettings("cfr-models").on("sync", listener);
              return () => {
                RemoteSettings("cfr-models").off("sync", listener);
              };
            },
          }).api(),
        },
      },
    };
  }
};
