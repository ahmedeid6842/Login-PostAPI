const { User, validateLogin } = require('../models/users');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const _ = require('lodash');

const transport = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: config.get("sendgrid")
    }
}))

exports.loginUser = async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.send(404).send('invalid email or password');

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(404).send('invalid email or password');

    if (user.Activate === false) return res.status(401).send('please activate your account ');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(`login successfully ${user.name}`)
}

exports.resetPassword = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.send('check your email');

    const token = user.generateAuthToken();
    transport.sendMail({
        to: req.body.email,
        from: 'essamomar75369@gmail.com',
        subject: 'reset password',
        html: `
        <p> You requested a password </p>
        <p> Click this <a href=http://localhost:3000/auth/reset/${token}> to reset your password</p>`
    })
    res.send('please check your email');
}

exports.changePassword = async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('no user');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.save();
    res.send('password change successfully');
}