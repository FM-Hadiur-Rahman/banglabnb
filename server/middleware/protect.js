const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    console.warn("⛔ No Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  if (!auth.startsWith("Bearer ")) {
    console.warn("⛔ Invalid token format");
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.warn("⛔ User not found from token");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("✅ Authenticated as:", user.email);
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
