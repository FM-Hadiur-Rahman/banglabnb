const jwt = require("jsonwebtoken");

// const generateToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "30d", // or "7d" if you prefer
//   });
// };

// module.exports = generateToken;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      roles: user.roles, // optionally include roles
      primaryRole: user.primaryRole,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};
module.exports = generateToken;
