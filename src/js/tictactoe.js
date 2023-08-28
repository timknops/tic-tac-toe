const gameBoard = (() => {
  let board = new Array(9);

  const getBoard = () => {
    return board;
  };

  const setField = (index, symbol) => {
    board[index] = symbol;
  };

  const resetBoard = () => {
    board = new Array(9);
  };

  return { setField, getBoard, resetBoard };
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

    const gameEnd = checkForWin();
    if (gameEnd) {
      isRoundEnd = true;
      currentRound++;

      if (gameEnd === "draw") {
        currentPlayerSymbol = "draw";
      }

      displayController.displayWinningRow(gameEnd);
      setTimeout(() => {
        displayController.toggleWinningModal(currentPlayerSymbol);
        setTimeout(() => {
          displayController.toggleOverlay();
        }, 800);
      }, 1000);
    } else {
      displayController.updateTurn();
      currentPlayerSymbol =
        currentPlayerSymbol === player1.getSymbol()
          ? player2.getSymbol()
          : player1.getSymbol();
    }
  };

  const checkForWin = () => {
    const board = gameBoard.getBoard();

    // Check horizontals.
    for (let i = 0; i < board.length; i += 3) {
      if (
        board[i] === board[i + 1] &&
        board[i] === board[i + 2] &&
        board[i] !== undefined
      ) {
        return [i, i + 1, i + 2];
      }
    }

    // Check verticals.
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

  const resetGameValues = () => {
    currentRound = 1;
    currentMove = 0;
    currentPlayerSymbol = player1.getSymbol();
    isRoundEnd = false;
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
    resetGameValues,
  };
})();

const displayController = (() => {
  const boardFields = document.querySelectorAll(".board-field");
  const playerColors = [
    "text-emerald-500",
    "text-amber-500",
    "bg-emerald-500",
    "bg-amber-500",
  ];
  const modal = document.querySelector(".winning-modal");
  const body = document.querySelector("body");
  const overlay = document.querySelector(".bg-overlay");

  boardFields.forEach((field) => {
    field.addEventListener("click", () => {
      if (!field.hasChildNodes()) {
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

  const toggleWinningModal = (symbol) => {
    const winningMessage = document.querySelector(".winning-message");

    winningMessage.innerHTML = "";

    if (symbol === "draw") {
      winningMessage.innerHTML = "It's a Draw!";
    } else {
      const node = document.createElement("i");

      node.classList.add(
        "fa-solid",
        `fa-${gameController.getCurrentPlayerSymbol().toLowerCase()}`,
        gameController.getCurrentPlayerSymbol() === "X"
          ? playerColors[0]
          : playerColors[1],
        "fa-sm",
        "mr-2"
      );

      winningMessage.appendChild(node);
      winningMessage.append(" Won!");
    }

    body.classList.toggle("overflow-y-hidden");
    modal.classList.toggle("hidden");
  };

  const handleModalButtons = () => {
    const backToMenuBtn = document.querySelector(".back-menu-btn");
    const nextRoundBtn = document.querySelector(".next-round-btn");

    backToMenuBtn.addEventListener("click", () => {
      console.log("BACK TO MENU");
    });

    nextRoundBtn.addEventListener("click", async () => {
      gameBoard.resetBoard();
      gameController.resetGameValues();
      resetFields();

      body.classList.add("overflow-y-hidden");
      modal.classList.add("slide-down");

      setTimeout(() => {
        toggleWinningModal();
        modal.classList.remove("slide-down");
        body.classList.remove("overflow-y-hidden");
      }, 800);
    });
  };

  const displayWinningRow = (fieldIndexes) => {
    if (fieldIndexes === "draw") {
      toggleOverlay();
      return;
    }

    let fields = [];
    fieldIndexes.forEach((index) => {
      fields.push(
        document.querySelector(`.board-field[data-position="${++index}"]`)
      );
    });

    fields.forEach((field) => {
      field.classList.remove("bg-gray-600");
      field.classList.add(
        gameController.getCurrentPlayerSymbol() === "X"
          ? playerColors[2]
          : playerColors[3],
        "transition-all",
        "duration-700"
      );

      field.firstElementChild.classList.remove(
        gameController.getCurrentPlayerSymbol() === "X"
          ? playerColors[0]
          : playerColors[1]
      );
      field.firstElementChild.classList.add(
        "text-gray-600",
        "transition-colors"
      );
    });

    toggleOverlay();
  };

  const resetFields = () => {
    boardFields.forEach((field) => {
      field.innerHTML = "";
      field.classList.add("bg-gray-600");
      field.classList.remove(
        playerColors[2],
        playerColors[3],
        "transition-colors",
        "duration-700"
      );
    });
  };

  const toggleOverlay = () => {
    overlay.classList.toggle("hidden");
  };

  handleModalButtons();

  return {
    toggleWinningModal,
    updateTurn,
    displayWinningRow,
    toggleOverlay,
  };
})();
