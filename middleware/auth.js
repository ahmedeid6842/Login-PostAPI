const jwt = require('jsonwebtoken');
const config=require('config');

module.exports.headerToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        if (decoded.Activated === false) return res.status(400).send("please activate your account")
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).send(err.message);
    }
}

module.exports.routesToken = (req, res, next) => {
    const token = req.params.token;
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).send('invalid token ');
    }
}