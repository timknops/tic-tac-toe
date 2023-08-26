const gameBoard = (() => {
  const board = new Array(9);

  return { board };
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
  let currentPlayerSymbol = player1.getSymbol();

  return {
    currentRound,
    currentPlayerSymbol,
  };
})();

const displayController = (() => {
  const boardFields = document.querySelectorAll(".board-field");
  const playerColors = ["text-emerald-500", "text-amber-500"];

  boardFields.forEach((field) => {
    field.addEventListener("click", () => {
      if (!field.hasChildNodes()) {
        field.appendChild(createPlayerIcon());
      }
    });
  });

  const createPlayerIcon = () => {
    const node = document.createElement("i");
    node.classList.add(
      "fa-solid",
      `fa-${gameController.currentPlayerSymbol.toLowerCase()}`,
      "fa-10x",
      gameController.currentPlayerSymbol === "X"
        ? playerColors[0]
        : playerColors[1]
    );

    return node;
  };
})();
