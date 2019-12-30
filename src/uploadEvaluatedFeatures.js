/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(uploadEvaluatedFeatures)" }]*/

/* global validate */

const telemetryTopic = "messaging-system-personalization-experiment-1-update";

/**
 * Submit evaluated features using the messaging-system-personalization-experiment-1-update
 * schema/topic for consumption by the model training job
 *
 * @param personalizedModelVersion
 * @param clientContext
 * @param booleanFeatures
 * @param features
 * @returns {Promise<void>}
 */
const uploadEvaluatedFeatures = async (
  personalizedModelVersion,
  clientContext,
  booleanFeatures,
  features,
) => {
  if (await browser.privileged.privacyContext.aPrivateBrowserWindowIsOpen()) {
    console.info(
      "A private browser window is open. Not uploading evaluated features right now.",
    );
    return;
  }

  console.info("Compiling telemetry payload for upload based on: ", {
    personalizedModelVersion,
    clientContext,
    booleanFeatures,
    features,
  });

  const payload = {
    model_version: personalizedModelVersion,
    study_variation: browser.runtime.id,
    study_addon_version: browser.runtime.getManifest().version,
  };

  console.debug(
    "Telemetry about to be validated using the compiled ajv validate() function:",
    payload,
  );

  const validationResult = validateSchema(payload);

  if (!validationResult.valid) {
    console.error("Invalid telemetry payload", { payload, validationResult });
    throw new Error("Invalid telemetry payload");
  }

  const type = telemetryTopic;
  const message = payload;
  const options = {
    addClientId: false,
    addEnvironment: false,
  };
  await browser.telemetry.submitPing(type, message, options);
  console.log(`Submitted "${telemetryTopic}" telemetry:`, payload);
};

/**
 * Uses the ajv-compiled schema validation function
 * from validate.js to validate the payload against
 * schemas/messaging-system-personalization-experiment-1-update.payload.schema.json
 *
 * @param payload
 * @returns {{valid: boolean, errors: string[]}}
 */
const validateSchema = payload => {
  const result = validate(payload);
  return { valid: result, errors: validate.errors };
};
