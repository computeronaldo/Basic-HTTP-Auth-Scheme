const User = require("../../models/User.models");

const protectedResourceController = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", "Basic realm=Protected resource");
    res.status(401).json({
      error: "Unauthorized user",
      message: "Please provide your credentials to access to this resource",
    });
    return;
  }

  const usernameDecoded = atob(authHeader.split(" ")[1].split(":")[0]);
  const passwordDecoded = atob(authHeader.split(" ")[1].split(":")[1]);

  try {
    const user = await User.findOne({ username: usernameDecoded });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const matchPassword = await user.matchPassword(passwordDecoded);
    if (matchPassword) {
      res.status(200).json({ message: "This text is the secret resource" });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = protectedResourceController;
