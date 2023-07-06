const User = require('../../src/schemas/users.schema.js');
const mongoose = require("mongoose");
const preferencesSchema = require("../schemas/preferences.schema");
const {
  ERR_USER_NOT_FOUND,
  ERR_VALIDATION,
  ERR_SERVER_ERROR,
  STATUS_ERROR,
  MSG_PREFERENCES_UPDATED,
} = require("../../src/constants/app.constants.js");

function getPreferences(request, response) {
  User.findOne({ id: request._id }).then(user => {
    if (!user) {
      return response.status(400).json(ERR_USER_NOT_FOUND);
    }
    console.log(user);
    return response.status(200).json(user.preferences);
  }).catch(err => {
    return response.status(400).json(ERR_SERVER_ERROR);
  });
}

function updatePreferences(request, response) {
  User.findOne({ id: request._id}).then(doc => {
    console.log(doc);
    doc.preferences = request.body.preferences;
    doc.save().then(doc => {
      console.log(doc);
      return response.status(200).json(doc.preferences);
    });    
  });
}

module.exports = { getPreferences, updatePreferences };