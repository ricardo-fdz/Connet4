const canvas = document.querySelector('#tablero');
const score1 = document.querySelector('#p1');
const score2 = document.querySelector('#p2');

const ctx = canvas.getContext("2d");

let offsetX = 0;
let offsetY = 0;
let currentPlayer = 1;

const board = {
  height: 7,
  width: 6,
  backColor: 'blue',
  player1Color: 'red',
  player2Color: 'yellow'
}

let squares = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 0, 2, 1, 0],
  [1, 2, 2, 2, 1, 0]
]

canvas.addEventListener('mousemove', (e) => {
  drawBoard();
  let x = 0;
  if (e.offsetX < 0 || e.offsetY < 0 || e.offsetX > 239 || e.offsetY > 39) return;
  if (e.offsetX > 0 && e.offsetX < 40) x = 0;
  if (e.offsetX > 40 && e.offsetX < 80) x = 40;
  if (e.offsetX > 80 && e.offsetX < 120) x = 80;
  if (e.offsetX > 120 && e.offsetX < 160) x = 120;
  if (e.offsetX > 160 && e.offsetX < 200) x = 160;
  if (e.offsetX > 200 && e.offsetX < 240) x = 200;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
  ctx.fillStyle = currentPlayer === 1 ? board.player1Color : board.player2Color;
  ctx.fillRect(x, 0, 40, 40);
})

const dropToken = (e) => {
  let i = 0;
  if (offsetX < 0 || offsetY < 0 || offsetX > 239 || offsetY > 39) return;
  if (offsetX > 0 && offsetX < 40) i = 1;
  if (offsetX > 40 && offsetX < 80) i = 2;
  if (offsetX > 80 && offsetX < 120) i = 3;
  if (offsetX > 120 && offsetX < 160) i = 4;
  if (offsetX > 160 && offsetX < 200) i = 5;
  if (offsetX > 200 && offsetX < 240) i = 6;
  for (let j = 0; j < squares.length; j++) {
    if (squares[j][i - 1] !== 0) {
      if (j - 1 === -1) break;
      squares[j - 1][i - 1] = currentPlayer;
      drawBoard();
      checkConnect(j - 1, i - 1)
      break;
    };
    if (j === 6) {
      squares[j][i - 1] = currentPlayer;
      drawBoard();
      checkConnect(j, i - 1)
      break;
    };
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}


const drawBoard = () => {
  const x = 0;
  const y = 40;
  ctx.fillStyle = 'rgb(158, 159, 158)';
  ctx.fillRect(0, 0, 240, 38);
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = board.backColor;
      ctx.strokeRect(x + ((j) * 40), y + ((i) * 40), 40, 40);
      if (squares[i][j] === 1) {
        ctx.fillStyle = board.player1Color;
        ctx.fillRect(x + ((j) * 40), y + ((i) * 40), 40, 40);
      }
      if (squares[i][j] === 2) {
        ctx.fillStyle = board.player2Color;
        ctx.fillRect(x + ((j) * 40), y + ((i) * 40), 40, 40);
      }
    }
  }
}

const checkConnect = (y, x) => {
  const conditionWin = currentPlayer === 1 ? '1111' : '2222';
  if (
    squares[y].join('').includes(conditionWin) ||
    getVertical(x).includes(conditionWin) ||
    getDiagonal1(y, x).includes(conditionWin) ||
    getDiagonal2(y, x).includes(conditionWin)
  ) {
    const score = currentPlayer === 1 ? score1 : score2;
    score.innerText = parseInt(score.innerText) + 1;
    drawBoard();
    setTimeout(() => {
      alert(`${currentPlayer === 1 ? 'Yellow' : 'Red'} Wins!!!`)
      newGame();
    }, 200)
  }
};

const newGame = () => {
  squares = squares.map(square => square.fill(0));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
}

const getDiagonal1 = (i, j) => {
  let diagonalDawn = [];
  let diagonalUp = [];
  let [y, x] = [i, j];
  while (x > 0 && y < 6) {
    y = y + 1;
    x = x - 1
    diagonalDawn.push(squares[y][x]);
  }
  [y, x] = [i, j];
  while (x < 5 && y > 0) {
    y = y - 1;
    x = x + 1
    diagonalUp.push(squares[y][x]);
  }
  return [...diagonalDawn.reverse(), squares[i][j], ...diagonalUp].join('');
}

const getDiagonal2 = (i, j) => {
  let diagonalDawn = [];
  let diagonalUp = [];
  let [y, x] = [i, j];
  while (x < 5 && y < 6) {
    y = y + 1;
    x = x + 1
    diagonalDawn.push(squares[y][x]);
  }
  [y, x] = [i, j];
  while (x > 0 && y > 0) {
    y = y - 1;
    x = x - 1
    diagonalUp.push(squares[y][x]);
  }
  return [...diagonalDawn.reverse(), squares[i][j], ...diagonalUp].join('');
}

const getVertical = (j) => {
  let line = [];
  for (let i = 0; i < squares.length; i++) {
    line.push(squares[i][j]);
  }
  return line.join('');
}

document.querySelector('#newGame').addEventListener('click', () => { newGame(); })
document.querySelector('#newScore').addEventListener('click', () => {
  score1.innerText = 0;
  score2.innerText = 0;
})
canvas.addEventListener('click', () => { dropToken() });

newGame();
