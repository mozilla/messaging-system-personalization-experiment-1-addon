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

  /**
   * A this-experiment-specific version of TelemetryFeed.applyCFRPolicy
   * Permalink of the origin code at the time of authoring this shorter version:
   * https://dxr.mozilla.org/mozilla-central/rev/7c47e27e43c19a724a1353197f89a51298cad2fd/browser/components/newtab/lib/TelemetryFeed.jsm#596-614
   *
   * Note that since the experiment places the profile in a CFR cohort,
   * client id will always be added, and impression_id will never be set.
   */
  const applyCFRPolicy = async payload => {
    let addClientId;
    const isInCFRCohort = true; // Always true in this experiment
    if (clientContext.update_channel === "release" && !isInCFRCohort) {
      addClientId = false;
      payload.impression_id = await browser.privileged.messagingSystem.getOrCreateImpressionId();
    } else {
      addClientId = true;
    }
    return { addClientId, payload };
  };

  const { addClientId, payload } = await applyCFRPolicy({
    model_version: personalizedModelVersion,
    study_variation: browser.runtime.id,
    study_addon_version: browser.runtime.getManifest().version,
    client_context_features: clientContext,
    boolean_client_context_features: booleanFeatures,
    features_array_used_in_score_computation: features,
  });

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
    addClientId,
    addEnvironment: false,
  };

  if (payload.client_context_features.total_uri_count === 0) {
    // In some cases - the total_uri_count returned from 
    // browser.privileged.clientContext.getTotalUriCount() returns an
    // `undefined`.   In those cases, we just skip the current ping.
    console.log(`Skipped due to missing total_uri_count: "${telemetryTopic}" telemetry:`, payload);
    return;
  }
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
