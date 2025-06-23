// controllers/bannerController.js
const Banner = require("../models/Banner");

exports.addBanner = async (req, res) => {
  const { imageUrl, caption, link } = req.body;
  try {
    const newBanner = new Banner({ imageUrl, caption, link });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    console.error("Failed to add banner:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Failed to delete banner:", err);
    res.status(500).json({ message: "Server error" });
  }
};
