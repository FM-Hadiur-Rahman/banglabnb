// models/Banner.js
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, default: "" },
  link: { type: String, default: "" }, // optional if you want clickable banners
});

module.exports = mongoose.model("Banner", bannerSchema);
