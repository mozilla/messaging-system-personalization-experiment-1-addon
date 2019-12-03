/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI, XPCOMUtils */

"use strict";

ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetters(this, {
  RemoteSettings: "resource://services-settings/remote-settings.js",
});

async function getState() {
  const inspected = await RemoteSettings.inspect();
  return {
    pollingEndpoint: RemoteSettings.pollingEndpoint,
    ...inspected,
  };
}

const allowListedCollections = ["cfr-control", "cfr-experiment", "cfr-models"];

this.remoteSettings = class extends ExtensionAPI {
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
        remoteSettings: {
          getState,
          /* Triggers a synchronization at the level only for the specified collection */
          clearLocalDataAndForceSync: async function clearLocalDataAndForceSync(
            collection,
          ) {
            if (!allowListedCollections.includes(collection)) {
              throw new ExtensionError(
                `This method is not allowed for collection "${collection}"`,
              );
            }
            try {
              const client = RemoteSettings(collection);
              // Enable use of the dev server collections
              if (
                Services.prefs.getStringPref("services.settings.server") ===
                "https://kinto.dev.mozaws.net/v1"
              ) {
                client.verifySignature = false;
              }
              Services.prefs.clearUserPref(client.lastCheckTimePref);
              const kintoCol = await client.openCollection();
              await kintoCol.clear();
              await client.sync();
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
