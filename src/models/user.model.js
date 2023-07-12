const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { NEWS_CATEGORIES } = require("../constants/app.constants");

var notEmpty = function(features){
    if(features.length === 0){return false}
    else {return true};
}



const categorySchema = new Schema({
    categories: {
        type: [String],
        enum: ["business", "sports"],
        required: true,
        trim: true,
        lowercase: true,            
        validate: [notEmpty, 'Atleast one category should be specified']
    }
});

const sourceSchema = new Schema({
    sources: {
        type: [String],
        required: true,
        trim: true,
        lowercase: true,            
        validate: [notEmpty, 'Atleast one source should be specified']
    }
});

const preferenceSchema = new Schema({
    preferences: {
        sources: sourceSchema,
        categories: categorySchema
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username cannot be empty"],
        lowercase: true, 
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email cannot be empty"],
        trim: true,
        unique: true,
        match: [ /.+\@.+\..+/, `Email address is not valid`],
    },
    password: {
        type: String,
        required: [true, "Password cannot be empty"],
        minlength: 8,
        validate: {
            validator: function(v) {
                return /(?=.*[a-z]{2,})(?=.*[A-Z]{2,})(?=.*[0-9]{1,})(?=.*[^A-Za-z0-9])(?=.{8,})/.test(v);
            },
            message: "Password must have atleast 2 lowercase, 2 uppercase, 1 number, 1 special character with minimum 8 characters length"
        }
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    preferences: {
        categories: {
            type: [String],
            enum: NEWS_CATEGORIES
        },
        sources: {
            type: [String]
        }
    }
});

const Preferences = mongoose.model("Preferences", preferenceSchema);
const User = mongoose.model("User", userSchema);
module.exports = { User, Preferences };