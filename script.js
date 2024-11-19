// Gameboard Module
const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board.fill("");
    };

    return { getBoard, setCell, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller Module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = true;

    const startGame = (player1Name, player2Name) => {
        if (players.length === 2) {
            players[0].name = player1Name;
            players[1].name = player2Name;
        } else {
            players = [
                Player(player1Name, "X"),
                Player(player2Name, "O")
            ];
        }

        Gameboard.resetBoard();
        currentPlayerIndex = 0;
        gameActive = true;
        DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn`);
        DisplayController.render();
    };

    const playTurn = (index) => {
        if (!gameActive || !Gameboard.setCell(index, players[currentPlayerIndex].marker)) {
            return;
        }
        DisplayController.render();

        if (checkWin()) {
            gameActive = false;
            DisplayController.updateMessage(`${players[currentPlayerIndex].name} wins!`);
        } else if (checkTie()) {
            gameActive = false;
            DisplayController.updateMessage("It's a tie!");
        } else {
            currentPlayerIndex = 1 - currentPlayerIndex;
            DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn`);
        }
    };

    const checkWin = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern =>
            pattern.every(index => Gameboard.getBoard()[index] === players[currentPlayerIndex].marker)
        );
    };

    const checkTie = () => Gameboard.getBoard().every(cell => cell !== "");

    const getPlayerNames = () => players.map(player => player.name);

    return { startGame, playTurn, getPlayerNames };
})();

// Display Controller Module
const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const messageDiv = document.getElementById("message");

    const render = () => {
        gameboardDiv.innerHTML = '';
        Gameboard.getBoard().forEach((marker, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = marker;
            cell.addEventListener("click", () => GameController.playTurn(index));
            gameboardDiv.appendChild(cell);
        });
    };

    const updateMessage = (message) => {
        messageDiv.textContent = message;
    };

    const setupEventListeners = () => {
        document.getElementById("start").addEventListener("click", () => {
            const player1 = document.getElementById("player1").value || "Player 1";
            const player2 = document.getElementById("player2").value || "Player 2";
            GameController.startGame(player1, player2);
        });

        document.getElementById("restart").addEventListener("click", () => {
            const [player1, player2] = GameController.getPlayerNames();
            GameController.startGame(player1 || "Player 1", player2 || "Player 2");
        });
    };

    return { render, updateMessage, setupEventListeners };
})();

// Initialize event listeners
DisplayController.setupEventListeners();

  