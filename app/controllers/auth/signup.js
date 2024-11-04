const User = require("../../models/User.models");

const signUpController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.NewUser({ username, password });
    if (!newUser) {
      throw new Error("Something went wrong.");
    }
    const createdUser = new User(newUser);
    const result = await createdUser.save();
    if (!result) {
      throw new Error("Something went wrong.");
    }
    res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = signUpController;
