// middlewares/multerConfig.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    let dest = request.body.filePath || "uploads/";

    // Ensure directory exists or create it
    const dir = path.join(__dirname, "../", dest);
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (request, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "../", filePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
};

module.exports = { upload, deleteFile };
