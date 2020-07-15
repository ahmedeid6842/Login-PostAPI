const mongoose = require('mongoose');
const joi = require('joi');
require('joi-objectid')
const profilesSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 5,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    birthDate: {
        type: String
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'usres'
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },
    status: {
        type: String,
        minlength: 5,
        maxlength: 100,
        default: "I'm a new user"
    }
})

function validateProfile(profile) {
    const schema = {
        name: joi.string().min(5).max(50).required().trim(),
        image: joi.string().required(),
        birthDate: joi.string(),
        followers: joi.ObjectId(),
        following: joi.ObjectId(),
        status: joi.min(5).max(100)
    }
    return joi.validate(profile, schema);
}

module.exports.Profile = mongoose.model('profiles', profilesSchema);
module.exports.validateProfile = validateProfile;