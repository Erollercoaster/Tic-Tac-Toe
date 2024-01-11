const board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

const playerContainer = document.querySelector('.player-container');
const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('#reset-button');
const prevButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const moveHistoryContainer = document.querySelector('#move-history-container');
const moveHistoryList = document.querySelector('#move-history-list');

let currentPlayer = 'X';
let gameWon = false;
let currentMoveIndex = 0;
let moveHistory = [];
let undoneMoves = []; 

window.addEventListener('beforeunload', function () {
   localStorage.clear();
});

document.addEventListener('DOMContentLoaded', function () {
  const playerSelectionModal = document.querySelector('#player-selection-modal');
  const playerXButton = document.querySelector('#player-x-button');
  const playerOButton = document.querySelector('#player-o-button');
  playerSelectionModal.style.display = 'block';

  playerXButton.addEventListener('click', () => {
    initializeGame('X');
    playerSelectionModal.style.display = 'none';
  });

  playerOButton.addEventListener('click', () => {
    initializeGame('O');
    playerSelectionModal.style.display = 'none';
  });
});

function initializeGame(startingPlayer) {
  if (startingPlayer === 'X' || startingPlayer === 'O') {
    gameWon = false;
    currentMoveIndex = 0;
    moveHistory = [];
    undoneMoves = [];
    clearBoard();
    currentPlayer = startingPlayer;
    playerContainer.textContent = `Player ${currentPlayer}'s turn`;
  } else {

  }
}

function displayPlayerSelectionModal() {
  const playerSelectionModal = document.querySelector('#player-selection-modal');
  playerSelectionModal.style.display = 'block';
}


function handleCellClick(e) {
  const cell = e.target;
  const row = cell.parentElement.dataset.row - 1;
  const col = cell.dataset.col - 1;

  if (!gameWon && board[row][col] === '') {
    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    const moveItem = document.createElement('li');
    moveItem.textContent = `Player ${currentPlayer} - Row ${row + 1}, Column ${col + 1}`;
    moveHistoryList.appendChild(moveItem);


    moveHistoryContainer.scrollTop = moveHistoryContainer.scrollHeight;


    moveHistory.push({
      player: currentPlayer,
      row,
      col
    });

    undoneMoves = [];

    updateLocalStorage();

    if (checkWin(currentPlayer)) {
      playerContainer.textContent = `Player ${currentPlayer} wins!`;
      gameWon = true;
      prevButton.style.display = 'block';
      nextButton.style.display = 'block';
      const trophyIcon = document.createElement('i');
      trophyIcon.className = 'nes-icon trophy is-medium';

      playerContainer.appendChild(trophyIcon);
      updateButtons();
    } else if (checkDraw()) {
      playerContainer.textContent = "It's a draw!";
      gameWon = true;
      prevButton.style.display = 'block';
      nextButton.style.display = 'block';
      updateButtons();
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      playerContainer.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

for (const cell of cells) {
  cell.addEventListener('click', handleCellClick);
}

function checkWin(player) {
  for (let i = 0; i < 3; i++) {
    if (
      (board[i][0] === player && board[i][1] === player && board[i][2] === player) ||
      (board[0][i] === player && board[1][i] === player && board[2][i] === player)
    ) {
      return true;
    }
      }
    if (
      (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
      (board[0][2] === player && board[1][1] === player && board[2][0] === player)
    ) {
     return true;
    }
    return false;
}

function checkDraw() {
  return board.flat().every(cell => cell !== '');
}


// PHASE 2

function updateLocalStorage() {
  localStorage.setItem('moveHistory', JSON.stringify(moveHistory));
  localStorage.setItem('undoneMoves', JSON.stringify(undoneMoves));
}

function undoMove() {
  if (moveHistory.length > 0) {
    const lastMove = moveHistory.pop();
    undoneMoves.push(lastMove);

    const { row, col } = lastMove;

    board[row][col] = '';
    const cell = cells[row * 3 + col];
    cell.textContent = '';
    cell.classList.remove('X', 'O');

    updateButtons();
    updateLocalStorage();
  }
}

function redoMove() {
  if (undoneMoves.length > 0) {
    const nextMove = undoneMoves.pop();
    moveHistory.push(nextMove);

    const { row, col } = nextMove;

    board[row][col] = nextMove.player;
    const cell = cells[row * 3 + col];
    cell.textContent = nextMove.player;
    cell.classList.add(nextMove.player);

    updateButtons();
    updateLocalStorage();
  }
}

function clearBoard() {
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
    cell.addEventListener('click', handleCellClick);
  });
}

function updateButtons() {
if (undoneMoves.length === 0) {
    nextButton.classList.add('is-disabled');
    prevButton.classList.remove('is-disabled');
  } else if (moveHistory.length === 0){
    nextButton.classList.remove('is-disabled');
    prevButton.classList.add('is-disabled');
  }
}


prevButton.addEventListener('click', undoMove);
nextButton.addEventListener('click', redoMove);

resetButton.addEventListener('click', () => {
  displayPlayerSelectionModal();
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[row][col] = '';
    }
  }

  localStorage.clear();
  clearBoard();
  moveHistory = [];
  moveHistoryList.innerHTML = '';
  updateButtons();
  currentPlayer = 'X';
  gameWon = false;
  currentMoveIndex = 0;
  playerContainer.textContent = `Player X's turn`;
  prevButton.style.display = 'none';
  nextButton.style.display = 'none';
});





