const domElements = {
  startupModal: document.querySelector('.modal-startup'),
  modalPvp: document.querySelector('.pvp'),
  modalPvm: document.querySelector('.pvm'),
  gameBoard: document.querySelector('.board-container'),
  headerTurn: document.querySelector('body>header>p'),
  winnerElement: document.querySelector('.winner'),
  scoreTableElement: document.querySelector('.score-table'),
  scoreContainer: document.querySelector('.score-container'),
  resetButton: document.querySelector('.reset-button'),
  playAgainButton: document.querySelector('.play-again-button'),
  buttonContainer: document.querySelector('.btn-container'),
  changeModeButton: document.querySelector('.change-mode'),
  aiDifficultyButton: document.querySelector('.ai-difficulty'),
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
  let aiDifficult = 0;
  let winner = '';
  let currentPlayer = player1.icon;
  let currentRound = 1;


  const checkIfSame = function(playerIcon){
    return function(currentCellValue){
      return currentCellValue === playerIcon
    }
  }

  const checkIfWinner = (player) => {
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
    const scoreArr = ['', player1.score, player2.score ];
      if (winner === 'draw') {
        scoreArr[0] = 'Draw!';
      } else {
        scoreArr[0] = `${winner} wins!`
      }
      return scoreArr;
  }

  const getIfWinner = () => winner;

  const getCurrentTurn = () => currentPlayer;

  const switchPlayers = () => currentPlayer = currentPlayer === player1.icon ? player2.icon : player1.icon;

  const checkValidMove = (row, col) => {
    const bd = board.getGameBoard();  
    if (bd[row][col] === '') {
      return true;
    } else false;
  }

  // const setAiDifficulty = difficult => aiDifficult = difficult;

  // const getBestAIMove = () => {
  //   const bestPlay = minimax(board.getGameBoard(),'O');
  // }

  // const minimax = (currentBoardState, currentIcon) => {
  //   const availCellsIndexes = getEmptyCells(currentBoardState);
  //   if (checkIfWinner('X', currentBoardState)) {
  //     return { score: -1 };
  //   } else if (checkIfWinner(currentBoardState, 'O')) {
  //     return { score: 1 };
  //   } else if (availCellsIndexes.length === 0) {
  //     return { score: 0 };
  //   }

  // }

  // const getEmptyCells = bd => {
  //   bd = bd || board.getGameBoard();
  //   const boardArr = [bd.flat()];
  //   const filteredBoard = boardArr.filter( (value, index) => {
  //     if (value === '') return index;
  //   })
  // }


  const getAIMove = () => {
    if (!aiDifficult) {
      while(true){
        let aiMove = Math.floor(Math.random()*9);
        let row = Math.floor(aiMove / 3);
        let col = aiMove % 3;
        if (checkValidMove(row, col)) {
          playRound(row, col, 'pvm');
          return;
        }
      }
    }
    // } else {
    //   const [row, col] = getBestAIMove();
    //   playRound(row, col, "pvm");
    // }

  }

  const playRound = (row, col, mode) => {
    board.updateBoard(row, col, currentPlayer);
    currentRound++;
    if (currentRound >= 5 && checkIfWinner(currentPlayer)){
      updatePlayerScores(currentPlayer);
      return;
    } else if (currentRound > 9) {
      updatePlayerScores('draw');
      return;
    }
    switchPlayers();
    if (mode === 'pvm' && currentPlayer === 'O') {
      getAIMove();
    }
    
  }

  const resetGame = () => {
    [player1.score.draws, player1.score.losses, player1.score.wins] = [0,0,0];
    [player2.score.draws, player2.score.losses, player2.score.wins] = [0,0,0];
    playAgain();
  }

  const playAgain = () => {
    winner = '';
    currentPlayer = 'X';
    currentRound = 1;
    board.setupBoard();
  }

  return { playRound, getGameBoard: board.getGameBoard, getCurrentTurn, checkValidMove, getIfWinner, 
    getWinnerAndScore, playAgain, resetGame, getAIMove};
}

function createDisplayController(){
  const game = createGameController();
  let gameMode = 'pvp';

  const updateGameDisplay = () => {
    displayBoardGrid();
    addCellListeners();
    displayCurrentTurn();
    displayWinnerAndScore();
  }

  const displayWinnerAndScore = () => {
    domElements.scoreContainer.style.display = 'none';

    if (game.getIfWinner()) {
      domElements.scoreContainer.style.display = 'flex';
      const scoreArray = game.getWinnerAndScore();
      domElements.winnerElement.textContent = scoreArray[0];
      domElements.scoreTableElement.innerHTML =
      `<tr>
      <th> </th>
      <th>Wins</th>
      <th>Losses</th>
      <th>Draws</th>
    </tr>`
      for (let i = 1; i < scoreArray.length; i++) { 
        const rowElement = document.createElement('tr');
        const rowHeader = document.createElement('th');
        rowHeader.textContent = `Player ${i}`;
        rowElement.appendChild(rowHeader);
        for (let prop in scoreArray[i]){
          const dataElement = document.createElement('td');
          dataElement.textContent = scoreArray[i][prop];
          rowElement.appendChild(dataElement);
        }
        domElements.scoreTableElement.appendChild(rowElement);
      }
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
            game.playRound(row,col,gameMode);
            updateGameDisplay();
        }
      });
    })
  }

  const init = () => {
    updateGameDisplay();
    const dom = domElements;  

    dom.aiDifficultyButton.addEventListener('click', function(){
      if (this.textContent === "Random AI Mode"){
        this.textContent = "Impossible Mode";
        game.setAiDifficulty(9999);
      } else {
        this.textContent = "Random AI Mode";
        game.setAiDifficulty(0);
      }
    })

    dom.resetButton.addEventListener('click', () => {
      game.resetGame();
      updateGameDisplay();
    });

    dom.modalPvp.addEventListener('click', () => {
        dom.startupModal.style.display = 'none';
        dom.gameBoard.style.display = 'grid';
        dom.buttonContainer.style.display = 'flex';
        dom.headerTurn.style.display = 'block';
      })

      dom.modalPvm.addEventListener('click', () => {
        dom.startupModal.style.display = 'none';
        dom.gameBoard.style.display = 'grid';
        dom.buttonContainer.style.display = 'flex';
        dom.headerTurn.style.display = 'block';
        gameMode = 'pvm';
        dom.aiDifficultyButton.classList.toggle('button-hidden');
      })
    
      dom.playAgainButton.addEventListener('click', () => {
        game.playAgain();
        updateGameDisplay();
      })

      dom.changeModeButton.addEventListener('click', () => {
        gameMode = gameMode === 'pvp' ? 'pvm' : 'pvp';
        // dom.aiDifficultyButton.classList.toggle('button-hidden');
        if (gameMode === 'pvm' && game.getCurrentTurn() === 'O') {
          game.getAIMove();
          updateGameDisplay();
        }
      })
    }

  return { init };

}
createDisplayController().init();