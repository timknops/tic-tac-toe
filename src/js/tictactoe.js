const gameBoard = (() => {
  const board = new Array(9);

  const getBoard = () => {
    return board;
  };

  const setField = (index, symbol) => {
    board[index] = symbol;
  };

  return { setField, getBoard };
})();

const Player = (symbol) => {
  const getSymbol = () => {
    return symbol;
  };

  return { getSymbol };
};

const gameController = (() => {
  const player1 = Player("X");
  const player2 = Player("O");
  let currentRound = 1;
  let currentMove = 0;
  let currentPlayerSymbol = player1.getSymbol();
  let isRoundEnd = false;

  const playMove = (position) => {
    gameBoard.setField(position - 1, currentPlayerSymbol);
    currentMove++;

    currentPlayerSymbol =
      currentPlayerSymbol === player1.getSymbol()
        ? player2.getSymbol()
        : player1.getSymbol();

    const gameEnd = checkForWin();
    if (gameEnd) {
      isRoundEnd = true;
      console.log(gameEnd);
    }
  };

  const checkForWin = () => {
    const board = gameBoard.getBoard();

    // Check horizontal.
    for (let i = 0; i < board.length; i += 3) {
      if (
        board[i] === board[i + 1] &&
        board[i] === board[i + 2] &&
        board[i] !== undefined
      ) {
        return [i, i + 1, i + 2];
      }
    }

    // Check vertical.
    for (let i = 0; i < board.length / 3; i++) {
      if (
        board[i] === board[i + 3] &&
        board[i] === board[i + 6] &&
        board[i] !== undefined
      ) {
        return [i, i + 3, i + 6];
      }
    }

    // Check diagonals.
    if (
      board[0] === board[4] &&
      board[0] === board[8] &&
      board[0] !== undefined
    ) {
      return [0, 4, 8];
    } else if (
      board[2] === board[4] &&
      board[2] === board[6] &&
      board[2] !== undefined
    ) {
      return [2, 4, 6];
    } else if (currentMove === board.length) {
      return "draw";
    }

    return false;
  };

  const getCurrentRound = () => {
    return currentRound;
  };

  const getCurrentPlayerSymbol = () => {
    return currentPlayerSymbol;
  };

  const getRoundEnd = () => {
    return isRoundEnd;
  };

  return {
    getCurrentRound,
    getCurrentPlayerSymbol,
    getRoundEnd,
    playMove,
  };
})();

const displayController = (() => {
  const boardFields = document.querySelectorAll(".board-field");
  const playerColors = ["text-emerald-500", "text-amber-500"];

  boardFields.forEach((field) => {
    field.addEventListener("click", () => {
      if (!field.hasChildNodes()) {
        updateTurn();
        field.appendChild(createCurrentPlayerIcon());
        gameController.playMove(field.getAttribute("data-position"));
      }
    });
  });

  const createCurrentPlayerIcon = () => {
    const node = document.createElement("i");
    node.classList.add(
      "fa-solid",
      `fa-${gameController.getCurrentPlayerSymbol().toLowerCase()}`,
      "fa-10x",
      gameController.getCurrentPlayerSymbol() === "X"
        ? playerColors[0]
        : playerColors[1]
    );

    return node;
  };

  const updateTurn = () => {
    const turnIcon = document.querySelector(".turn-icon");

    if (gameController.getCurrentPlayerSymbol() === "X") {
      turnIcon.classList.remove("fa-x", playerColors[0]);
      turnIcon.classList.add("fa-o", playerColors[1]);
    } else {
      turnIcon.classList.remove("fa-o", playerColors[1]);
      turnIcon.classList.add("fa-x", playerColors[0]);
    }
  };
})();
