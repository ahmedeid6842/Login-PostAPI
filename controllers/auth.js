const _db = require("../middleware/db").getDB;
const bcrypt = require("bcrypt");

module.exports.postLogin = async (req, res) => {
    let { email, password } = req.body;
    let user = await _db()
        .db()
        .collection("users")
        .findOne({ email });
    if (!user) res.status(400).send("invalid email or password");

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send("internal server error")
        return result ? res.status(200).send("successfully login") : res.status(400).send("invalid email or password");
    })

}