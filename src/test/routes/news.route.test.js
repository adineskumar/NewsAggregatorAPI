const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const app = require("../../app");
const mongoose = require("mongoose");
const {
    AUTH_HEADER_MISSING, USER_REGISTERED
} = require("../../constants/app.constants");

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


before((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

describe("Validating news routes", () => {
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

    describe("/news route", () => {
        it("should return news articles", (done) => {
            chai
            .request(app)
            .get("/news")
            .set("Authorization", `JWT ${accessToken}`)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an("array");
                done();
            });
        });


        it("should not return news articles without AUTH", (done) => {
            chai
            .request(app)
            .get("/news")
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(401);
                expect(response.body).to.have.property("error").equal(AUTH_HEADER_MISSING);
                done();
            });
        });
        
        
    });

    describe("/news/top route", () => {
        it("should return top news articles", (done) => {
            chai
            .request(app)
            .get("/news/top")
            .set("Authorization", `JWT ${accessToken}`)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an("array");
                done();
            });
        });

        it("should not return top news articles with AUTH", (done) => {
            chai
            .request(app)
            .get("/news/top")
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