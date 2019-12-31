# Telemetry sent by this add-on

## Data we are collecting

On a 60 minute schedule, the add-on will fetch the latest ml model, evaluate features and compute rankings for each CFR message in the experiment. 

The evaluated features will be sent to a model training job so that the model fetched by the clients gets improved over time.

### Example payload

```json
{
  "model_version": 20191231165308,
  "study_variation": "messaging-system-personalization-experiment-1-addon-treatment@mozilla.org",
  "study_addon_version": "0.3.0",
  "client_context_features": {
    "has_firefox_as_default_browser": true,
    "active_ticks": 8,
    "total_uri_count": 1,
    "about_preferences_non_default_value_count": 1,
    "self_installed_addons_count": 0,
    "self_installed_popular_privacy_security_addons_count": 0,
    "self_installed_themes_count": 0,
    "dark_mode_active": true,
    "total_bookmarks_count": 5,
    "logins_saved_in_the_browser_count": 0,
    "firefox_account_prefs_configured": false,
    "profile_age_in_ms": 41417,
    "main_monitor_screen_width": 1680,
    "update_channel": "aurora",
    "locale": "en-US"
  },
  "boolean_client_context_features": {
    "has_firefox_as_default_browser": true,
    "has_more_than_12_active_ticks": false,
    "has_more_than_5_total_uri_count": false,
    "has_more_than_1_about_preferences_non_default_value_count": false,
    "has_at_least_one_self_installed_addon": false,
    "has_at_least_one_self_installed_popular_privacy_security_addon": false,
    "has_at_least_one_self_installed_theme": false,
    "dark_mode_active": true,
    "has_more_than_5_bookmarks": false,
    "has_at_least_one_login_saved_in_the_browser": false,
    "firefox_account_prefs_configured": false,
    "profile_more_than_60_days_old": false,
    "main_monitor_screen_width_gt_2000": false,
    "is_release_channel": false,
    "locale_is_en_us": true,
    "locale_is_de": false
  },
  "features_array_used_in_score_computation": [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0
  ]
}
```

## Collection restraints

- Respects telemetry preferences. If user has disabled telemetry, no telemetry will be sent.
- No telemetry will be sent while a private browsing window open.
- If user has permanent private browsing enabled, the user will be opted out of the study.

## Modification of ordinary Firefox Telemetry

The add-on fetches the model version used in the experiment, which in turn is [included as metadata in the ordinary Messaging System telemetry](https://bugzilla.mozilla.org/show_bug.cgi?id=1595869).

## References

- [Payload ping schema](../schemas/messaging-system-personalization-experiment-1-update.payload.schema.json)
