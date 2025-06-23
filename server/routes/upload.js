// routes/upload.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinaryUpload"); // uses multer-storage-cloudinary

router.post("/banner", upload.single("file"), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path }); // ✅ Cloudinary secure URL
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
