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
    }
  },
  "required": ["model_version", "study_variation", "study_addon_version"]
};
validate.errors = null;
