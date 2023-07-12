const { Preferences } = require("../models/user.model");
const { 
    USER_PREFERENCE_VALIDATION_ERROR,
    USER_PREFERENCE_UPDATE_FAILURE,
    USER_VALIDATION_FAILED,
    USER_PREFERENCE_UPDATED
 } = require("../constants/app.constants"); 
const { User } = require("../models/user.model");

const getPreferences = function (request, response) {
    if (!request.user) {
        return response.status(401).json({ message: USER_VALIDATION_FAILED });
    };
    return response.status(200).json(request.user.preferences);  
}

const updatePreferences = function (request, response) { 
    if (!request.user) {
        return response.status(401).json({ message: USER_VALIDATION_FAILED });
    };
    const preferences = new Preferences(request.body.preferences);
    errors = preferences.validateSync();
    if (errors) {
        return response.status(401).json({ error: USER_PREFERENCE_VALIDATION_ERROR });
    };
    
    request.user.preferences = request.body.preferences;
    request.user.updated_at = Date.now();
    request.user.save().then((doc) => {
        return response.status(200).json({ message: USER_PREFERENCE_UPDATED });
    }).catch((error) => {
        return response.status(400).json({ message: USER_PREFERENCE_UPDATE_FAILURE });
    });
}


module.exports = { getPreferences, updatePreferences };
