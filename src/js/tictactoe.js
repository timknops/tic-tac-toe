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
  let currentMove = 1;
  let currentPlayerSymbol = player1.getSymbol();

  const playMove = (position) => {
    gameBoard.setField(position - 1, currentPlayerSymbol);

    currentPlayerSymbol =
      currentPlayerSymbol === player1.getSymbol()
        ? player2.getSymbol()
        : player1.getSymbol();

    currentMove++;
    console.log(gameBoard.getBoard());
  };

  const getCurrentRound = () => {
    return currentRound;
  };

  const getCurrentPlayerSymbol = () => {
    return currentPlayerSymbol;
  };

  return {
    getCurrentRound,
    getCurrentPlayerSymbol,
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
