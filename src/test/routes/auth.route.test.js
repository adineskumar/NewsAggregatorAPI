const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../../app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../../controllers/auth.controller");

const {
    USER_REGISTERED,
    USER_ALREADY_EXISTS,
    USER_VALIDATION_FAILED,
    MSG_USER_SUCCESSFUL_LOGIN,
    INVALID_USER_PASSWORD,
    USER_DOES_NOT_EXISTS
} = require("../../constants/app.constants");
const mongoose = require("mongoose");

chai.use(chaiHttp);

const validUserRegistration = {
        "username": "testuser",
        "email": "testuser@gmail.com",
        "password": "testuser@2023"
}

const userNotHavingEmail = {
    "username": "testuser",
    "password": "testuser@2023"
}

const userNotHavingUsername = {
    "email": "testuser@gmail.com",
    "password": "testuser@2023"
}

const userNotHavingStrongPassword = {
    "email": "testuser@gmail.com",
    "password": "123456"
}

const loginWithValidCreds = {
    "email": "testuser@gmail.com",
    "password": "testuser@2023"
}

const loginWithInValidPassword = {
    "email": "testuser@gmail.com",
    "password": "testuser@20231"
}

const loginWithInValidEmail = {
    "email": "testuser-1@gmail.com",
    "password": "testuser@20231"
}

     

before((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

describe("Validating User Authentication", ()=> {

    describe("/register endpoint", () => {   

        it("should register a new user", (done) => {
            chai
                .request(app)
                .post("/register")
                .send(validUserRegistration)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200);
                    expect(response.body).to.have.property("message").equal(USER_REGISTERED);
                    done();
                });
        });

        it("should not register an existing user", (done) => {
            chai
                .request(app)
                .post("/register")
                .send(validUserRegistration)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(400);
                    expect(response.body).to.have.property("error").equal(USER_ALREADY_EXISTS);
                    done();
                });
        });

        it("should not register an user without an email address", (done) => {
            chai
                .request(app)
                .post("/register")
                .send(userNotHavingEmail)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(401);
                    expect(response.body).to.have.property("error").equal(USER_VALIDATION_FAILED);
                    done();
                });
        });

        it("should not register an user without an username", (done) => {
            chai
                .request(app)
                .post("/register")
                .send(userNotHavingUsername)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(401);
                    expect(response.body).to.have.property("error").equal(USER_VALIDATION_FAILED);
                    done();
                });
        });

        it("should not register an user without a strong password", (done) => {
            chai
                .request(app)
                .post("/register")
                .send(userNotHavingStrongPassword)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(401);
                    expect(response.body).to.have.property("error").equal(USER_VALIDATION_FAILED);
                    done();
                });
        });
    });

    describe("/login endpoint", () => {

        it("User with correct credentials should be able to login", (done) => {
            chai
                .request(app)
                .post("/login")
                .send(loginWithValidCreds)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200);
                    expect(response.body).to.have.property("message").equal(MSG_USER_SUCCESSFUL_LOGIN);
                    expect(response.body).to.have.property("accessToken").equal(generateAccessToken(loginWithValidCreds.email));
                    done();
                });
        });

        it("User with incorrect password should not be able to login", (done) => {
            chai
                .request(app)
                .post("/login")
                .send(loginWithInValidPassword)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(401);
                    expect(response.body).to.have.property("error").equal(INVALID_USER_PASSWORD);
                    done();
                });
        });

        it("User with incorrect email should not be able to login", (done) => {
            chai
                .request(app)
                .post("/login")
                .send(loginWithInValidEmail)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(404);
                    expect(response.body).to.have.property("error").equal(USER_DOES_NOT_EXISTS);
                    done();
                });
        });

    }); 
});

after((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});