const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 5,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 5,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    isAdmin: {
        type: Boolean
    },
    Activate: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, Activated: this.Activate },config.get('jwtPrivateKey'));
    return token;
}


function validateUser(user) {
    const schema = {
        name: joi.string().min(5).max(50).required(),
        email: joi.string().min(5).max(50).email().required(),
        password: joi.string().min(5).max(16).required()
    }
    return joi.validate(user, schema);
}
function validateLogin(user) {
    const schema = {
        email: joi.string().min(5).max(50).required(),
        password: joi.string().min(5).max(16).required()
    }
    return joi.validate(user, schema);
}
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;
module.exports.User = mongoose.model('users', userSchema);