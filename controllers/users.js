const { User, validateUser, validateLogin } = require('../models/users');
const { Profile, validateProfile } = require('../models/social/profile')
const cloudinary = require('../middleware/cloudinary');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const sendgridTransport = require("nodemailer-sendgrid-transport");
const _ = require('lodash');
const config = require('config');



const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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 "
    }
}))


exports.addUser = async (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('email already registerd')

    user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    const token = user.generateAuthToken();
    transport.sendMail({
        to: req.body.email,
        from: 'essamomar75369@gmail.com',
        subject: 'activate account',
        html: `
        <p> You requested a account activate </p>
        <p> Click this <a href=http://localhost:3000/register/activate/${token}> to activate your account`
    })
    res.send('please check your email to activate account');



}

exports.activateUser = async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('invalid user');

    const result = await cloudinary.upload("http://res.cloudinary.com/dj2yju5sd/image/upload/v1594659091/vooufauusg855l3gvxo3.jpg");//req.files[0].path
    user.Activate = true;
    const profile = new Profile({
        username: user.name,
        image: result.url,
        userID: user._id
    })

    user = await user.save();
    await profile.save();
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send('activated successfully');
}



exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.send(users);
}