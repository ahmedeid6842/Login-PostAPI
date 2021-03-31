const router = require("express").Router();

const adminController = require("../controllers/admin");

router.post('/login', adminController.postLogin);

router.get('/get-user/:id', adminController.getUser);

router.get('/visit-user/:id', adminController.visitUser);

router.get('/get-posts', adminController.getPosts);

module.exports = router;