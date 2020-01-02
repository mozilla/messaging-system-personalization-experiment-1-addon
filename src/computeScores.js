/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(computeScores)" }]*/

/* global BernoulliNB */

const computeScores = async (
  cfrMlModelsRecord,
  clientContext,
  configuredScoreThreshold,
) => {
  const experimentCfrIds = Object.keys(cfrMlModelsRecord.models_by_cfr_id);
  console.log({ experimentCfrIds });

  const computedScores = {};
  const scoringBehaviorOverride = await browser.privileged.testingOverrides.getScoringBehaviorOverride();
  console.debug({ scoringBehaviorOverride });

  if (scoringBehaviorOverride) {
    experimentCfrIds.push("PERSONALIZED_CFR_MESSAGE");
  }

  const booleanFeatures = {
    has_firefox_as_default_browser:
      clientContext.has_firefox_as_default_browser,
    has_more_than_12_active_ticks: clientContext.active_ticks > 12,
    has_more_than_5_total_uri_count: clientContext.total_uri_count > 5,
    has_more_than_1_about_preferences_non_default_value_count:
      clientContext.about_preferences_non_default_value_count > 1,
    has_at_least_one_self_installed_addon:
      clientContext.self_installed_addons_count > 0,
    has_at_least_one_self_installed_popular_privacy_security_addon:
      clientContext.self_installed_popular_privacy_security_addons_count > 0,
    has_at_least_one_self_installed_theme:
      clientContext.self_installed_themes_count > 0,
    dark_mode_active: clientContext.dark_mode_active,
    has_more_than_5_bookmarks: clientContext.total_bookmarks_count > 5,
    has_at_least_one_login_saved_in_the_browser:
      clientContext.logins_saved_in_the_browser_count >= 1,
    firefox_account_prefs_configured:
      clientContext.firefox_account_prefs_configured,
    profile_more_than_60_days_old:
      clientContext.profile_age_in_ms > 1000 * 60 * 60 * 24 * 60,
    main_monitor_screen_width_gt_1280:
      clientContext.main_monitor_screen_width > 1280,
    is_release_channel: clientContext.update_channel === "release",
    locale_is_en_us: clientContext.locale === "en-US",
    locale_is_de: clientContext.locale === "de",
  };

  console.log({ booleanFeatures });

  const orderOfFeatures = [
    "has_firefox_as_default_browser", // index 0
    "has_more_than_12_active_ticks", // index 1
    "has_more_than_5_total_uri_count", // index 2
    "has_more_than_1_about_preferences_non_default_value_count", // index 3
    "has_at_least_one_self_installed_addon", // index 4
    "has_at_least_one_self_installed_popular_privacy_security_addon", // index 5
    "has_at_least_one_self_installed_theme", // index 6
    "dark_mode_active", // index 7
    "has_more_than_5_bookmarks", // index 8
    "has_at_least_one_login_saved_in_the_browser", // index 9
    "firefox_account_prefs_configured", // index 10
    "profile_more_than_60_days_old", // index 11
    "main_monitor_screen_width_gt_1280", // index 12
    "is_release_channel", // index 13
    "locale_is_en_us", // index 14
    "locale_is_de", // index 15
  ];

  const features = orderOfFeatures.map(key => {
    if (booleanFeatures[key] === undefined) {
      throw new Error(`Feature ${key} is undefined`);
    }
    // Return 1 for true and 0 for false, to correspond
    // to the class values used during training
    return Number(booleanFeatures[key]);
  });

  console.log({ features });

  const computeScore = cfrId => {
    switch (scoringBehaviorOverride) {
      case "fixed_value_0":
        return 0;
      case "fixed_value_10000":
        return 10000;
      case "fixed_value_slightly_below_threshold":
        return configuredScoreThreshold - 1;
      case "fixed_value_slightly_over_threshold":
        return configuredScoreThreshold + 1;
      case "random_between_1_and_9999":
        return Math.round(Math.random() * 9998 + 1);
    }

    const model = cfrMlModelsRecord.models_by_cfr_id[cfrId];

    const { priors, negProbs, delProbs } = model;

    const clf = new BernoulliNB(priors, negProbs, delProbs);
    const probabilities = clf.predict_proba(features);

    // Linear translation to a 0-10k score
    // Since the sum of prob_rejection and prob_acceptance is 1
    // We can simply multiply prob_acceptance with 10000 to get a score
    // The result is floored so that scores of 5000 or more is only
    // possible if prob_acceptance is greater than 0.5
    // (Or else 0.49999 would lead to rounding to 5000 instead of 4999)
    const prob_acceptance = probabilities[1];
    const score = Math.floor(prob_acceptance * 10000);
    // console.debug("Computed probabilities and resulting score", { cfrId, model, clf, probabilities, score});
    return score;
  };

  experimentCfrIds.map(cfrId => {
    computedScores[cfrId] = computeScore(cfrId);
  });

  return { computedScores, booleanFeatures, features };
};
