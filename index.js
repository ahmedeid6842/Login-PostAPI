const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('config');
const register = require('./routes/users');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const post = require('./routes/posts');
const admin = require('./routes/admin');

app.use(express.json())
app.use('/images', express.static('images'));

console.log(config.get("cloudKey"),config.get("cloudSecret"),config.get('sendgrid'))
app.use('/register', register);
app.use('/auth', auth);
app.use('/profile', profile)
app.use('/post', post)
app.use('/admin', admin)



mongoose.connect('mongodb://localhost/index', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, console.log('contected .....'));
    }).catch(err => {
        console.log(err);
    })
