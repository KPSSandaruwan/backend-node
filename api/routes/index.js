const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the API V1");
});

module.exports.router = router;