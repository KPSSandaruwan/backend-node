module.exports = function(app) {
  const AuthController = require("../controllers/AuthController");
  const { Auth } = require("../middleware/auth");

  app.post("/register", AuthController.registerUser);
  app.post("/login", AuthController.loginUser);
  app.get("/user", Auth, AuthController.getUser);
};