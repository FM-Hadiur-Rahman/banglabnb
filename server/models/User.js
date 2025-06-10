const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Accept either +8801XXXXXXXXX or 01XXXXXXXXX
        return /^(?:\+8801|01)[3-9][0-9]{8}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid Bangladeshi phone number!`,
    },
  },

  phoneVerified: {
    type: Boolean,
    default: false,
  },
  idDocumentUrl: String,
  idBackUrl: String,
  livePhotoUrl: String,
  identityVerified: { type: Boolean, default: false },
  signupStep: { type: Number, default: 1 },

  role: {
    type: String,
    enum: ["user", "host", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpires: {
    type: Date,
  },

  avatar: { type: String, default: "" },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  kyc: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    nidUrl: String,
    selfieUrl: String,
    reason: {
      type: String,
      default: "",
    },
    timestamp: Date,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
