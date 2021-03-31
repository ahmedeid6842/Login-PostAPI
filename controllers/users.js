const { ObjectId } = require("mongodb");

const _db = require("../middleware/db").getDB;
const cloudinary = require("../middleware/cloudinary");
const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");

module.exports.registerPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).send({
            validataion: errors.array()
        })
    }
    let { email, password, nameFirst, nameLast } = req.body, defaultProfileImage = "https://res.cloudinary.com/dj2yju5sd/image/upload/v1598091690/unknown-512_wvydzh.png";
    // let user = await _db().db().collection("users").findOne({ email });
    // if (user) return res.status(402).send("email already exsists");

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    _db()
        .db()
        .collection("users")
        .insertOne({
            password,
            email,
            name: { first: nameFirst, last: nameLast },
            followers: [],
            following: [],
            image: defaultProfileImage
        })
        .then(() => {
            res.send("welcome");
        })
        .catch(err => {
            console.log(err);
        })

}

module.exports.activate = async (req, res) => {
    const user = await _db().db().collection("users").updateOne({ _id: ObjectId(req.body._id) }, { $set: { activate: true } });

}