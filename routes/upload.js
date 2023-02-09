const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();
const {uploadController} = require('../controllers/uploadController');

router.get("/", uploadController.getUpload)
router.get("/navigation", uploadController.getNavigate)
router.post("/avatar", auth, uploadController.addAvatar )
router.post("/plant/:plantId", auth, uploadController.addPlantImage)
router.delete("/avatar", auth, uploadController.deleteAvatar)

module.exports = router;





