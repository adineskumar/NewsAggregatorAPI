const { ERR_MISSING_AUTH_HEADER, ERR_TOKEN_VERIFICATION } = require('../../src/constants/app.constants.js');
const { JWT_SECRET } = require('../../src/config/env.js');
const jwt = require('jsonwebtoken');
const User = require('../../src/schemas/users.schema.js');

module.exports = function verifyToken(request, response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({
      error: ERR_MISSING_AUTH_HEADER
    });
  }
  const accessToken = authHeader.split(" ")[1];
  const decoded = jwt.verify(accessToken, JWT_SECRET);
  User.findOne({ username: decoded.username })
    .then(user => {
      if (!user) {
        return response.status(401).json({ error: ERR_TOKEN_VERIFICATION });
      }
      request._id = user.id;
      console.log(user.id);
    })
    .catch(err => {
      return response.status(401).json({ error: ERR_TOKEN_VERIFICATION });
    });
  next();
}