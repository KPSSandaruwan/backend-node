const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const UserType = require("../enums/UserType");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address"
    ]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  userType: {
    type: String,
    enum: UserType,
    default: UserType.GUEST
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function(next) {
  let user = this;
  if (user.isModified("password")) {
    try {
      let salt = await bcrypt.genSalt(parseInt(process.env.SALT));
      let hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

UserSchema.methods.generateToken = function() {
  const user = this;
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
}

UserSchema.statics.verifyToken = function(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error(err);
  }
}

UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });

const User = mongoose.model("User", UserSchema);
module.exports = { User };