'use strict';
var validate = (function() {
  var refVal = [];
  return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
    'use strict';
    var vErrors = null;
    var errors = 0;
    if ((data && typeof data === "object" && !Array.isArray(data))) {
      if (true) {
        var errs__0 = errors;
        var valid1 = true;
        if (data.model_version === undefined) {
          valid1 = false;
          validate.errors = [{
            keyword: 'required',
            dataPath: (dataPath || '') + "",
            schemaPath: '#/required',
            params: {
              missingProperty: 'model_version'
            },
            message: 'should have required property \'model_version\''
          }];
          return false;
        } else {
          var errs_1 = errors;
          if (typeof data.model_version !== "number") {
            validate.errors = [{
              keyword: 'type',
              dataPath: (dataPath || '') + '.model_version',
              schemaPath: '#/properties/model_version/type',
              params: {
                type: 'number'
              },
              message: 'should be number'
            }];
            return false;
          }
          var valid1 = errors === errs_1;
        }
        if (valid1) {
          if (data.study_variation === undefined) {
            valid1 = false;
            validate.errors = [{
              keyword: 'required',
              dataPath: (dataPath || '') + "",
              schemaPath: '#/required',
              params: {
                missingProperty: 'study_variation'
              },
              message: 'should have required property \'study_variation\''
            }];
            return false;
          } else {
            var errs_1 = errors;
            if (typeof data.study_variation !== "string") {
              validate.errors = [{
                keyword: 'type',
                dataPath: (dataPath || '') + '.study_variation',
                schemaPath: '#/properties/study_variation/type',
                params: {
                  type: 'string'
                },
                message: 'should be string'
              }];
              return false;
            }
            var valid1 = errors === errs_1;
          }
          if (valid1) {
            if (data.study_addon_version === undefined) {
              valid1 = false;
              validate.errors = [{
                keyword: 'required',
                dataPath: (dataPath || '') + "",
                schemaPath: '#/required',
                params: {
                  missingProperty: 'study_addon_version'
                },
                message: 'should have required property \'study_addon_version\''
              }];
              return false;
            } else {
              var errs_1 = errors;
              if (typeof data.study_addon_version !== "string") {
                validate.errors = [{
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.study_addon_version',
                  schemaPath: '#/properties/study_addon_version/type',
                  params: {
                    type: 'string'
                  },
                  message: 'should be string'
                }];
                return false;
              }
              var valid1 = errors === errs_1;
            }
            if (valid1) {
              if (data.impression_id === undefined) {
                valid1 = true;
              } else {
                var errs_1 = errors;
                if (typeof data.impression_id !== "string") {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.impression_id',
                    schemaPath: '#/properties/impression_id/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  }];
                  return false;
                }
                var valid1 = errors === errs_1;
              }
              if (valid1) {
                var data1 = data.client_context_features;
                if (data1 === undefined) {
                  valid1 = false;
                  validate.errors = [{
                    keyword: 'required',
                    dataPath: (dataPath || '') + "",
                    schemaPath: '#/required',
                    params: {
                      missingProperty: 'client_context_features'
                    },
                    message: 'should have required property \'client_context_features\''
                  }];
                  return false;
                } else {
                  var errs_1 = errors;
                  if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
                    if (true) {
                      var errs__1 = errors;
                      var valid2 = true;
                      if (data1.has_firefox_as_default_browser === undefined) {
                        valid2 = false;
                        validate.errors = [{
                          keyword: 'required',
                          dataPath: (dataPath || '') + '.client_context_features',
                          schemaPath: '#/properties/client_context_features/required',
                          params: {
                            missingProperty: 'has_firefox_as_default_browser'
                          },
                          message: 'should have required property \'has_firefox_as_default_browser\''
                        }];
                        return false;
                      } else {
                        var errs_2 = errors;
                        if (typeof data1.has_firefox_as_default_browser !== "boolean") {
                          validate.errors = [{
                            keyword: 'type',
                            dataPath: (dataPath || '') + '.client_context_features.has_firefox_as_default_browser',
                            schemaPath: '#/properties/client_context_features/properties/has_firefox_as_default_browser/type',
                            params: {
                              type: 'boolean'
                            },
                            message: 'should be boolean'
                          }];
                          return false;
                        }
                        var valid2 = errors === errs_2;
                      }
                      if (valid2) {
                        if (data1.active_ticks === undefined) {
                          valid2 = false;
                          validate.errors = [{
                            keyword: 'required',
                            dataPath: (dataPath || '') + '.client_context_features',
                            schemaPath: '#/properties/client_context_features/required',
                            params: {
                              missingProperty: 'active_ticks'
                            },
                            message: 'should have required property \'active_ticks\''
                          }];
                          return false;
                        } else {
                          var errs_2 = errors;
                          if (typeof data1.active_ticks !== "number") {
                            validate.errors = [{
                              keyword: 'type',
                              dataPath: (dataPath || '') + '.client_context_features.active_ticks',
                              schemaPath: '#/properties/client_context_features/properties/active_ticks/type',
                              params: {
                                type: 'number'
                              },
                              message: 'should be number'
                            }];
                            return false;
                          }
                          var valid2 = errors === errs_2;
                        }
                        if (valid2) {
                          if (data1.total_uri_count === undefined) {
                            valid2 = false;
                            validate.errors = [{
                              keyword: 'required',
                              dataPath: (dataPath || '') + '.client_context_features',
                              schemaPath: '#/properties/client_context_features/required',
                              params: {
                                missingProperty: 'total_uri_count'
                              },
                              message: 'should have required property \'total_uri_count\''
                            }];
                            return false;
                          } else {
                            var errs_2 = errors;
                            if (typeof data1.total_uri_count !== "number") {
                              validate.errors = [{
                                keyword: 'type',
                                dataPath: (dataPath || '') + '.client_context_features.total_uri_count',
                                schemaPath: '#/properties/client_context_features/properties/total_uri_count/type',
                                params: {
                                  type: 'number'
                                },
                                message: 'should be number'
                              }];
                              return false;
                            }
                            var valid2 = errors === errs_2;
                          }
                          if (valid2) {
                            if (data1.about_preferences_non_default_value_count === undefined) {
                              valid2 = false;
                              validate.errors = [{
                                keyword: 'required',
                                dataPath: (dataPath || '') + '.client_context_features',
                                schemaPath: '#/properties/client_context_features/required',
                                params: {
                                  missingProperty: 'about_preferences_non_default_value_count'
                                },
                                message: 'should have required property \'about_preferences_non_default_value_count\''
                              }];
                              return false;
                            } else {
                              var errs_2 = errors;
                              if (typeof data1.about_preferences_non_default_value_count !== "number") {
                                validate.errors = [{
                                  keyword: 'type',
                                  dataPath: (dataPath || '') + '.client_context_features.about_preferences_non_default_value_count',
                                  schemaPath: '#/properties/client_context_features/properties/about_preferences_non_default_value_count/type',
                                  params: {
                                    type: 'number'
                                  },
                                  message: 'should be number'
                                }];
                                return false;
                              }
                              var valid2 = errors === errs_2;
                            }
                            if (valid2) {
                              if (data1.self_installed_addons_count === undefined) {
                                valid2 = false;
                                validate.errors = [{
                                  keyword: 'required',
                                  dataPath: (dataPath || '') + '.client_context_features',
                                  schemaPath: '#/properties/client_context_features/required',
                                  params: {
                                    missingProperty: 'self_installed_addons_count'
                                  },
                                  message: 'should have required property \'self_installed_addons_count\''
                                }];
                                return false;
                              } else {
                                var errs_2 = errors;
                                if (typeof data1.self_installed_addons_count !== "number") {
                                  validate.errors = [{
                                    keyword: 'type',
                                    dataPath: (dataPath || '') + '.client_context_features.self_installed_addons_count',
                                    schemaPath: '#/properties/client_context_features/properties/self_installed_addons_count/type',
                                    params: {
                                      type: 'number'
                                    },
                                    message: 'should be number'
                                  }];
                                  return false;
                                }
                                var valid2 = errors === errs_2;
                              }
                              if (valid2) {
                                if (data1.self_installed_popular_privacy_security_addons_count === undefined) {
                                  valid2 = false;
                                  validate.errors = [{
                                    keyword: 'required',
                                    dataPath: (dataPath || '') + '.client_context_features',
                                    schemaPath: '#/properties/client_context_features/required',
                                    params: {
                                      missingProperty: 'self_installed_popular_privacy_security_addons_count'
                                    },
                                    message: 'should have required property \'self_installed_popular_privacy_security_addons_count\''
                                  }];
                                  return false;
                                } else {
                                  var errs_2 = errors;
                                  if (typeof data1.self_installed_popular_privacy_security_addons_count !== "number") {
                                    validate.errors = [{
                                      keyword: 'type',
                                      dataPath: (dataPath || '') + '.client_context_features.self_installed_popular_privacy_security_addons_count',
                                      schemaPath: '#/properties/client_context_features/properties/self_installed_popular_privacy_security_addons_count/type',
                                      params: {
                                        type: 'number'
                                      },
                                      message: 'should be number'
                                    }];
                                    return false;
                                  }
                                  var valid2 = errors === errs_2;
                                }
                                if (valid2) {
                                  if (data1.self_installed_themes_count === undefined) {
                                    valid2 = false;
                                    validate.errors = [{
                                      keyword: 'required',
                                      dataPath: (dataPath || '') + '.client_context_features',
                                      schemaPath: '#/properties/client_context_features/required',
                                      params: {
                                        missingProperty: 'self_installed_themes_count'
                                      },
                                      message: 'should have required property \'self_installed_themes_count\''
                                    }];
                                    return false;
                                  } else {
                                    var errs_2 = errors;
                                    if (typeof data1.self_installed_themes_count !== "number") {
                                      validate.errors = [{
                                        keyword: 'type',
                                        dataPath: (dataPath || '') + '.client_context_features.self_installed_themes_count',
                                        schemaPath: '#/properties/client_context_features/properties/self_installed_themes_count/type',
                                        params: {
                                          type: 'number'
                                        },
                                        message: 'should be number'
                                      }];
                                      return false;
                                    }
                                    var valid2 = errors === errs_2;
                                  }
                                  if (valid2) {
                                    if (data1.dark_mode_active === undefined) {
                                      valid2 = false;
                                      validate.errors = [{
                                        keyword: 'required',
                                        dataPath: (dataPath || '') + '.client_context_features',
                                        schemaPath: '#/properties/client_context_features/required',
                                        params: {
                                          missingProperty: 'dark_mode_active'
                                        },
                                        message: 'should have required property \'dark_mode_active\''
                                      }];
                                      return false;
                                    } else {
                                      var errs_2 = errors;
                                      if (typeof data1.dark_mode_active !== "boolean") {
                                        validate.errors = [{
                                          keyword: 'type',
                                          dataPath: (dataPath || '') + '.client_context_features.dark_mode_active',
                                          schemaPath: '#/properties/client_context_features/properties/dark_mode_active/type',
                                          params: {
                                            type: 'boolean'
                                          },
                                          message: 'should be boolean'
                                        }];
                                        return false;
                                      }
                                      var valid2 = errors === errs_2;
                                    }
                                    if (valid2) {
                                      if (data1.total_bookmarks_count === undefined) {
                                        valid2 = false;
                                        validate.errors = [{
                                          keyword: 'required',
                                          dataPath: (dataPath || '') + '.client_context_features',
                                          schemaPath: '#/properties/client_context_features/required',
                                          params: {
                                            missingProperty: 'total_bookmarks_count'
                                          },
                                          message: 'should have required property \'total_bookmarks_count\''
                                        }];
                                        return false;
                                      } else {
                                        var errs_2 = errors;
                                        if (typeof data1.total_bookmarks_count !== "number") {
                                          validate.errors = [{
                                            keyword: 'type',
                                            dataPath: (dataPath || '') + '.client_context_features.total_bookmarks_count',
                                            schemaPath: '#/properties/client_context_features/properties/total_bookmarks_count/type',
                                            params: {
                                              type: 'number'
                                            },
                                            message: 'should be number'
                                          }];
                                          return false;
                                        }
                                        var valid2 = errors === errs_2;
                                      }
                                      if (valid2) {
                                        if (data1.logins_saved_in_the_browser_count === undefined) {
                                          valid2 = false;
                                          validate.errors = [{
                                            keyword: 'required',
                                            dataPath: (dataPath || '') + '.client_context_features',
                                            schemaPath: '#/properties/client_context_features/required',
                                            params: {
                                              missingProperty: 'logins_saved_in_the_browser_count'
                                            },
                                            message: 'should have required property \'logins_saved_in_the_browser_count\''
                                          }];
                                          return false;
                                        } else {
                                          var errs_2 = errors;
                                          if (typeof data1.logins_saved_in_the_browser_count !== "number") {
                                            validate.errors = [{
                                              keyword: 'type',
                                              dataPath: (dataPath || '') + '.client_context_features.logins_saved_in_the_browser_count',
                                              schemaPath: '#/properties/client_context_features/properties/logins_saved_in_the_browser_count/type',
                                              params: {
                                                type: 'number'
                                              },
                                              message: 'should be number'
                                            }];
                                            return false;
                                          }
                                          var valid2 = errors === errs_2;
                                        }
                                        if (valid2) {
                                          if (data1.firefox_account_prefs_configured === undefined) {
                                            valid2 = false;
                                            validate.errors = [{
                                              keyword: 'required',
                                              dataPath: (dataPath || '') + '.client_context_features',
                                              schemaPath: '#/properties/client_context_features/required',
                                              params: {
                                                missingProperty: 'firefox_account_prefs_configured'
                                              },
                                              message: 'should have required property \'firefox_account_prefs_configured\''
                                            }];
                                            return false;
                                          } else {
                                            var errs_2 = errors;
                                            if (typeof data1.firefox_account_prefs_configured !== "boolean") {
                                              validate.errors = [{
                                                keyword: 'type',
                                                dataPath: (dataPath || '') + '.client_context_features.firefox_account_prefs_configured',
                                                schemaPath: '#/properties/client_context_features/properties/firefox_account_prefs_configured/type',
                                                params: {
                                                  type: 'boolean'
                                                },
                                                message: 'should be boolean'
                                              }];
                                              return false;
                                            }
                                            var valid2 = errors === errs_2;
                                          }
                                          if (valid2) {
                                            if (data1.profile_age === undefined) {
                                              valid2 = false;
                                              validate.errors = [{
                                                keyword: 'required',
                                                dataPath: (dataPath || '') + '.client_context_features',
                                                schemaPath: '#/properties/client_context_features/required',
                                                params: {
                                                  missingProperty: 'profile_age'
                                                },
                                                message: 'should have required property \'profile_age\''
                                              }];
                                              return false;
                                            } else {
                                              var errs_2 = errors;
                                              if (typeof data1.profile_age !== "number") {
                                                validate.errors = [{
                                                  keyword: 'type',
                                                  dataPath: (dataPath || '') + '.client_context_features.profile_age',
                                                  schemaPath: '#/properties/client_context_features/properties/profile_age/type',
                                                  params: {
                                                    type: 'number'
                                                  },
                                                  message: 'should be number'
                                                }];
                                                return false;
                                              }
                                              var valid2 = errors === errs_2;
                                            }
                                            if (valid2) {
                                              if (data1.main_monitor_screen_width === undefined) {
                                                valid2 = false;
                                                validate.errors = [{
                                                  keyword: 'required',
                                                  dataPath: (dataPath || '') + '.client_context_features',
                                                  schemaPath: '#/properties/client_context_features/required',
                                                  params: {
                                                    missingProperty: 'main_monitor_screen_width'
                                                  },
                                                  message: 'should have required property \'main_monitor_screen_width\''
                                                }];
                                                return false;
                                              } else {
                                                var errs_2 = errors;
                                                if (typeof data1.main_monitor_screen_width !== "number") {
                                                  validate.errors = [{
                                                    keyword: 'type',
                                                    dataPath: (dataPath || '') + '.client_context_features.main_monitor_screen_width',
                                                    schemaPath: '#/properties/client_context_features/properties/main_monitor_screen_width/type',
                                                    params: {
                                                      type: 'number'
                                                    },
                                                    message: 'should be number'
                                                  }];
                                                  return false;
                                                }
                                                var valid2 = errors === errs_2;
                                              }
                                              if (valid2) {
                                                if (data1.update_channel === undefined) {
                                                  valid2 = false;
                                                  validate.errors = [{
                                                    keyword: 'required',
                                                    dataPath: (dataPath || '') + '.client_context_features',
                                                    schemaPath: '#/properties/client_context_features/required',
                                                    params: {
                                                      missingProperty: 'update_channel'
                                                    },
                                                    message: 'should have required property \'update_channel\''
                                                  }];
                                                  return false;
                                                } else {
                                                  var errs_2 = errors;
                                                  if (typeof data1.update_channel !== "string") {
                                                    validate.errors = [{
                                                      keyword: 'type',
                                                      dataPath: (dataPath || '') + '.client_context_features.update_channel',
                                                      schemaPath: '#/properties/client_context_features/properties/update_channel/type',
                                                      params: {
                                                        type: 'string'
                                                      },
                                                      message: 'should be string'
                                                    }];
                                                    return false;
                                                  }
                                                  var valid2 = errors === errs_2;
                                                }
                                                if (valid2) {
                                                  if (data1.locale === undefined) {
                                                    valid2 = false;
                                                    validate.errors = [{
                                                      keyword: 'required',
                                                      dataPath: (dataPath || '') + '.client_context_features',
                                                      schemaPath: '#/properties/client_context_features/required',
                                                      params: {
                                                        missingProperty: 'locale'
                                                      },
                                                      message: 'should have required property \'locale\''
                                                    }];
                                                    return false;
                                                  } else {
                                                    var errs_2 = errors;
                                                    if (typeof data1.locale !== "string") {
                                                      validate.errors = [{
                                                        keyword: 'type',
                                                        dataPath: (dataPath || '') + '.client_context_features.locale',
                                                        schemaPath: '#/properties/client_context_features/properties/locale/type',
                                                        params: {
                                                          type: 'string'
                                                        },
                                                        message: 'should be string'
                                                      }];
                                                      return false;
                                                    }
                                                    var valid2 = errors === errs_2;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } else {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.client_context_features',
                      schemaPath: '#/properties/client_context_features/type',
                      params: {
                        type: 'object'
                      },
                      message: 'should be object'
                    }];
                    return false;
                  }
                  var valid1 = errors === errs_1;
                }
                if (valid1) {
                  var data1 = data.boolean_client_context_features;
                  if (data1 === undefined) {
                    valid1 = false;
                    validate.errors = [{
                      keyword: 'required',
                      dataPath: (dataPath || '') + "",
                      schemaPath: '#/required',
                      params: {
                        missingProperty: 'boolean_client_context_features'
                      },
                      message: 'should have required property \'boolean_client_context_features\''
                    }];
                    return false;
                  } else {
                    var errs_1 = errors;
                    if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
                      if (true) {
                        var errs__1 = errors;
                        var valid2 = true;
                        if (data1.has_firefox_as_default_browser === undefined) {
                          valid2 = false;
                          validate.errors = [{
                            keyword: 'required',
                            dataPath: (dataPath || '') + '.boolean_client_context_features',
                            schemaPath: '#/properties/boolean_client_context_features/required',
                            params: {
                              missingProperty: 'has_firefox_as_default_browser'
                            },
                            message: 'should have required property \'has_firefox_as_default_browser\''
                          }];
                          return false;
                        } else {
                          var errs_2 = errors;
                          if (typeof data1.has_firefox_as_default_browser !== "boolean") {
                            validate.errors = [{
                              keyword: 'type',
                              dataPath: (dataPath || '') + '.boolean_client_context_features.has_firefox_as_default_browser',
                              schemaPath: '#/properties/boolean_client_context_features/properties/has_firefox_as_default_browser/type',
                              params: {
                                type: 'boolean'
                              },
                              message: 'should be boolean'
                            }];
                            return false;
                          }
                          var valid2 = errors === errs_2;
                        }
                        if (valid2) {
                          if (data1.has_more_than_five_days_of_active_ticks === undefined) {
                            valid2 = false;
                            validate.errors = [{
                              keyword: 'required',
                              dataPath: (dataPath || '') + '.boolean_client_context_features',
                              schemaPath: '#/properties/boolean_client_context_features/required',
                              params: {
                                missingProperty: 'has_more_than_five_days_of_active_ticks'
                              },
                              message: 'should have required property \'has_more_than_five_days_of_active_ticks\''
                            }];
                            return false;
                          } else {
                            var errs_2 = errors;
                            if (typeof data1.has_more_than_five_days_of_active_ticks !== "boolean") {
                              validate.errors = [{
                                keyword: 'type',
                                dataPath: (dataPath || '') + '.boolean_client_context_features.has_more_than_five_days_of_active_ticks',
                                schemaPath: '#/properties/boolean_client_context_features/properties/has_more_than_five_days_of_active_ticks/type',
                                params: {
                                  type: 'boolean'
                                },
                                message: 'should be boolean'
                              }];
                              return false;
                            }
                            var valid2 = errors === errs_2;
                          }
                          if (valid2) {
                            if (data1.has_more_than_1000_total_uri_count === undefined) {
                              valid2 = false;
                              validate.errors = [{
                                keyword: 'required',
                                dataPath: (dataPath || '') + '.boolean_client_context_features',
                                schemaPath: '#/properties/boolean_client_context_features/required',
                                params: {
                                  missingProperty: 'has_more_than_1000_total_uri_count'
                                },
                                message: 'should have required property \'has_more_than_1000_total_uri_count\''
                              }];
                              return false;
                            } else {
                              var errs_2 = errors;
                              if (typeof data1.has_more_than_1000_total_uri_count !== "boolean") {
                                validate.errors = [{
                                  keyword: 'type',
                                  dataPath: (dataPath || '') + '.boolean_client_context_features.has_more_than_1000_total_uri_count',
                                  schemaPath: '#/properties/boolean_client_context_features/properties/has_more_than_1000_total_uri_count/type',
                                  params: {
                                    type: 'boolean'
                                  },
                                  message: 'should be boolean'
                                }];
                                return false;
                              }
                              var valid2 = errors === errs_2;
                            }
                            if (valid2) {
                              if (data1.has_more_than_1_about_preferences_non_default_value_count === undefined) {
                                valid2 = false;
                                validate.errors = [{
                                  keyword: 'required',
                                  dataPath: (dataPath || '') + '.boolean_client_context_features',
                                  schemaPath: '#/properties/boolean_client_context_features/required',
                                  params: {
                                    missingProperty: 'has_more_than_1_about_preferences_non_default_value_count'
                                  },
                                  message: 'should have required property \'has_more_than_1_about_preferences_non_default_value_count\''
                                }];
                                return false;
                              } else {
                                var errs_2 = errors;
                                if (typeof data1.has_more_than_1_about_preferences_non_default_value_count !== "boolean") {
                                  validate.errors = [{
                                    keyword: 'type',
                                    dataPath: (dataPath || '') + '.boolean_client_context_features.has_more_than_1_about_preferences_non_default_value_count',
                                    schemaPath: '#/properties/boolean_client_context_features/properties/has_more_than_1_about_preferences_non_default_value_count/type',
                                    params: {
                                      type: 'boolean'
                                    },
                                    message: 'should be boolean'
                                  }];
                                  return false;
                                }
                                var valid2 = errors === errs_2;
                              }
                              if (valid2) {
                                if (data1.has_at_least_one_self_installed_addon === undefined) {
                                  valid2 = false;
                                  validate.errors = [{
                                    keyword: 'required',
                                    dataPath: (dataPath || '') + '.boolean_client_context_features',
                                    schemaPath: '#/properties/boolean_client_context_features/required',
                                    params: {
                                      missingProperty: 'has_at_least_one_self_installed_addon'
                                    },
                                    message: 'should have required property \'has_at_least_one_self_installed_addon\''
                                  }];
                                  return false;
                                } else {
                                  var errs_2 = errors;
                                  if (typeof data1.has_at_least_one_self_installed_addon !== "boolean") {
                                    validate.errors = [{
                                      keyword: 'type',
                                      dataPath: (dataPath || '') + '.boolean_client_context_features.has_at_least_one_self_installed_addon',
                                      schemaPath: '#/properties/boolean_client_context_features/properties/has_at_least_one_self_installed_addon/type',
                                      params: {
                                        type: 'boolean'
                                      },
                                      message: 'should be boolean'
                                    }];
                                    return false;
                                  }
                                  var valid2 = errors === errs_2;
                                }
                                if (valid2) {
                                  if (data1.has_at_least_one_self_installed_popular_privacy_security_addon === undefined) {
                                    valid2 = false;
                                    validate.errors = [{
                                      keyword: 'required',
                                      dataPath: (dataPath || '') + '.boolean_client_context_features',
                                      schemaPath: '#/properties/boolean_client_context_features/required',
                                      params: {
                                        missingProperty: 'has_at_least_one_self_installed_popular_privacy_security_addon'
                                      },
                                      message: 'should have required property \'has_at_least_one_self_installed_popular_privacy_security_addon\''
                                    }];
                                    return false;
                                  } else {
                                    var errs_2 = errors;
                                    if (typeof data1.has_at_least_one_self_installed_popular_privacy_security_addon !== "boolean") {
                                      validate.errors = [{
                                        keyword: 'type',
                                        dataPath: (dataPath || '') + '.boolean_client_context_features.has_at_least_one_self_installed_popular_privacy_security_addon',
                                        schemaPath: '#/properties/boolean_client_context_features/properties/has_at_least_one_self_installed_popular_privacy_security_addon/type',
                                        params: {
                                          type: 'boolean'
                                        },
                                        message: 'should be boolean'
                                      }];
                                      return false;
                                    }
                                    var valid2 = errors === errs_2;
                                  }
                                  if (valid2) {
                                    if (data1.has_at_least_one_self_installed_theme === undefined) {
                                      valid2 = false;
                                      validate.errors = [{
                                        keyword: 'required',
                                        dataPath: (dataPath || '') + '.boolean_client_context_features',
                                        schemaPath: '#/properties/boolean_client_context_features/required',
                                        params: {
                                          missingProperty: 'has_at_least_one_self_installed_theme'
                                        },
                                        message: 'should have required property \'has_at_least_one_self_installed_theme\''
                                      }];
                                      return false;
                                    } else {
                                      var errs_2 = errors;
                                      if (typeof data1.has_at_least_one_self_installed_theme !== "boolean") {
                                        validate.errors = [{
                                          keyword: 'type',
                                          dataPath: (dataPath || '') + '.boolean_client_context_features.has_at_least_one_self_installed_theme',
                                          schemaPath: '#/properties/boolean_client_context_features/properties/has_at_least_one_self_installed_theme/type',
                                          params: {
                                            type: 'boolean'
                                          },
                                          message: 'should be boolean'
                                        }];
                                        return false;
                                      }
                                      var valid2 = errors === errs_2;
                                    }
                                    if (valid2) {
                                      if (data1.dark_mode_active === undefined) {
                                        valid2 = false;
                                        validate.errors = [{
                                          keyword: 'required',
                                          dataPath: (dataPath || '') + '.boolean_client_context_features',
                                          schemaPath: '#/properties/boolean_client_context_features/required',
                                          params: {
                                            missingProperty: 'dark_mode_active'
                                          },
                                          message: 'should have required property \'dark_mode_active\''
                                        }];
                                        return false;
                                      } else {
                                        var errs_2 = errors;
                                        if (typeof data1.dark_mode_active !== "boolean") {
                                          validate.errors = [{
                                            keyword: 'type',
                                            dataPath: (dataPath || '') + '.boolean_client_context_features.dark_mode_active',
                                            schemaPath: '#/properties/boolean_client_context_features/properties/dark_mode_active/type',
                                            params: {
                                              type: 'boolean'
                                            },
                                            message: 'should be boolean'
                                          }];
                                          return false;
                                        }
                                        var valid2 = errors === errs_2;
                                      }
                                      if (valid2) {
                                        if (data1.has_more_than_5_bookmarks === undefined) {
                                          valid2 = false;
                                          validate.errors = [{
                                            keyword: 'required',
                                            dataPath: (dataPath || '') + '.boolean_client_context_features',
                                            schemaPath: '#/properties/boolean_client_context_features/required',
                                            params: {
                                              missingProperty: 'has_more_than_5_bookmarks'
                                            },
                                            message: 'should have required property \'has_more_than_5_bookmarks\''
                                          }];
                                          return false;
                                        } else {
                                          var errs_2 = errors;
                                          if (typeof data1.has_more_than_5_bookmarks !== "boolean") {
                                            validate.errors = [{
                                              keyword: 'type',
                                              dataPath: (dataPath || '') + '.boolean_client_context_features.has_more_than_5_bookmarks',
                                              schemaPath: '#/properties/boolean_client_context_features/properties/has_more_than_5_bookmarks/type',
                                              params: {
                                                type: 'boolean'
                                              },
                                              message: 'should be boolean'
                                            }];
                                            return false;
                                          }
                                          var valid2 = errors === errs_2;
                                        }
                                        if (valid2) {
                                          if (data1.has_at_least_one_login_saved_in_the_browser === undefined) {
                                            valid2 = false;
                                            validate.errors = [{
                                              keyword: 'required',
                                              dataPath: (dataPath || '') + '.boolean_client_context_features',
                                              schemaPath: '#/properties/boolean_client_context_features/required',
                                              params: {
                                                missingProperty: 'has_at_least_one_login_saved_in_the_browser'
                                              },
                                              message: 'should have required property \'has_at_least_one_login_saved_in_the_browser\''
                                            }];
                                            return false;
                                          } else {
                                            var errs_2 = errors;
                                            if (typeof data1.has_at_least_one_login_saved_in_the_browser !== "boolean") {
                                              validate.errors = [{
                                                keyword: 'type',
                                                dataPath: (dataPath || '') + '.boolean_client_context_features.has_at_least_one_login_saved_in_the_browser',
                                                schemaPath: '#/properties/boolean_client_context_features/properties/has_at_least_one_login_saved_in_the_browser/type',
                                                params: {
                                                  type: 'boolean'
                                                },
                                                message: 'should be boolean'
                                              }];
                                              return false;
                                            }
                                            var valid2 = errors === errs_2;
                                          }
                                          if (valid2) {
                                            if (data1.firefox_account_prefs_configured === undefined) {
                                              valid2 = false;
                                              validate.errors = [{
                                                keyword: 'required',
                                                dataPath: (dataPath || '') + '.boolean_client_context_features',
                                                schemaPath: '#/properties/boolean_client_context_features/required',
                                                params: {
                                                  missingProperty: 'firefox_account_prefs_configured'
                                                },
                                                message: 'should have required property \'firefox_account_prefs_configured\''
                                              }];
                                              return false;
                                            } else {
                                              var errs_2 = errors;
                                              if (typeof data1.firefox_account_prefs_configured !== "boolean") {
                                                validate.errors = [{
                                                  keyword: 'type',
                                                  dataPath: (dataPath || '') + '.boolean_client_context_features.firefox_account_prefs_configured',
                                                  schemaPath: '#/properties/boolean_client_context_features/properties/firefox_account_prefs_configured/type',
                                                  params: {
                                                    type: 'boolean'
                                                  },
                                                  message: 'should be boolean'
                                                }];
                                                return false;
                                              }
                                              var valid2 = errors === errs_2;
                                            }
                                            if (valid2) {
                                              if (data1.profile_at_least_7_days_old === undefined) {
                                                valid2 = false;
                                                validate.errors = [{
                                                  keyword: 'required',
                                                  dataPath: (dataPath || '') + '.boolean_client_context_features',
                                                  schemaPath: '#/properties/boolean_client_context_features/required',
                                                  params: {
                                                    missingProperty: 'profile_at_least_7_days_old'
                                                  },
                                                  message: 'should have required property \'profile_at_least_7_days_old\''
                                                }];
                                                return false;
                                              } else {
                                                var errs_2 = errors;
                                                if (typeof data1.profile_at_least_7_days_old !== "boolean") {
                                                  validate.errors = [{
                                                    keyword: 'type',
                                                    dataPath: (dataPath || '') + '.boolean_client_context_features.profile_at_least_7_days_old',
                                                    schemaPath: '#/properties/boolean_client_context_features/properties/profile_at_least_7_days_old/type',
                                                    params: {
                                                      type: 'boolean'
                                                    },
                                                    message: 'should be boolean'
                                                  }];
                                                  return false;
                                                }
                                                var valid2 = errors === errs_2;
                                              }
                                              if (valid2) {
                                                if (data1.main_monitor_screen_width_gt_2000 === undefined) {
                                                  valid2 = false;
                                                  validate.errors = [{
                                                    keyword: 'required',
                                                    dataPath: (dataPath || '') + '.boolean_client_context_features',
                                                    schemaPath: '#/properties/boolean_client_context_features/required',
                                                    params: {
                                                      missingProperty: 'main_monitor_screen_width_gt_2000'
                                                    },
                                                    message: 'should have required property \'main_monitor_screen_width_gt_2000\''
                                                  }];
                                                  return false;
                                                } else {
                                                  var errs_2 = errors;
                                                  if (typeof data1.main_monitor_screen_width_gt_2000 !== "boolean") {
                                                    validate.errors = [{
                                                      keyword: 'type',
                                                      dataPath: (dataPath || '') + '.boolean_client_context_features.main_monitor_screen_width_gt_2000',
                                                      schemaPath: '#/properties/boolean_client_context_features/properties/main_monitor_screen_width_gt_2000/type',
                                                      params: {
                                                        type: 'boolean'
                                                      },
                                                      message: 'should be boolean'
                                                    }];
                                                    return false;
                                                  }
                                                  var valid2 = errors === errs_2;
                                                }
                                                if (valid2) {
                                                  if (data1.is_release_channel === undefined) {
                                                    valid2 = false;
                                                    validate.errors = [{
                                                      keyword: 'required',
                                                      dataPath: (dataPath || '') + '.boolean_client_context_features',
                                                      schemaPath: '#/properties/boolean_client_context_features/required',
                                                      params: {
                                                        missingProperty: 'is_release_channel'
                                                      },
                                                      message: 'should have required property \'is_release_channel\''
                                                    }];
                                                    return false;
                                                  } else {
                                                    var errs_2 = errors;
                                                    if (typeof data1.is_release_channel !== "boolean") {
                                                      validate.errors = [{
                                                        keyword: 'type',
                                                        dataPath: (dataPath || '') + '.boolean_client_context_features.is_release_channel',
                                                        schemaPath: '#/properties/boolean_client_context_features/properties/is_release_channel/type',
                                                        params: {
                                                          type: 'boolean'
                                                        },
                                                        message: 'should be boolean'
                                                      }];
                                                      return false;
                                                    }
                                                    var valid2 = errors === errs_2;
                                                  }
                                                  if (valid2) {
                                                    if (data1.locale_is_en_us === undefined) {
                                                      valid2 = false;
                                                      validate.errors = [{
                                                        keyword: 'required',
                                                        dataPath: (dataPath || '') + '.boolean_client_context_features',
                                                        schemaPath: '#/properties/boolean_client_context_features/required',
                                                        params: {
                                                          missingProperty: 'locale_is_en_us'
                                                        },
                                                        message: 'should have required property \'locale_is_en_us\''
                                                      }];
                                                      return false;
                                                    } else {
                                                      var errs_2 = errors;
                                                      if (typeof data1.locale_is_en_us !== "boolean") {
                                                        validate.errors = [{
                                                          keyword: 'type',
                                                          dataPath: (dataPath || '') + '.boolean_client_context_features.locale_is_en_us',
                                                          schemaPath: '#/properties/boolean_client_context_features/properties/locale_is_en_us/type',
                                                          params: {
                                                            type: 'boolean'
                                                          },
                                                          message: 'should be boolean'
                                                        }];
                                                        return false;
                                                      }
                                                      var valid2 = errors === errs_2;
                                                    }
                                                    if (valid2) {
                                                      if (data1.locale_is_de === undefined) {
                                                        valid2 = false;
                                                        validate.errors = [{
                                                          keyword: 'required',
                                                          dataPath: (dataPath || '') + '.boolean_client_context_features',
                                                          schemaPath: '#/properties/boolean_client_context_features/required',
                                                          params: {
                                                            missingProperty: 'locale_is_de'
                                                          },
                                                          message: 'should have required property \'locale_is_de\''
                                                        }];
                                                        return false;
                                                      } else {
                                                        var errs_2 = errors;
                                                        if (typeof data1.locale_is_de !== "boolean") {
                                                          validate.errors = [{
                                                            keyword: 'type',
                                                            dataPath: (dataPath || '') + '.boolean_client_context_features.locale_is_de',
                                                            schemaPath: '#/properties/boolean_client_context_features/properties/locale_is_de/type',
                                                            params: {
                                                              type: 'boolean'
                                                            },
                                                            message: 'should be boolean'
                                                          }];
                                                          return false;
                                                        }
                                                        var valid2 = errors === errs_2;
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      validate.errors = [{
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.boolean_client_context_features',
                        schemaPath: '#/properties/boolean_client_context_features/type',
                        params: {
                          type: 'object'
                        },
                        message: 'should be object'
                      }];
                      return false;
                    }
                    var valid1 = errors === errs_1;
                  }
                  if (valid1) {
                    var data1 = data.features_array_used_in_score_computation;
                    if (data1 === undefined) {
                      valid1 = false;
                      validate.errors = [{
                        keyword: 'required',
                        dataPath: (dataPath || '') + "",
                        schemaPath: '#/required',
                        params: {
                          missingProperty: 'features_array_used_in_score_computation'
                        },
                        message: 'should have required property \'features_array_used_in_score_computation\''
                      }];
                      return false;
                    } else {
                      var errs_1 = errors;
                      if (Array.isArray(data1)) {
                        if (data1.length > 16) {
                          validate.errors = [{
                            keyword: 'maxItems',
                            dataPath: (dataPath || '') + '.features_array_used_in_score_computation',
                            schemaPath: '#/properties/features_array_used_in_score_computation/maxItems',
                            params: {
                              limit: 16
                            },
                            message: 'should NOT have more than 16 items'
                          }];
                          return false;
                        } else {
                          if (data1.length < 16) {
                            validate.errors = [{
                              keyword: 'minItems',
                              dataPath: (dataPath || '') + '.features_array_used_in_score_computation',
                              schemaPath: '#/properties/features_array_used_in_score_computation/minItems',
                              params: {
                                limit: 16
                              },
                              message: 'should NOT have fewer than 16 items'
                            }];
                            return false;
                          } else {
                            var errs__1 = errors;
                            var valid1;
                            for (var i1 = 0; i1 < data1.length; i1++) {
                              var errs_2 = errors;
                              if (typeof data1[i1] !== "number") {
                                validate.errors = [{
                                  keyword: 'type',
                                  dataPath: (dataPath || '') + '.features_array_used_in_score_computation[' + i1 + ']',
                                  schemaPath: '#/properties/features_array_used_in_score_computation/items/type',
                                  params: {
                                    type: 'number'
                                  },
                                  message: 'should be number'
                                }];
                                return false;
                              }
                              var valid2 = errors === errs_2;
                              if (!valid2) break;
                            }
                          }
                        }
                      } else {
                        validate.errors = [{
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.features_array_used_in_score_computation',
                          schemaPath: '#/properties/features_array_used_in_score_computation/type',
                          params: {
                            type: 'array'
                          },
                          message: 'should be array'
                        }];
                        return false;
                      }
                      var valid1 = errors === errs_1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate.errors = [{
        keyword: 'type',
        dataPath: (dataPath || '') + "",
        schemaPath: '#/type',
        params: {
          type: 'object'
        },
        message: 'should be object'
      }];
      return false;
    }
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  "type": "object",
  "properties": {
    "model_version": {
      "type": "number"
    },
    "study_variation": {
      "type": "string"
    },
    "study_addon_version": {
      "type": "string"
    },
    "impression_id": {
      "type": "string"
    },
    "client_context_features": {
      "type": "object",
      "properties": {
        "has_firefox_as_default_browser": {
          "type": "boolean"
        },
        "active_ticks": {
          "type": "number"
        },
        "total_uri_count": {
          "type": "number"
        },
        "about_preferences_non_default_value_count": {
          "type": "number"
        },
        "self_installed_addons_count": {
          "type": "number"
        },
        "self_installed_popular_privacy_security_addons_count": {
          "type": "number"
        },
        "self_installed_themes_count": {
          "type": "number"
        },
        "dark_mode_active": {
          "type": "boolean"
        },
        "total_bookmarks_count": {
          "type": "number"
        },
        "logins_saved_in_the_browser_count": {
          "type": "number"
        },
        "firefox_account_prefs_configured": {
          "type": "boolean"
        },
        "profile_age": {
          "type": "number"
        },
        "main_monitor_screen_width": {
          "type": "number"
        },
        "update_channel": {
          "type": "string"
        },
        "locale": {
          "type": "string"
        }
      },
      "required": ["has_firefox_as_default_browser", "active_ticks", "total_uri_count", "about_preferences_non_default_value_count", "self_installed_addons_count", "self_installed_popular_privacy_security_addons_count", "self_installed_themes_count", "dark_mode_active", "total_bookmarks_count", "logins_saved_in_the_browser_count", "firefox_account_prefs_configured", "profile_age", "main_monitor_screen_width", "update_channel", "locale"]
    },
    "boolean_client_context_features": {
      "type": "object",
      "properties": {
        "has_firefox_as_default_browser": {
          "type": "boolean"
        },
        "has_more_than_five_days_of_active_ticks": {
          "type": "boolean"
        },
        "has_more_than_1000_total_uri_count": {
          "type": "boolean"
        },
        "has_more_than_1_about_preferences_non_default_value_count": {
          "type": "boolean"
        },
        "has_at_least_one_self_installed_addon": {
          "type": "boolean"
        },
        "has_at_least_one_self_installed_popular_privacy_security_addon": {
          "type": "boolean"
        },
        "has_at_least_one_self_installed_theme": {
          "type": "boolean"
        },
        "dark_mode_active": {
          "type": "boolean"
        },
        "has_more_than_5_bookmarks": {
          "type": "boolean"
        },
        "has_at_least_one_login_saved_in_the_browser": {
          "type": "boolean"
        },
        "firefox_account_prefs_configured": {
          "type": "boolean"
        },
        "profile_at_least_7_days_old": {
          "type": "boolean"
        },
        "main_monitor_screen_width_gt_2000": {
          "type": "boolean"
        },
        "is_release_channel": {
          "type": "boolean"
        },
        "locale_is_en_us": {
          "type": "boolean"
        },
        "locale_is_de": {
          "type": "boolean"
        }
      },
      "required": ["has_firefox_as_default_browser", "has_more_than_five_days_of_active_ticks", "has_more_than_1000_total_uri_count", "has_more_than_1_about_preferences_non_default_value_count", "has_at_least_one_self_installed_addon", "has_at_least_one_self_installed_popular_privacy_security_addon", "has_at_least_one_self_installed_theme", "dark_mode_active", "has_more_than_5_bookmarks", "has_at_least_one_login_saved_in_the_browser", "firefox_account_prefs_configured", "profile_at_least_7_days_old", "main_monitor_screen_width_gt_2000", "is_release_channel", "locale_is_en_us", "locale_is_de"]
    },
    "features_array_used_in_score_computation": {
      "type": "array",
      "minItems": 16,
      "maxItems": 16,
      "items": {
        "type": "number"
      }
    }
  },
  "required": ["model_version", "study_variation", "study_addon_version", "client_context_features", "boolean_client_context_features", "features_array_used_in_score_computation"]
};
validate.errors = null;
