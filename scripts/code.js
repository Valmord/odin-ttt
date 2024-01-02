const domElements = {
  startupModal: document.querySelector('.modal-startup'),
  modalPvp: document.querySelector('.pvp'),
  modalPvm: document.querySelector('.pvm'),
  gameBoard: document.querySelector('.board-container'),
  headerTurn: document.querySelector('body>header>p'),
  scoreElement: document.querySelector('.score'),
  resetButton: document.querySelector('.reset-button'),
}

function createGameBoard(){
  const [rows, columns] = [3, 3];
  let gameBoard = [];

  const setupBoard = () => {
    gameBoard = [];
    for (let i = 0; i < rows; i++) {
      gameBoard[i] = [];
      for (let j = 0; j < columns; j++){
        gameBoard[i].push('');
      }
    }
  }
  setupBoard();


  const updateBoard = (row, col, icon) => {
    console.log(row, col, icon);
    gameBoard[row][col] = icon;
  }

  const getGameBoard = () => gameBoard;

  const printBoard = () => {
    gameBoard.forEach( (row, index) => {
      console.log(`${index}: ${row.join(' ')}`);
    })
  }

  return {getGameBoard, updateBoard, setupBoard}
}

function createPlayer(icon){
  return {
    icon,
    score: {
      wins: 0,
      losses: 0,
      draws: 0
    }
  }
}

function createGameController(){
  const board = createGameBoard();
  const player1 = createPlayer('X');
  const player2 = createPlayer('O');
  let winner = '';
  let currentPlayer = player1.icon;
  let currentRound = 1;


  const checkIfSame = function(playerIcon){
    return function(currentCellValue){
      return currentCellValue === playerIcon
    }
  }

  const checkIfWinner = player => {
    const checkPlayer = checkIfSame(player);
    const bd = board.getGameBoard();
    switch (true) {
      case bd[0].every(checkPlayer):
        break;
      case bd[1].every(checkPlayer):
        break;
      case bd[2].every(checkPlayer):
        break;
      case [bd[0][0],bd[1][0],bd[2][0]].every(checkPlayer):
        break;
      case [bd[0][1],bd[1][1],bd[2][1]].every(checkPlayer):
        break;
      case [bd[0][2],bd[1][2],bd[2][2]].every(checkPlayer):
        break;
      case [bd[0][0],bd[1][1],bd[2][2]].every(checkPlayer):
        break;
      case [bd[0][2],bd[1][1],bd[2][0]].every(checkPlayer):
        break;
      default:
        return;
    }
    return true;
  }

  const updatePlayerScores = (playerIcon) => {
    switch (playerIcon) {
      case 'X':
        player1.score.wins++;
        player2.score.losses++;
        winner = 'X';
        break;
      case 'O':
        player1.score.losses++;
        player2.score.wins++;
        winner = 'O';
        break;
      default:
        player1.score.draws++;
        player2.score.draws++;
        winner = 'draw';
    }
  }

  const getWinnerAndScore = () => {
    const scoreString = 
    `Player 1 score: ${player1.score.wins}w, ${player1.score.losses}l, ${player1.score.draws}d ` + 
    `Player 2 score: ${player2.score.wins}w, ${player2.score.losses}l, ${player2.score.draws}d`;
    return winner === 'draw' ? 'Draw! ' + scoreString : `${winner} wins! ` + scoreString;
  }

  const getIfWinner = () => winner;

  const getCurrentTurn = () => currentPlayer;

  const switchPlayers = () => currentPlayer = currentPlayer === player1.icon ? player2.icon : player1.icon;

  const checkValidMove = (row, col) => {
    const bd = board.getGameBoard();  
    console.log(bd);
    if (bd[row][col] === '') {
      return true;
    } else false;
  }

  const playRound = (row, col) => {
    console.log(currentPlayer); 
    board.updateBoard(row, col, currentPlayer);
    currentRound++;
    if (currentRound >= 5 && checkIfWinner(currentPlayer)){
      updatePlayerScores(currentPlayer);
    } else if (currentRound > 9) {
      updatePlayerScores('draw');
    } else {
      switchPlayers();
    }
  }

  const resetGame = () => {
    [player1.score.draws, player1.score.losses, player1.score.wins] = [0,0,0];
    [player2.score.draws, player2.score.losses, player2.score.wins] = [0,0,0];
    winner = '';
    currentRound = 1;
    board.setupBoard();
  }

  const playAgain = () => {

  }

  return { playRound, getGameBoard: board.getGameBoard, getCurrentTurn, checkValidMove, getIfWinner, getWinnerAndScore, playAgain, resetGame};
}

function createDisplayController(){
  const game = createGameController();

  const updateGameDisplay = () => {
    displayBoardGrid();
    addCellListeners();
    displayCurrentTurn();
    domElements.scoreElement.textContent = '';
    if (game.getIfWinner()) {
      domElements.scoreElement.textContent = game.getWinnerAndScore();
    }
  }

  const displayBoardGrid = () => {
      const board = game.getGameBoard();
      domElements.gameBoard.textContent = '';
      for(i = 0; i < board.length; i++){
        for (j = 0; j < board.length; j++){
          let gridCell = document.createElement('div');
          gridCell.classList.add('board-cell')
          gridCell.dataset.row = i;
          gridCell.dataset.column = j;
          gridCell.textContent += board[i][j]; 
          domElements.gameBoard.appendChild(gridCell);
        }
      }
  }

  const displayCurrentTurn = () => {
    const turnText = `It's currently ${game.getCurrentTurn()}'s turn`;
    domElements.headerTurn.textContent = turnText;
  }

  const addCellListeners = () => {
    const cells = document.querySelectorAll('.board-cell');
    cells.forEach( cell => {
      cell.addEventListener('click', event => {
        const [row, col] = [cell.dataset.row, cell.dataset.column];
        if (game.getIfWinner() || !game.checkValidMove(row,col)){
          event.preventDefault();
          cell.classList.add('prevent-click');
          setTimeout( () => {
            cell.classList.remove('prevent-click');
          },1000)
        } else {
            game.playRound(row,col);
            updateGameDisplay();
        }
      });
    })
  }

  const init = () => {
    updateGameDisplay();
    const dom = domElements;
    dom.startupModal.style.display = 'static';

    dom.resetButton.addEventListener('click', () => {
      game.resetGame();
      updateGameDisplay();

    });

    dom.modalPvp.addEventListener('click', () => {
        dom.startupModal.style.display = 'none';
        dom.gameBoard.style.display = 'grid';
      })
    }

  return { init };

}
createDisplayController().init();