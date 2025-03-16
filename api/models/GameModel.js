const { default: mongoose } = require("mongoose");
const GameStatus = require("../enums/GameStatus");
const { Schema } = mongoose;


const GameSchema = new mongoose.Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  board: {
    type: [[String]],
    required: true
  },
  currentTurn: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: GameStatus,
    required: true,
    default: GameStatus.IN_PROGRESS
  }
});

const Game = mongoose.model("Game", GameSchema);
module.exports = { Game };