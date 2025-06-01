const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const board = document.getElementById('board');
const winLine = document.getElementById('win-line');
const themeToggle = document.getElementById('theme-toggle');

const moveSound = document.getElementById('move-sound');
const winSound = document.getElementById('win-sound');
const drawSound = document.getElementById('draw-sound');

let playerTurn = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let running = true;

let playerScore = 0, aiScore = 0, drawScore = 0;

const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const drawScoreEl = document.getElementById('draw-score');

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!running || boardState[index] !== '') return;

  makeMove(index, 'X');
  moveSound.play();

  if (checkWinner('X')) {
    playerScore++;
    playerScoreEl.textContent = playerScore;
    return endGame('You Win!');
  } else if (boardState.every(cell => cell !== '')) {
    drawScore++;
    drawScoreEl.textContent = drawScore;
    drawSound.play();
    return endGame("It's a Draw!");
  }

  setTimeout(() => {
    const empty = boardState.map((v, i) => v === '' ? i : null).filter(i => i !== null);
    if (!empty.length) return;
    const aiIndex = empty[Math.floor(Math.random() * empty.length)];
    makeMove(aiIndex, 'O');
    moveSound.play();

    if (checkWinner('O')) {
      aiScore++;
      aiScoreEl.textContent = aiScore;
      return endGame('AI Wins!');
    } else if (boardState.every(cell => cell !== '')) {
      drawScore++;
      drawScoreEl.textContent = drawScore;
      drawSound.play();
      return endGame("It's a Draw!");
    }
  }, 500);
}

function makeMove(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;
}

function checkWinner(player) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
      winLine.style.transform = getWinLineTransform(a, b, c);
      winLine.style.scale = '1';
      cells[a].classList.add('winner');
      cells[b].classList.add('winner');
      cells[c].classList.add('winner');
      winSound.play();
      return true;
    }
  }
  return false;
}

function getWinLineTransform(a, b, c) {
  const positions = {
    '0,1,2': 'translateY(0px)',
    '3,4,5': 'translateY(105px)',
    '6,7,8': 'translateY(210px)',
    '0,3,6': 'rotate(90deg) translateY(-150px)',
    '1,4,7': 'rotate(90deg) translateY(-45px)',
    '2,5,8': 'rotate(90deg) translateY(60px)',
    '0,4,8': 'rotate(45deg)',
    '2,4,6': 'rotate(-45deg)'
  };
  return positions[[a, b, c].toString()] || 'none';
}

function endGame(message) {
  running = false;
  statusText.textContent = message;

  const overlay = document.createElement('div');
  overlay.className = 'victory-message';
  overlay.innerHTML = `
    <div>${message}</div>
    <button id="play-again">Play Again</button>
  `;

  document.body.appendChild(overlay);

  document.getElementById('play-again').addEventListener('click', () => {
    overlay.remove();
    resetGame();
  });
}

function resetGame() {
  boardState = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winner');
  });
  winLine.style.scale = '0';
  statusText.textContent = "Your Turn (X)";
  running = true;
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
themeToggle.addEventListener('click', toggleTheme);

resetGame();
