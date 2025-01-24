// Get references to DOM elements
const board = document.getElementById('board'); // Get the board elemnt
const cells = document.querySelectorAll('.cell'); // Select all elements with the class 'cell' (the individual cells)
const message = document.getElementById('message'); // Get the message element where the winner/tie message will be displayed
const resetButton = document.getElementById('reset'); // Get the reset button element

// Initialize game state
let currentPlayer = 'X'; // Player X always starts
let gameBoard = ['', '', '', '', '', '', '', '', '']; // 1D array to represent the game board, each cell is initially empty

// Game logic for checking if someone has won
const checkWinner = () => {
  // Define all possible winning patterns (combinations of cell indices)
  const winPatterns = [
    [0, 1, 2], // Top horizontal line
    [3, 4, 5], // Middle horizontal line
    [6, 7, 8], // Bottom horizontal line
    [0, 3, 6], // Left vertical line
    [1, 4, 7], // Center vertical line
    [2, 5, 8], // Right vertical line
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];

  // Loop through each winning pattern and check if all three positions are the same
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern; // Destructure the pattern into three indices
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      return gameBoard[a]; // If a winner is found, return the winner ('X' or 'O')
    }
  }

  // If no winner is found and there are still empty cells, the game is ongoing
  return gameBoard.includes('') ? null : 'T'; // Return 'T' if it's a tie, or null if the game is ongoing
};

// Function to handle player clicks on the cells
const handleClick = (e) => {
  const index = e.target.dataset.cell; // Get the index of the clicked cell from the data attribute

  // If the cell is already filled or the game is over, do nothing
  if (gameBoard[index] || message.textContent) {
    return; // Exit the function if the cell is filled or if a winner/tie message is displayed
  }

  // Update the board with the current player's move
  gameBoard[index] = currentPlayer; // Mark the cell on the game board with the current player's symbol
  e.target.textContent = currentPlayer; // Display the current player's symbol in the clicked cell

  // Check for a winner or tie after the move
  const winner = checkWinner(); // Call the checkWinner function to see if there is a winner or tie
  if (winner) {
    if (winner === 'T') {
      message.textContent = 'It\'s a Tie!'; // If it's a tie, display the tie message
    } else {
      message.textContent = `${winner} Wins!`; // Display the winner's message
    }
  } else {
    // If no winner or tie, switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Toggle the current player between 'X' and 'O'
  }
};

// Function to reset the game
const resetGame = () => {
  // Reset the game state
  gameBoard = ['', '', '', '', '', '', '', '', '']; // Clear the game board
  currentPlayer = 'X'; // Reset the starting player to 'X'
  message.textContent = ''; // Clear the winner/tie message
  cells.forEach(cell => {
    cell.textContent = ''; // Clear the content of each cell
  });
};

// Add click event listener to each cell
cells.forEach(cell => {
  cell.addEventListener('click', handleClick); // When a cell is clicked, call the handleClick function
});

// Event to reset the game when the reset button is clicked
resetButton.addEventListener('click', resetGame); // When the reset button is clicked, call the resetGame function
