/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI, Ci */

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

    const { TelemetrySession } = ChromeUtils.import(
      "resource://gre/modules/TelemetrySession.jsm",
      {},
    );
    const { TelemetryEnvironment } = ChromeUtils.import(
      "resource://gre/modules/TelemetryEnvironment.jsm",
      {},
    );
    const { UpdateUtils } = ChromeUtils.import(
      "resource://gre/modules/UpdateUtils.jsm",
      {},
    );

    // Based on https://dxr.mozilla.org/mozilla-central/source/browser/components/aboutconfig/content/aboutconfig.js#106-111
    const GETTERS_BY_PREF_TYPE = {
      [Ci.nsIPrefBranch.PREF_BOOL]: "getBoolPref",
      [Ci.nsIPrefBranch.PREF_INT]: "getIntPref",
      [Ci.nsIPrefBranch.PREF_STRING]: "getStringPref",
    };
    const gDefaultBranch = Services.prefs.getDefaultBranch("");
    const hasDefaultValue = prefName => {
      const prefType = Services.prefs.getPrefType(prefName);
      // Non-existing pref values are treated as default values
      if (prefType === 0) {
        return true;
      }
      try {
        const getter = GETTERS_BY_PREF_TYPE[prefType];
        gDefaultBranch[getter](prefName);
        return true;
      } catch (ex) {
        if (ex.name === "NS_ERROR_UNEXPECTED") {
          return false;
        }
        const errorMessage = "Get default branch value unexpected exception";
        console.debug(errorMessage, ex, {
          prefName,
          prefType,
        });
        throw new ExtensionError(errorMessage);
      }
    };

    return {
      privileged: {
        clientContext: {
          /* Get scalar: active_ticks */
          getActiveTicks: async function getActiveTicks() {
            try {
              const payload = TelemetrySession.getPayload();
              return payload.simpleMeasurements.activeTicks;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get scalar: total_uri_count */
          getTotalUriCount: async function getTotalUriCount() {
            try {
              const mainParentProcessScalars = Services.telemetry.getSnapshotForScalars(
                "main",
                false,
              ).parent;
              return mainParentProcessScalars[
                "browser.engagement.total_uri_count"
              ];
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get number of prefs changed (specifically those in about:preferences) */
          getAboutPreferencesNonDefaultValueCount: async function getAboutPreferencesNonDefaultValueCount() {
            try {
              // Note: The list of preferences shown on about:preferences that we check are the ones
              // that are found as arguments to Preferences.addAll() in mozilla-central/browser/components/preferences
              // hence this copy-paste way of getting that list into this method's code block
              const getPreferencesToCheck = () => {
                let prefs = [];
                const Preferences = {
                  addAll: addedPrefs => {
                    prefs = [...prefs, ...addedPrefs];
                  },
                };

                // fonts.js
                Preferences.addAll([
                  { id: "font.language.group", type: "wstring" },
                  { id: "browser.display.use_document_fonts", type: "int" },
                  { id: "intl.charset.fallback.override", type: "string" },
                ]);

                // sanitize.js
                Preferences.addAll([
                  { id: "privacy.clearOnShutdown.history", type: "bool" },
                  { id: "privacy.clearOnShutdown.formdata", type: "bool" },
                  { id: "privacy.clearOnShutdown.downloads", type: "bool" },
                  { id: "privacy.clearOnShutdown.cookies", type: "bool" },
                  { id: "privacy.clearOnShutdown.cache", type: "bool" },
                  { id: "privacy.clearOnShutdown.offlineApps", type: "bool" },
                  { id: "privacy.clearOnShutdown.sessions", type: "bool" },
                  { id: "privacy.clearOnShutdown.siteSettings", type: "bool" },
                ]);

                // search.js
                Preferences.addAll([
                  { id: "browser.search.suggest.enabled", type: "bool" },
                  { id: "browser.urlbar.suggest.searches", type: "bool" },
                  { id: "browser.search.hiddenOneOffs", type: "unichar" },
                  { id: "browser.search.widget.inNavBar", type: "bool" },
                  { id: "browser.urlbar.matchBuckets", type: "string" },
                ]);

                // connection.js

                Preferences.addAll([
                  // Add network.proxy.autoconfig_url before network.proxy.type so they're
                  // both initialized when network.proxy.type initialization triggers a call to
                  // gConnectionsDialog.updateReloadButton().
                  { id: "network.proxy.autoconfig_url", type: "string" },
                  { id: "network.proxy.type", type: "int" },
                  { id: "network.proxy.http", type: "string" },
                  { id: "network.proxy.http_port", type: "int" },
                  { id: "network.proxy.ftp", type: "string" },
                  { id: "network.proxy.ftp_port", type: "int" },
                  { id: "network.proxy.ssl", type: "string" },
                  { id: "network.proxy.ssl_port", type: "int" },
                  { id: "network.proxy.socks", type: "string" },
                  { id: "network.proxy.socks_port", type: "int" },
                  { id: "network.proxy.socks_version", type: "int" },
                  { id: "network.proxy.socks_remote_dns", type: "bool" },
                  { id: "network.proxy.no_proxies_on", type: "string" },
                  { id: "network.proxy.share_proxy_settings", type: "bool" },
                  { id: "signon.autologin.proxy", type: "bool" },
                  {
                    id: "pref.advanced.proxies.disable_button.reload",
                    type: "bool",
                  },
                  { id: "network.proxy.backup.ftp", type: "string" },
                  { id: "network.proxy.backup.ftp_port", type: "int" },
                  { id: "network.proxy.backup.ssl", type: "string" },
                  { id: "network.proxy.backup.ssl_port", type: "int" },
                  { id: "network.proxy.backup.socks", type: "string" },
                  { id: "network.proxy.backup.socks_port", type: "int" },
                  { id: "network.trr.mode", type: "int" },
                  { id: "network.trr.uri", type: "string" },
                  { id: "network.trr.resolvers", type: "string" },
                  { id: "network.trr.custom_uri", type: "string" },
                ]);

                // languages.js
                Preferences.addAll([
                  { id: "intl.accept_languages", type: "wstring" },
                  {
                    id: "pref.browser.language.disable_button.up",
                    type: "bool",
                  },
                  {
                    id: "pref.browser.language.disable_button.down",
                    type: "bool",
                  },
                  {
                    id: "pref.browser.language.disable_button.remove",
                    type: "bool",
                  },
                  { id: "privacy.spoof_english", type: "int" },
                ]);

                // syncChooseWhatToSync.js
                Preferences.addAll([
                  { id: "services.sync.engine.addons", type: "bool" },
                  { id: "services.sync.engine.bookmarks", type: "bool" },
                  { id: "services.sync.engine.history", type: "bool" },
                  { id: "services.sync.engine.tabs", type: "bool" },
                  { id: "services.sync.engine.prefs", type: "bool" },
                  { id: "services.sync.engine.passwords", type: "bool" },
                  { id: "services.sync.engine.addresses", type: "bool" },
                  { id: "services.sync.engine.creditcards", type: "bool" },
                ]);

                // privacy.js
                const { AppConstants } = ChromeUtils.import(
                  "resource://gre/modules/AppConstants.jsm",
                );

                const PREF_OPT_OUT_STUDIES_ENABLED =
                  "app.shield.optoutstudies.enabled";
                const PREF_ADDON_RECOMMENDATIONS_ENABLED =
                  "browser.discovery.enabled";
                const PREF_UPLOAD_ENABLED =
                  "datareporting.healthreport.uploadEnabled";

                Preferences.addAll([
                  // Content blocking / Tracking Protection
                  { id: "privacy.trackingprotection.enabled", type: "bool" },
                  {
                    id: "privacy.trackingprotection.pbmode.enabled",
                    type: "bool",
                  },
                  {
                    id: "privacy.trackingprotection.fingerprinting.enabled",
                    type: "bool",
                  },
                  {
                    id: "privacy.trackingprotection.cryptomining.enabled",
                    type: "bool",
                  },

                  // Social tracking
                  {
                    id: "privacy.trackingprotection.socialtracking.enabled",
                    type: "bool",
                  },
                  {
                    id: "privacy.socialtracking.block_cookies.enabled",
                    type: "bool",
                  },

                  // Tracker list
                  { id: "urlclassifier.trackingTable", type: "string" },

                  // Button prefs
                  {
                    id: "pref.privacy.disable_button.cookie_exceptions",
                    type: "bool",
                  },
                  {
                    id: "pref.privacy.disable_button.view_cookies",
                    type: "bool",
                  },
                  {
                    id: "pref.privacy.disable_button.change_blocklist",
                    type: "bool",
                  },
                  {
                    id:
                      "pref.privacy.disable_button.tracking_protection_exceptions",
                    type: "bool",
                  },

                  // Location Bar
                  { id: "browser.urlbar.suggest.bookmark", type: "bool" },
                  { id: "browser.urlbar.suggest.history", type: "bool" },
                  { id: "browser.urlbar.suggest.openpage", type: "bool" },

                  // History
                  { id: "places.history.enabled", type: "bool" },
                  { id: "browser.formfill.enable", type: "bool" },
                  { id: "privacy.history.custom", type: "bool" },
                  // Cookies
                  { id: "network.cookie.cookieBehavior", type: "int" },
                  { id: "network.cookie.lifetimePolicy", type: "int" },
                  { id: "network.cookie.blockFutureCookies", type: "bool" },
                  // Content blocking category
                  { id: "browser.contentblocking.category", type: "string" },
                  {
                    id: "browser.contentblocking.features.strict",
                    type: "string",
                  },

                  // Clear Private Data
                  { id: "privacy.sanitize.sanitizeOnShutdown", type: "bool" },
                  { id: "privacy.sanitize.timeSpan", type: "int" },
                  // Do not track
                  { id: "privacy.donottrackheader.enabled", type: "bool" },

                  // Media
                  { id: "media.autoplay.default", type: "int" },

                  // Popups
                  { id: "dom.disable_open_during_load", type: "bool" },
                  // Passwords
                  { id: "signon.rememberSignons", type: "bool" },
                  { id: "signon.generation.enabled", type: "bool" },
                  { id: "signon.autofillForms", type: "bool" },
                  {
                    id: "signon.management.page.breach-alerts.enabled",
                    type: "bool",
                  },

                  // Buttons
                  {
                    id: "pref.privacy.disable_button.view_passwords",
                    type: "bool",
                  },
                  {
                    id: "pref.privacy.disable_button.view_passwords_exceptions",
                    type: "bool",
                  },

                  /* Certificates tab
                   * security.default_personal_cert
                   *   - a string:
                   *       "Select Automatically"   select a certificate automatically when a site
                   *                                requests one
                   *       "Ask Every Time"         present a dialog to the user so he can select
                   *                                the certificate to use on a site which
                   *                                requests one
                   */
                  { id: "security.default_personal_cert", type: "string" },

                  {
                    id: "security.disable_button.openCertManager",
                    type: "bool",
                  },

                  {
                    id: "security.disable_button.openDeviceManager",
                    type: "bool",
                  },

                  { id: "security.OCSP.enabled", type: "int" },

                  // Add-ons, malware, phishing
                  { id: "xpinstall.whitelist.required", type: "bool" },

                  { id: "browser.safebrowsing.malware.enabled", type: "bool" },
                  { id: "browser.safebrowsing.phishing.enabled", type: "bool" },

                  {
                    id: "browser.safebrowsing.downloads.enabled",
                    type: "bool",
                  },

                  { id: "urlclassifier.malwareTable", type: "string" },

                  {
                    id:
                      "browser.safebrowsing.downloads.remote.block_potentially_unwanted",
                    type: "bool",
                  },
                  {
                    id: "browser.safebrowsing.downloads.remote.block_uncommon",
                    type: "bool",
                  },
                ]);

                // Study opt out
                if (AppConstants.MOZ_DATA_REPORTING) {
                  Preferences.addAll([
                    // Preference instances for prefs that we need to monitor while the page is open.
                    { id: PREF_OPT_OUT_STUDIES_ENABLED, type: "bool" },
                    { id: PREF_ADDON_RECOMMENDATIONS_ENABLED, type: "bool" },
                    { id: PREF_UPLOAD_ENABLED, type: "bool" },
                  ]);
                }

                // home.js
                Preferences.addAll([
                  { id: "browser.startup.homepage", type: "wstring" },
                  {
                    id: "pref.browser.homepage.disable_button.current_page",
                    type: "bool",
                  },
                  {
                    id: "pref.browser.homepage.disable_button.bookmark_page",
                    type: "bool",
                  },
                  {
                    id: "pref.browser.homepage.disable_button.restore_default",
                    type: "bool",
                  },
                  { id: "browser.newtabpage.enabled", type: "bool" },
                ]);

                // main.js
                Preferences.addAll([
                  // Startup
                  { id: "browser.startup.page", type: "int" },
                  { id: "browser.privatebrowsing.autostart", type: "bool" },
                  { id: "browser.sessionstore.warnOnQuit", type: "bool" },

                  // Downloads
                  { id: "browser.download.useDownloadDir", type: "bool" },
                  { id: "browser.download.folderList", type: "int" },
                  { id: "browser.download.dir", type: "file" },

                  /* Tab preferences
                  Preferences:

                  browser.link.open_newwindow
                      1 opens such links in the most recent window or tab,
                      2 opens such links in a new window,
                      3 opens such links in a new tab
                  browser.tabs.loadInBackground
                  - true if display should switch to a new tab which has been opened from a
                    link, false if display shouldn't switch
                  browser.tabs.warnOnClose
                  - true if when closing a window with multiple tabs the user is warned and
                    allowed to cancel the action, false to just close the window
                  browser.tabs.warnOnOpen
                  - true if the user should be warned if he attempts to open a lot of tabs at
                    once (e.g. a large folder of bookmarks), false otherwise
                  browser.taskbar.previews.enable
                  - true if tabs are to be shown in the Windows 7 taskbar
                  */

                  { id: "browser.link.open_newwindow", type: "int" },
                  {
                    id: "browser.tabs.loadInBackground",
                    type: "bool",
                    inverted: true,
                  },
                  { id: "browser.tabs.warnOnClose", type: "bool" },
                  { id: "browser.tabs.warnOnOpen", type: "bool" },
                  { id: "browser.ctrlTab.recentlyUsedOrder", type: "bool" },

                  // CFR
                  {
                    id:
                      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons",
                    type: "bool",
                  },
                  {
                    id:
                      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features",
                    type: "bool",
                  },

                  // Fonts
                  { id: "font.language.group", type: "wstring" },

                  // Languages
                  { id: "browser.translation.detectLanguage", type: "bool" },

                  // General tab

                  /* Accessibility
                   * accessibility.browsewithcaret
                     - true enables keyboard navigation and selection within web pages using a
                       visible caret, false uses normal keyboard navigation with no caret
                   * accessibility.typeaheadfind
                     - when set to true, typing outside text areas and input boxes will
                       automatically start searching for what's typed within the current
                       document; when set to false, no search action happens */
                  { id: "accessibility.browsewithcaret", type: "bool" },
                  { id: "accessibility.typeaheadfind", type: "bool" },
                  { id: "accessibility.blockautorefresh", type: "bool" },

                  /* Browsing
                   * general.autoScroll
                     - when set to true, clicking the scroll wheel on the mouse activates a
                       mouse mode where moving the mouse down scrolls the document downward with
                       speed correlated with the distance of the cursor from the original
                       position at which the click occurred (and likewise with movement upward);
                       if false, this behavior is disabled
                   * general.smoothScroll
                     - set to true to enable finer page scrolling than line-by-line on page-up,
                       page-down, and other such page movements */
                  { id: "general.autoScroll", type: "bool" },
                  { id: "general.smoothScroll", type: "bool" },
                  { id: "layout.spellcheckDefault", type: "int" },

                  {
                    id:
                      "browser.preferences.defaultPerformanceSettings.enabled",
                    type: "bool",
                  },
                  { id: "dom.ipc.processCount", type: "int" },
                  { id: "dom.ipc.processCount.web", type: "int" },
                  {
                    id: "layers.acceleration.disabled",
                    type: "bool",
                    inverted: true,
                  },

                  // Files and Applications
                  {
                    id: "pref.downloads.disable_button.edit_actions",
                    type: "bool",
                  },

                  // DRM content
                  { id: "media.eme.enabled", type: "bool" },

                  // Update
                  {
                    id: "browser.preferences.advanced.selectedTabIndex",
                    type: "int",
                  },
                  { id: "browser.search.update", type: "bool" },

                  { id: "privacy.userContext.enabled", type: "bool" },

                  // Picture-in-Picture
                  {
                    id:
                      "media.videocontrols.picture-in-picture.video-toggle.enabled",
                    type: "bool",
                  },
                ]);

                if (AppConstants.HAVE_SHELL_SERVICE) {
                  Preferences.addAll([
                    { id: "browser.shell.checkDefaultBrowser", type: "bool" },
                    {
                      id: "pref.general.disable_button.default_browser",
                      type: "bool",
                    },
                  ]);
                }

                if (AppConstants.platform === "win") {
                  Preferences.addAll([
                    { id: "browser.taskbar.previews.enable", type: "bool" },
                    { id: "ui.osk.enabled", type: "bool" },
                  ]);
                }

                if (AppConstants.MOZ_UPDATER) {
                  Preferences.addAll([
                    {
                      id: "app.update.disable_button.showUpdateHistory",
                      type: "bool",
                    },
                  ]);

                  if (AppConstants.MOZ_MAINTENANCE_SERVICE) {
                    Preferences.addAll([
                      { id: "app.update.service.enabled", type: "bool" },
                    ]);
                  }
                }

                return prefs;
              };

              const preferencesToCheck = getPreferencesToCheck();

              // loop through the prefs listed in about:preferences, and look for non-default values
              const preferencesWithNonDefaultValues = preferencesToCheck.filter(
                preference => {
                  return !hasDefaultValue(preference.id);
                },
              );

              /* Uncomment to check what preferences have non-default values in this profile
              console.debug({
                // preferencesToCheck,
                preferencesWithNonDefaultValues,
              });
              */

              return preferencesWithNonDefaultValues.length;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get whether or not Firefox accounts are configured */
          getFxAConfigured: async function getFxAConfigured() {
            try {
              const fxaPreferencesWithNonDefaultValues = [
                "identity.fxaccounts.account.device.name",
                "identity.fxaccounts.lastSignedInUserHash",
              ].filter(fxaPreference => {
                return !hasDefaultValue(fxaPreference);
              });
              /* Uncomment to check which of the above fxa-related preferences have non-default values in this profile
              console.debug({
                fxaPreferencesWithNonDefaultValues,
              });
              */
              return fxaPreferencesWithNonDefaultValues.length > 0;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get if dark mode is active or not */
          getCurrentTheme: async function getCurrentTheme() {
            try {
              return Services.prefs.getStringPref(`extensions.activeThemeID`);
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get count of logins saved in the browser */
          getLoginsSavedInBrowserCount: async function getLoginsSavedInBrowserCount() {
            try {
              const allLogins = await Services.logins.getAllLogins();
              return allLogins ? allLogins.length : 0;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get main monitor screen width */
          getMainMonitorScreenWidth: async function getMainMonitorScreenWidth() {
            try {
              const environment = TelemetryEnvironment.currentEnvironment;
              return environment.system.gfx.monitors[0]
                ? environment.system.gfx.monitors[0].screenWidth
                : undefined;
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          /* Get the current Firefox update channel */
          getUpdateChannel: async function getUpdateChannel() {
            try {
              return UpdateUtils.getUpdateChannel(true);
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
