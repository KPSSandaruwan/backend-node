const { User } = require("../models/UserModel");
const { Game } = require("../models/GameModel");
const GameStatus =  require("../enums/GameStatus");

exports.startGame = async (req, res) => {
  try {
    console.log('req.user', req.user);
    const { username } = req.body;

    const player = await User.findOne({ _id: req.user.id });
    if (!player) {
      return res.status(404).send({ success: false, error: "User not found" });
    }

    console.log('player', player);

    const firstTurn = Math.random() > 0.5 ? "X" : "O";
    const newGame = new Game({
      player: player._id,
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ],
      currentTurn: firstTurn,
      status: GameStatus.IN_PROGRESS
    });
    const game = await newGame.save();
    if (!game) {
      return res.status(500).send({ success: false, error: "Could not start game" });
    } else {
      return res.status(201).send({ success: true, gameData: game });
    }
  } catch (err) {
    res.status(500).send({ error: "Could not start game" });
  }
};

exports.playTurn = async (req, res) => {};

exports.resetGame = async (req, res) => {};