const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the API V1");
});

require("./AuthRoutes")(router);
require("./GameRotes")(router);

module.exports.router = router;