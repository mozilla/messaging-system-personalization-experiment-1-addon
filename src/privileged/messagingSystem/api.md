# Namespace: `browser.privileged.messagingSystem`

Access to certain parts of the messaging system

## Functions

### `browser.privileged.messagingSystem.getCfrProviderMessages( bucket, cohort )`

getCfrProviderMessages

**Parameters**

- `bucket`

  - type: bucket
  - \$ref:
  - optional: false

- `cohort`
  - type: cohort
  - \$ref:
  - optional: false

### `browser.privileged.messagingSystem.getOrCreateImpressionId( )`

Exposes TelemetryFeed.getOrSetImpressionId()

**Parameters**

### `browser.privileged.messagingSystem.getASRouterTargetingGetters( gettersList )`

getASRouterTargetingGetters

**Parameters**

- `gettersList`
  - type: gettersList
  - \$ref:
  - optional: false

### `browser.privileged.messagingSystem.setASRouterCfrProviderPref( bucket, cohort, personalizedModelVersion )`

setASRouterCfrProviderPref

**Parameters**

- `bucket`

  - type: bucket
  - \$ref:
  - optional: false

- `cohort`

  - type: cohort
  - \$ref:
  - optional: false

- `personalizedModelVersion`
  - type: personalizedModelVersion
  - \$ref:
  - optional: true

### `browser.privileged.messagingSystem.clearASRouterCfrProviderPref( )`

clearASRouterCfrProviderPref

**Parameters**

## Events

### `browser.privileged.messagingSystem.onCfrModelsSync ()` Event

Fires when the Cfr models remote settings bucket has been updated.

**Parameters**

- `syncEvent`
  - type: syncEvent
  - \$ref:
  - optional: false

## Properties TBD

## Data Types

### [0] syncEvent

```json
{
  "id": "syncEvent",
  "$schema": "http://json-schema.org/draft-04/schema",
  "type": "object",
  "properties": {
    "data": {
      "type": "object",
      "properties": {
        "created": {
          "type": "array"
        },
        "current": {
          "type": "array"
        },
        "deleted": {
          "type": "array"
        },
        "updated": {
          "type": "array"
        }
      }
    }
  },
  "required": ["data"],
  "testcase": {
    "data": {
      "created": [],
      "current": [],
      "deleted": [],
      "updated": []
    }
  }
}
```
