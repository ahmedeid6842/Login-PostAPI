const router = require("express").Router();
const multer = require("../middleware/multer")
const postsControllers = require("../controllers/posts")

router.post('/new-post', multer, postsControllers.addPost);

router.post('/like/:id', postsControllers.addLike);

router.post('/comment/:id', postsControllers.addComment);

router.get('/get-post/:id', postsControllers.getPost);

router.get('/get-posts');

module.exports = router;
