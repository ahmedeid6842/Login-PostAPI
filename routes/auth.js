const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/auth');
const { routesToken } = require('../middleware/auth');

router.post('/login', authControllers.loginUser);
router.post('/reset', authControllers.resetPassword);
router.post('/reset/:token', routesToken, authControllers.changePassword);

module.exports = router;