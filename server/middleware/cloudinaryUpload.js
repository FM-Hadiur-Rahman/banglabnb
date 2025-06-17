const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "banglabnb/verifications",
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
      public_id: `${file.fieldname}-${Date.now()}`,
      // resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
      resource_type: "raw",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
