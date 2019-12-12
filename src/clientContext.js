/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(getClientContext)" }]*/

const getClientContext = async () => {
  console.info("Getting model inputs from ASRouterTargeting.jsm");
  const asRouterTargetingGetters = await browser.privileged.messagingSystem.getASRouterTargetingGetters(
    [
      "isDefaultBrowser",
      "addonsInfo",
      "totalBookmarksCount",
      "usesFirefoxSync",
      "isFxAEnabled",
      "sync",
      "locale",
      "profileAgeCreated",
    ],
  );
  console.log({ asRouterTargetingGetters });

  console.info(
    "Getting model inputs from addonsMetadata web extension experiment API",
  );
  const listOfInstalledAddons = await browser.privileged.addonsMetadata.getListOfInstalledAddons();
  const listOfInstalledThemes = await browser.privileged.addonsMetadata.getListOfInstalledThemes();
  const listOfSelfInstalledEnabledAddons = listOfInstalledAddons.filter(
    addon =>
      !addon.isSystem && !addon.userDisabled && addon.id !== browser.runtime.id,
  );
  const listOfSelfInstalledEnabledThemes = listOfInstalledThemes.filter(
    theme =>
      !theme.blocklisted &&
      !theme.userDisabled &&
      ![
        // TODO: Compile list of themes shipped with various versions of firefox here
        "firefox-compact-dark@mozilla.org",
      ].includes(theme.id),
  );
  console.log({
    listOfInstalledAddons,
    listOfSelfInstalledEnabledAddons,
    listOfInstalledThemes,
    listOfSelfInstalledEnabledThemes,
  });

  console.info(
    "Merging with model inputs from clientContext web extension experiment API",
  );

  return {
    has_firefox_as_default_browser: asRouterTargetingGetters.isDefaultBrowser,
    active_ticks: await browser.privileged.clientContext.getActiveTicks(),
    total_uri_count: await browser.privileged.clientContext.getTotalUriCount(),
    about_preferences_non_default_value_count: await browser.privileged.clientContext.getAboutPreferencesNonDefaultValueCount(),
    has_at_least_one_self_installed_addon:
      listOfSelfInstalledEnabledAddons.length > 0,
    has_at_least_one_self_installed_password_manager: "TODO", // TODO
    has_at_least_one_self_installed_adblocker: "TODO", // TODO
    has_at_least_one_self_installed_theme:
      listOfSelfInstalledEnabledThemes.length > 0,
    dark_mode_active: await browser.privileged.clientContext.getDarkModeActive(),
    total_bookmarks_count: asRouterTargetingGetters.totalBookmarksCount,
    has_at_least_one_login_saved_in_the_browser:
      (await browser.privileged.clientContext.getLoginsSavedInBrowserCount()) >
      0,
    firefox_accounts_configured: await browser.privileged.clientContext.getFxAConfigured(),
    locale: asRouterTargetingGetters.locale,
    profile_age: Date.now() - asRouterTargetingGetters.profileAgeCreated,
    main_monitor_screen_width: await browser.privileged.clientContext.getMainMonitorScreenWidth(),
  };
};
