const router = require("express").Router()

const multer = require("../middleware/multer");
const profileController = require("../controllers/profiles")

router.post('/following/:id', profileController.followingPost);

router.get('/follow', profileController.followGet);

router.post('/edit',multer,profileController.updating)

module.exports = router;
