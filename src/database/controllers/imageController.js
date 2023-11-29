const upload = require("../middleware/multerConfig");
const Image = require("../models/image");
const db = require("../database");

const img = new Image(db);

async function uploadImage(request, response) {
  upload.single("image")(request, response, async (err) => {
    if (err) {
      return response.status(500).json({ error: err.message });
    }
    const filename = request.file.filename; // Assuming this is the path of the uploaded image
    const organizationId = request.body.organizationId;

    try {
      const result = await img.insertImageOrgProfile(filename, organizationId);
      response.json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
}

module.exports = { uploadImage };
