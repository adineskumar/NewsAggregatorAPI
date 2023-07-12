const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../../app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
    USER_VALIDATION_FAILED,
    AUTH_HEADER_MISSING,
    USER_PREFERENCE_UPDATED
} = require("../../constants/app.constants");
const mongoose = require("mongoose");

chai.use(chaiHttp);

const validUserRegistration = {
    "username": "testuser",
    "email": "testuser@gmail.com",
    "password": "testuser@2023",
    "preferences": {
        "categories": [
            "sports"
        ],
        "sources": [
            "google-news-us"
        ]
    }
}
     
const update_preferences = {
    "categories": [
        "general"
    ],
    "sources": [
        "engadget"
    ]
}

const update_preferences_with_invalid_category = {
    "categories": [
        "india"
    ]
}


before((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

describe("Validating Preferences", ()=> {

    before((done) => {
        chai
            .request(app)
            .post("/login")
            .send(validUserRegistration)
            .end((error, response) => {
                expect(error).to.be.null;
                accessToken = response.body.accessToken
                done();
            });
    });

    describe("/preferences endpoint", () => {   

        it("should return preferences", (done) => {
            chai
                .request(app)
                .get("/preferences")
                .set("Authorization", `JWT ${accessToken}`)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200);
                    expect(response.body).to.be.an("object");
                    expect(response.body).to.have.property("categories");
                    expect(response.body).to.have.property("sources");
                    done();
                });
        });

        it("should update preferences", (done) => {
            chai
                .request(app)
                .put("/preferences")                
                .set("Authorization", `JWT ${accessToken}`)
                .send(update_preferences)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200);
                    expect(response.body).to.have.property("message").equal(USER_PREFERENCE_UPDATED);
                    done();
                });
        });
        

        it("should not update preferences without AUTH", (done) => {
            chai
                .request(app)
                .put("/preferences")
                .send(update_preferences)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(401);
                    expect(response.body).to.have.property("error").equal(AUTH_HEADER_MISSING);
                    done();
                });
        });

        it("should not return preferences without AUTH", (done) => {
            chai
                .request(app)
                .get("/preferences")
                .send(update_preferences)
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(401);
                    expect(response.body).to.have.property("error").equal(AUTH_HEADER_MISSING);
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