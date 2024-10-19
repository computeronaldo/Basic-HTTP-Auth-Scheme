const express = require("express");
const app = express();
const cors = require("cors");

const connectToMongoDB = require("./db/db");
const User = require("./models/User.models");

const privateRouteCORS = {
  origin: (origin, callback) => {
    if (origin === "http://localhost:5173") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cors(privateRouteCORS));

connectToMongoDB();

app.post("/signup", async (req, res) => {
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
});

app.get("/protected-resource", async (req, res) => {
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
    const matchPassword = await user.matchPassword(passwordDecoded);
    if (matchPassword) {
      res.status(200).json({ message: "This text is the secret resource" });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Listening to incoming requests on PORT 3000");
});
