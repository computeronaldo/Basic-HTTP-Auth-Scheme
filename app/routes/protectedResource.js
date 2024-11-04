const router = require("express").Router();
const protectedResourceController = require("../controllers/user/protected-resource");

router.get("/protected-resource", protectedResourceController);

module.exports = router;
