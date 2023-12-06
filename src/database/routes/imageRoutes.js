const express = require("express");
const imageController = require("../controllers/imageController");
const { upload } = require("../middleware/multerConfig");

const router = express.Router();

router.post(
  "/imageUpload",
  upload.single("image"),
  imageController.updateOrgProfile
);
router.post(
  "/insertTask",
  upload.single("image"),
  imageController.uploadTaskImage
);
router.post(
  "/updateTaskImage",
  upload.single("image"),
  imageController.updateTaskImage
);
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
router.post(
  "/insertProduct",
  upload.single("image"),
  imageController.uploadProductImage
);
router.post(
  "/updateProductImage",
  upload.single("image"),
  imageController.updateProductImage
);

router.post(
  "/updateProfilePicture",
  upload.single("image"),
  imageController.updateProfilePicture
);

router.post(
  "/postTaskProofs",
  upload.array("images"),
  imageController.submitProofImages
);

module.exports = router;
