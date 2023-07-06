const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('../../src/schemas/users.schema.js');
const { validateToken } = require('../../src/middlewares/auth.middleware.js');

const preference_json_schema = require('../../src/schemas/preferences.schema.js');

const {
  STATUS_ERROR,
  STATUS_SUCCESS,
  ERR_USER_EXISTS,
  ERR_USER_NOT_FOUND,
  ERR_INVALID_PASSWORD,
  ERR_VALIDATION,
  ERR_SERVER_ERROR,
  ERR_TOKEN_VERIFICATION,
  ERR_MISSING_AUTH_HEADER,
  ERR_SERVER_START,
  ERR_REQUEST_LIMIT_EXCEEDED,
  MSG_SUCCESSFUL_REGISTRATION,
  MSG_SUCCESSFUL_LOGIN,
  MSG_PREFERENCES_UPDATED,
  MSG_SERVER_RUNNING,
} = require('../../src/constants/app.constants.js');
const { JWT_SECRET } = require('../../src/config/env.js');

function generateAccessToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: 86400 });
}


function hashPassword(plaintextPassword) {
  const hash = bcrypt.hashSync(plaintextPassword, 10);
  return hash;
}

function comparePassword(plaintextPassword, hash) {
  const result = bcrypt.compareSync(plaintextPassword, hash);
  return result;
}


const register = function(request, response) {
  var newUser = new User({
    "username": request.body.username,
    "password": hashPassword(request.body.password),
    "preferences": request.body.preferences
  });


  User.findOne({ "username": newUser.username }).then(user => {
    if (!user) {
      newUser.save();
      return response.status(200).json({ message: MSG_SUCCESSFUL_REGISTRATION });
    } else {
      return response.status(400).json({ message: ERR_USER_EXISTS });
    }
  }).catch(error => {
    return response.status(400).json({ message: ERR_VALIDATION });
  });
}

const login = function(request, response) {
  User.findOne({ "username": request.body.username }).then(user => {
    if (!user) {
      return response.status(404).json({ message: ERR_USER_NOT_FOUND });
    }
    const validPassword = comparePassword(request.body.password, user.password);
    if (!validPassword) {
      return response.status(401).json({ message: ERR_INVALID_PASSWORD });
    }
    const accessToken = generateAccessToken(request.body.username);
    return response.status(200).json({ message: MSG_SUCCESSFUL_LOGIN, accessToken });
  }).catch(error => {
    return response.status(200).json({ message: ERR_VALIDATION });
  });
}

module.exports = { register, login };