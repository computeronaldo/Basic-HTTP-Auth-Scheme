const router = require("express").Router();
const signUpController = require("../controllers/auth/signup");

router.post("/signup", signUpController);

module.exports = router;
