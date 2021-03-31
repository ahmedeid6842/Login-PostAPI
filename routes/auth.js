const router = require("express").Router();
const authControllers = require("../controllers/auth");
const { validateLogin } = require("../middleware/validate")
router.post('/login', validateLogin, authControllers.postLogin);
router.post('/reset');
router.post('/reset/:token');

module.exports = router;

