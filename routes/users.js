const router = require("express").Router();

const multer = require("../middleware/multer");
const userControllers = require("../controllers/users");
const { validateSignup } = require("../middleware/validate")

router.post('/', [multer, validateSignup], userControllers.registerPost);

router.get('/activate', userControllers.activate);

router.get('/me')

module.exports = router;