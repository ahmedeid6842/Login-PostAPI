const express = require('express');
const router = express.Router();
// const config = require('config');

const userControllers = require('../controllers/users');
const { headerToken, routesToken } = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('../middleware/multer');

router.post('/', userControllers.addUser);
router.get('/activate/:token', [routesToken, multer], userControllers.activateUser);

router.get('/me', [headerToken, admin], userControllers.getUsers)


module.exports = router;