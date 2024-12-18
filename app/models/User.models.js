const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.NewUser = async function (userData) {
  try {
    const { username, password } = userData;
    if (!username && !password) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this({
      username,
      password: hashedPassword,
    });
    return user;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
