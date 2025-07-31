const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    console.warn("⛔ No or invalid Authorization header");
    return res
      .status(401)
      .json({ message: "Unauthorized: Token missing or malformed" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.warn("⛔ User not found from token");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      roles: user.roles || [],
      primaryRole: user.primaryRole || "user",
      name: user.name,
    };

    console.log("✅ Authenticated as:", user.email, "| Roles:", req.user.roles);
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = protect;
