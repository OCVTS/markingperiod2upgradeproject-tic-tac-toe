const cells = document.querySelectorAll('.cell');
const message = document.querySelector('#message');
const resetButton = document.querySelector('#reset');
const player = 'X';
const ai = 'O';
let currentPlayer = player;
let gameActive = true;

// Function to check if there's a winner
function checkWinner(boardState, player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some(combination =>
    combination.every(index => boardState[index] === player)
  );
}

// Minimax: Evaluate the best move for the AI
function minimax(boardState, depth, isMaximizing) {
  const availableCells = boardState.filter(cell => cell === '');

  // If AI wins
  if (checkWinner(boardState, ai)) return 10 - depth;
  // If player wins
  if (checkWinner(boardState, player)) return depth - 10;
  // If no moves left, it's a draw
  if (availableCells.length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    boardState.forEach((cell, index) => {
      if (cell === '') {
        boardState[index] = ai; // AI's move
        const score = minimax(boardState, depth + 1, false);
        boardState[index] = ''; // Undo move
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    boardState.forEach((cell, index) => {
      if (cell === '') {
        boardState[index] = player; // Player's move
        const score = minimax(boardState, depth + 1, true);
        boardState[index] = ''; // Undo move
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

// Finds the best move for the AI
function findBestMove() {
  const boardState = Array.from(cells).map(cell => cell.textContent || '');
  let bestMove = -1;
  let bestScore = -Infinity;

  // Try each available move for AI and select the best one
  boardState.forEach((cell, index) => {
    if (cell === '') {
      boardState[index] = ai;
      const score = minimax(boardState, 0, false);
      boardState[index] = ''; // Undo move
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  });

  return bestMove;
}

// Handles the player's move
function playerMove(event) {
  const index = Array.from(cells).indexOf(event.target);
  if (cells[index].textContent === '' && gameActive && currentPlayer === player) {
    cells[index].textContent = player;
    checkGameStatus();
    if (gameActive) aiMove();
  }
}

// Handles the AI's move
function aiMove() {
  if (!gameActive) return;

  const bestMove = findBestMove();
  cells[bestMove].textContent = ai;
  checkGameStatus();
}

// Checks the game status (win or draw)
function checkGameStatus() {
  const boardState = Array.from(cells).map(cell => cell.textContent || '');
  if (checkWinner(boardState, player)) {
    message.textContent = 'You Win!';
    gameActive = false;
  } else if (checkWinner(boardState, ai)) {
    message.textContent = 'AI Wins!';
    gameActive = false;
  } else if (boardState.every(cell => cell !== '')) {
    message.textContent = "It's a Draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === player ? ai : player;
  }
}

// Resets the game
function resetGame() {
  cells.forEach(cell => cell.textContent = '');
  message.textContent = '';
  gameActive = true;
  currentPlayer = player;
}

// Adding event listeners
cells.forEach(cell => cell.addEventListener('click', playerMove));
resetButton.addEventListener('click', resetGame);
