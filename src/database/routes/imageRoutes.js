const express = require("express");
const imageController = require("../controllers/imageController");
const { upload } = require("../middleware/multerConfig");

const router = express.Router();

router.post("/imageUpload", imageController.updateOrgProfile);
router.post("/insertTask", imageController.uploadTaskImage);
router.post("/updateTaskImage", imageController.updateTaskImage);
router.post(
  "/insertEvent",
  upload.single("image"),
  imageController.uploadEventImage
);
router.post(
  "/updateEventImage",
  upload.single("image"),
  imageController.updateEventImage
);

module.exports = router;
