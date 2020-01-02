# Telemetry sent by this add-on

## Data we are collecting

On a 60 minute schedule, evaluated features are sent via telemetry to a model training job so that the model gets improved over time.

The following data is sent with this ping:

| name                                                                           | type              | description                                                                                                    |
| ------------------------------------------------------------------------------ | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `model_version`                                                                | integer           | the version of the model that was available at the time of feature evaluation                                  |
| `study_variation`                                                              | string            | the add-on id, which is specific to the branch/variation that the user is enrolled in (e.g. treatment/control) |
| `study_addon_version`                                                          | string            | the version of the study add-on                                                                                |
| `client_context_features.has_firefox_as_default_browser`                       | boolean           | firefox as default browser                                                                                     |
| `client_context_features.active_ticks`                                         | number            | active ticks                                                                                                   |
| `client_context_features.total_uri_count`                                      | number            | total uri count                                                                                                |
| `client_context_features.about_preferences_non_default_value_count`            | number            | prefs changed, specifically those from about:preferences                                                       |
| `client_context_features.self_installed_addons_count`                          | number            | count of selfinstalled addons                                                                                  |
| `client_context_features.self_installed_popular_privacy_security_addons_count` | number            | count of popular privacy/security addons                                                                       |
| `client_context_features.self_installed_themes_count`                          | number            | count of selfinstalled themes                                                                                  |
| `client_context_features.dark_mode_active`                                     | boolean           | dark mode active                                                                                               |
| `client_context_features.total_bookmarks_count`                                | number            | how many bookmarks are saved                                                                                   |
| `client_context_features.logins_saved_in_the_browser_count`                    | number            | count of logins saved in the browser                                                                           |
| `client_context_features.firefox_account_prefs_configured`                     | boolean           | firefox accounts configured                                                                                    |
| `client_context_features.profile_age_in_ms`                                    | number            | profile age (in ms)                                                                                            |
| `client_context_features.main_monitor_screen_width`                            | number            | main monitor screen width                                                                                      |
| `client_context_features.update_channel`                                       | string            | update channel (release, aurora etc)                                                                           |
| `client_context_features.locale`                                               | string            | locale                                                                                                         |
| `boolean_client_context_features`                                              | object            | boolean features based on client_context_features.\* above                                                     |
| `features_array_used_in_score_computation`                                     | array of integers | boolean_client_context_features.\* mapped to integers (false -> 0, true -> 1)                                  |

### Example payload

```json
{
  "model_version": 20200102082643,
  "study_variation": "messaging-system-personalization-experiment-1-addon-treatment@mozilla.org",
  "study_addon_version": "1.0.0",
  "client_context_features": {
    "has_firefox_as_default_browser": true,
    "active_ticks": 5,
    "total_uri_count": 1,
    "about_preferences_non_default_value_count": 1,
    "self_installed_addons_count": 0,
    "self_installed_popular_privacy_security_addons_count": 0,
    "self_installed_themes_count": 0,
    "dark_mode_active": true,
    "total_bookmarks_count": 5,
    "logins_saved_in_the_browser_count": 0,
    "firefox_account_prefs_configured": false,
    "profile_age_in_ms": 26604,
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
    "main_monitor_screen_width_gt_1280": true,
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
    1,
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
- [CFR Machine Learning Experiment - Feature space](https://docs.google.com/spreadsheets/d/1PXJgQpL9DmL6ph7-pKQ4jAHLJKdOg5Ha2vG6mTpAB6M/edit?pli=1#gid=0&fvid=1458837602)
