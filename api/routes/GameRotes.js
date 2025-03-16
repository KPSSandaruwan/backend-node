module.exports = function(app) {
  const GameController = require("../controllers/GameController");
  const { Auth } = require("../middleware/auth");

  app.post("/auth/game/start", Auth, GameController.startGame);
  app.post("/game/play", Auth, GameController.playTurn);
  app.post("/game/reset", Auth, GameController.resetGame);
};