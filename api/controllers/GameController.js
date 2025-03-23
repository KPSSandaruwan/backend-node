const { User } = require("../models/UserModel");
const { Game } = require("../models/GameModel");
const GameStatus = require("../enums/GameStatus");

exports.startGame = async (req, res) => {
  try {
    console.log("req.user", req.user);
    const { username } = req.body;

    const player = await User.findOne({ _id: req.user.id });
    if (!player) {
      return res.status(404).send({ success: false, error: "User not found" });
    }

    console.log("player", player);

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
      return res
        .status(500)
        .send({ success: false, error: "Could not start game" });
    } else {
      return res.status(201).send({ success: true, gameData: game });
    }
  } catch (err) {
    res.status(500).send({ error: "Could not start game" });
  }
};

exports.playTurn = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { gameId, row, col, currentPlayer } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    console.log("game.currentPlayer", game.currentPlayer);

    if (game.currentTurn !== currentPlayer) {
      return res.status(403).json({ message: "It's not your turn" });
    }

    if (game.board[row][col] === "") {
      // Update the game board with the player's move
      game.board[row][col] = currentPlayer;

      if (checkForWin(game, currentPlayer)) {
        game.status = GameStatus.WON;
      } else if (checkForDraw(game)) {
        game.status = GameStatus.DRAW;
      } else {
        currentPlayer === "X"
          ? (game.currentTurn = "O")
          : (game.currentTurn = "X");

        // Server move
        const emptyCells = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (game.board[i][j] === "") {
              emptyCells.push({ row: i, col: j });
            }
          }
        }

        if (emptyCells.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          const serverMove = emptyCells[randomIndex];
          game.board[serverMove.row][serverMove.col] = game.currentTurn;
        }

        if (checkForWin(game, game.currentTurn)) {
          game.status = GameStatus.LOOSE;
        } else if (checkForDraw(game)) {
          game.status = GameStatus.DRAW;
        } else {
          if (game.currentTurn === "X") {
            game.currentTurn = "O";
          } else {
            game.currentTurn = "X";
          }
        }
      }

      let savedGame = await game.save();
      return res.status(200).json({
        success: true,
        message: "Move made successfully",
        gameData: savedGame
      });
    }
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "Move made failed!",
      data: error
    });
  }
};

function checkForWin(game, marker) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      game.board[i][0] === marker &&
      game.board[i][1] === marker &&
      game.board[i][2] === marker
    ) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      game.board[0][i] === marker &&
      game.board[1][i] === marker &&
      game.board[2][i] === marker
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    game.board[0][0] === marker &&
    game.board[1][1] === marker &&
    game.board[2][2] === marker
  ) {
    return true;
  }
  if (
    game.board[0][2] === marker &&
    game.board[1][1] === marker &&
    game.board[2][0] === marker
  ) {
    return true;
  }

  return false;
}

function checkForDraw(game) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (game.board[i][j] === "") {
        return false;
      }
    }
  }
  return true;
}

exports.resetGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await Game.findById(gameId);

    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }
    // Clear the game board
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        game.board[i][j] = "";
      }
    }

    game.status = GameStatus.PROGRESS;
    game.currentPlayer = Math.random() < 0.5 ? "X" : "O";
    const savedGame = await game.save();
    res.status(200).json({
      success: true,
      message: "Game reset successfully",
      data: savedGame
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      message: "Game reset failed!",
      data: err.message
    });
  }
};
