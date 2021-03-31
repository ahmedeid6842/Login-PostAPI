const express = require("express");
const bodyParser = require("body-parser");

const db = require("./middleware/db");
const register = require("./routes/users")
const profile = require("./routes/profile")
const post = require("./routes/posts")
const auth = require("./routes/auth");
const admin = require("./routes/admin");


const app = express();
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("images"));

app.use('/register', register);
app.use('/profile', profile)
app.use('/posts', post)
app.use('/auth', auth);
app.use('/admin', admin)


db.initDB((err, db) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(3000, console.log("connected"));
    }

})