const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("✅ Required roles:", roles);
    console.log("🧑‍💻 Logged-in user role:", req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = authorize;
