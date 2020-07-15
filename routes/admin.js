const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/admin');

router.post('/login', adminControllers.login);

router.get('/get-user/:id', adminControllers.userData);

router.get('/visit-user/:id', adminControllers.visitUser);

router.get('/get-posts', adminControllers.getPosts);

module.exports = router;