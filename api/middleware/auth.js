const { User } = require("../models/UserModel");

const Auth = (req, res, next) => {
  let token = req.header("x-auth-token") || req.header("authorization");
  if (!token) {
    return res.status(401).send("Access denied. No token provided");
  }

  try {
    if (token.startsWith("Bearer")) {
      token = token.slice(7, token.length);
    }

    const decoded = User.verifyToken(token);
    req.user = decoded;

    next();

  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Invalid token",
      error: err,
    });
  }
}

module.exports = { Auth };