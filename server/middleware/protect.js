const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Load the user object
      const user = await User.findById(decoded.id).select("-password");

      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user; // ✅ Now you have full access to _id, role, etc.
      next();
    } catch (err) {
      console.error("❌ Invalid token", err);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;
