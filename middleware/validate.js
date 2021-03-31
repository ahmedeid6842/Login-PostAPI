const { body } = require("express-validator");
const _db = require("./db").getDB;

module.exports.validateLogin = [
    body('email')
        .exists()
        .isEmail()
        .normalizeEmail()
        .trim(),
    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage("8~16 long")
        .escape()
]

module.exports.validateSignup = [
    body("email")
        .isEmail()
        .withMessage("invalid email")
        .normalizeEmail()
        .bail()
        .custom((email, { req }) => {
            return _db()
                .db()
                .collection("users")
                .findOne({ email })
                .then(user => {

                    if (user) return Promise.reject("email is already used");
                })
        }),
    body('password')
        .isLength({ min: 8, max: 8 })
        .withMessage("8~16 long")
        .matches(/\d/).withMessage("must Contain")
        .escape(),
    body(["nameFirst", "nameLast"])
        .isAlpha().withMessage("must be string")
        .isLength({ min: 3, max: 50 }),
]


