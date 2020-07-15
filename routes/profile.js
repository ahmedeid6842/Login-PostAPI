const express = require('express');
const multer = require('../middleware/multer');

const router = express.Router();
const { headerToken } = require('../middleware/auth');
const profileControllers = require('../controllers/profile');


router.post('/following/:id', headerToken, profileControllers.followingPost);

router.get('/follow', headerToken, profileControllers.getfollowers);

router.post('/edit', [headerToken, multer], profileControllers.editing)

module.exports = router;