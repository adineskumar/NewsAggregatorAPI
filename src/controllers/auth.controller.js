const { User } = require("../models/user.model");
const {
    USER_REGISTERED,
    USER_REGISTRATION_FAILED,
    USER_ALREADY_EXISTS,
    USER_DOES_NOT_EXISTS,
    MSG_USER_LOGIN_FAILUE,
    MSG_USER_SUCCESSFUL_LOGIN,
    INVALID_USER_PASSWORD,
    INVALID_EMAIL,
    MISSING_USER_DETAILS,
    USER_VALIDATION_FAILED
} = require("../constants/app.constants");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: 'src/.env' });
JWT_SECRET=process.env.JWT_SECRET;

function generateAccessToken(email) {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: 86400 });
}


function hashPassword(plaintextPassword) {
    const hash = bcrypt.hashSync(plaintextPassword, 10);
    return hash;
}

function comparePassword(plaintextPassword, hash) {
    const result = bcrypt.compareSync(plaintextPassword, hash);
    return result;
}

const login = function (request, response) {
    User.findOne(
        {
            "email": request.body.email
        }
    ).then((user) => {
        if (!user) {
            return response.status(404).json({ error: USER_DOES_NOT_EXISTS });
        };
        const validPassword = comparePassword(request.body.password, user.password);
        if (!validPassword) {
            return response.status(401).json({ error: INVALID_USER_PASSWORD });
        };
        const accessToken = generateAccessToken(request.body.email);
        return response.status(200).json({ message: MSG_USER_SUCCESSFUL_LOGIN, accessToken });
    }).catch((error) => {
        return response.status(404).json({ error: MSG_USER_LOGIN_FAILUE });
    });
}

const register = function (request, response) {    
    const newUser = new User({
        username: request.body.username,
        email: request.body.email,
        password: hashPassword(request.body.password),
        preferences: request.body.preferences,
        updated_at: Date.now()
    });
    errors = newUser.validateSync();
    if (errors) {
        return response.status(401).json({ error: USER_VALIDATION_FAILED });
    };

    User.findOne(
        {
            "email": request.body.email
        }
    ).then((user) => {
        if (!user) {            
            newUser.save().then((doc) => {
                return response.status(200).json({ message: USER_REGISTERED });
            }).catch((error) => {
                return response.status(401).json({ error: USER_REGISTRATION_FAILED });
            });
        } else {
            return response.status(400).json({ error: USER_ALREADY_EXISTS });
        };
    }).catch((error) => {
        console.log(error);
        return response.status(400).json({ error });
    });
}


module.exports = { register, login, generateAccessToken, comparePassword, hashPassword };
