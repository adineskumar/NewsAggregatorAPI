const { 
    AUTH_HEADER_MISSING, 
    AUTH_TOKEN_VERIFICATION_ERROR 
} = require("../constants/app.constants");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
require("dotenv").config({ path: 'src/.env' });
JWT_SECRET=process.env.JWT_SECRET;

const verifyToken = function(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ error : AUTH_HEADER_MISSING});
    };
    const accessToken = authHeader.split(" ")[1];
    try {
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        User.findOne(
            {
                "email": decodedToken.email
            }
        ).then((user) => 
            {
                if(!user) {
                    return response.status(401).json({ error: AUTH_TOKEN_VERIFICATION_ERROR});
                };
                request.user = user;
                next();
            }
        ).catch((error) => {
            return response.status(401).json({ error: AUTH_TOKEN_VERIFICATION_ERROR});
        });
    } catch (error) {
        return response.status(401).json({ error: AUTH_TOKEN_VERIFICATION_ERROR});
    }
}

module.exports = { verifyToken };