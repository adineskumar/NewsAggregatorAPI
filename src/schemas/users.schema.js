const mongoose = require('mongoose');
const ajv_plugin = require('mongoose-ajv-plugin');
const { preference_json_schema } = require('../../src/schemas/preferences.schema.js');
const {
  ENUM_CATEGORIES,
  ERR_CATEGORY_ENUM,
  ERR_SOURCES,
  ERR_REQUIRED_CATEGORIES,
  ERR_REQUIRED_SOURCES,
  ID_PREFERENCES,
  ERR_USERNAME,
  ERR_PASSWORD,
  ERR_PREFERENCES,
  ERR_REQUIRED_USERNAME,
  ERR_REQUIRED_PASSWORD,
  ID_USERS,
  ERR_ADDITIONAL_PROPERTIES,
} = require('../../src/constants/schema.constants.js');
var Schema = mongoose.Schema;

const users_json_schema = {
  $id: ID_USERS,
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 3,
      errorMessage: ERR_USERNAME,
    },
    password: {
      type: "string",
      minLength: 3,
      errorMessage: ERR_PASSWORD,
    },
    preferences: {
      $ref: ID_PREFERENCES,
      type: "object",
      properties: {
        categories: {
          type: "array",
          minItems: 1,
          items: {
            type: "string",
            enum: ENUM_CATEGORIES,
          },
          errorMessage: ERR_CATEGORY_ENUM,
        },
        sources: {
          type: "array",
          minItems: 1,
          items: {
            type: "string",
          },
          errorMessage: ERR_SOURCES,
        },
      },
      required: ["categories", "sources"],
      additionalProperties: false,
      errorMessage: {
        required: {
        categories: ERR_REQUIRED_CATEGORIES,
        sources: ERR_REQUIRED_SOURCES,
      },
      additionalProperties: ERR_ADDITIONAL_PROPERTIES
    },
      default: { categories: [], sources: [] },
      errorMessage: ERR_PREFERENCES,
    },
  },
  required: ["username", "password"],
  additionalProperties: false,
  errorMessage: {
    required: {
      username: ERR_REQUIRED_USERNAME,
      password: ERR_REQUIRED_PASSWORD,
    },
    additionalProperties: ERR_ADDITIONAL_PROPERTIES,
  },
};

usersSchema = new Schema({
  username: String,
  password: String,
  // preferences: {
  //   type: Schema.Types.Mixed,
  //   schema: preference_json_schema
  // }
  preferences: {
    category: [String],
    sources: [String]
  }
})

usersSchema.plugin(ajv_plugin, { schema: users_json_schema });

module.exports = mongoose.model('User', usersSchema);
