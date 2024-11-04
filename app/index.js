const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes");

const connectToMongoDB = require("./db/db");

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
app.use("/api", router);

connectToMongoDB();

app.listen(3000, () => {
  console.log("Listening to incoming requests on PORT 3000");
});
