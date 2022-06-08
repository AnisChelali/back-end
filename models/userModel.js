const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "user must have a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "user must have a valid email"],
  },
  password: {
    type: String,
    required: [true, "user must have password"],
    minlength: 8,
    //select : false
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
    },
  },
  passwordChangedAt: Date,
  invitationCode: {
    type: String,
    required: [true, "u must have an invitation code to signup"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWT_iat) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWT_iat < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
