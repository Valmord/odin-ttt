function createGameBoard(){
  const [ROWS, COLUMNS] = [3, 3];
  const board = [];

  // Create Board
  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLUMNS; j++){
      board[i].push('_');
    }
  }

  const updateBoard = (playerMove, player) => {
    playerMove -= 1;
    console.log(playerMove, player);
    const row = Math.floor(playerMove/3);
    const col = playerMove % 3;
    console.log(row, col);
    board[row][col] = player;
  }

  const getGameBoard = () => board;

  const printBoard = () => {
    board.forEach( (row, index) => {
      console.log(`${index}: ${row.join(' ')}`);
    })
  }



  return {getGameBoard, printBoard, updateBoard}
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
  let currentPlayer = player1.icon;
  let currentRound = 0;

  const checkIfSame = function(playerIcon){
    return function(currentCellValue){
      return currentCellValue === playerIcon
    }
  }

  const checkWinner = player => {
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
        break;
      case 'O':
        player1.score.losses++;
        player2.score.wins++;
        break;
      default:
        player1.score.draws++;
        player2.score.draws++;
    }
  }

  const displayScore = () => {
    console.log(
`player1: ${player1.score.wins}w, ${player1.score.losses}l, ${player1.score.draws}d
player2: ${player2.score.wins}w, ${player2.score.losses}l, ${player2.score.draws}d`)
  }

  const validatePlayerMove = (playerMove) => {
    playerMove -= 1; 
    const row = Math.floor(playerMove/3);
    const col = playerMove % 3;
    return board.getGameBoard()[row][col] === '_'
  }

  const getPlayerMove = () => {
    while (true) {
      let playerMove = prompt('Please type 1-9');
      if (playerMove.toLowerCase() === 'q') {
        return;
      }
      if (+playerMove > 0 && +playerMove <= 9 && validatePlayerMove(+playerMove)) {
        return +playerMove;
      }
    }
  }

  const switchPlayers = () => currentPlayer = currentPlayer === player1.icon ? player2.icon : player1.icon;

  const playRound = () => {
    board.printBoard();
    const playerMove = getPlayerMove();
    board.updateBoard(playerMove, currentPlayer);
    currentRound++;
    if (currentRound >= 5 && checkWinner(currentPlayer)){
      console.log(`Player ${currentPlayer} is the winner!`);
      board.printBoard();
      updatePlayerScores(currentPlayer);
      return true;
    } else if (currentRound === 9) {
      console.log(`Player ${currentPlayer} is the winner!`);
      updatePlayerScores('draw');
    } else {
      switchPlayers();
    }
  }

  return { playRound, displayScore };
}

const player1 = createPlayer('X');
const player2 = createPlayer('O');

function main(){
  const game = createGameController();
  while(true){
    if(game.playRound()){
      game.displayScore();
      break;
    }
  }
}

main();