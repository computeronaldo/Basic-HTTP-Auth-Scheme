const router = require("express").Router();
const authRouter = require("./authRouter");
const protectedResourceRouter = require("./protectedResource");

router.use("/auth", authRouter);
router.use("/user", protectedResourceRouter);

module.exports = router;
