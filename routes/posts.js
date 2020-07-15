const express = require('express');
const router = express.Router();
const { headerToken } = require('../middleware/auth');
const multer = require('../middleware/multer');
const postControllers = require('../controllers/posts');

router.post('/new-post', [headerToken, multer], postControllers.newPost);

router.post('/like/:id', headerToken, postControllers.newLike);

router.post('/comment/:id', headerToken, postControllers.newComment);

router.get('/get-post/:id', postControllers.getPost);

router.get('/get-posts', postControllers.getPosts);


module.exports = router;