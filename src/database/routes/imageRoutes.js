const express = require("express");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.post("/imageUpload", imageController.uploadImage);

module.exports = router;
