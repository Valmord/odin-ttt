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

function createGameController(){
  const [player1, player2] = ['X', 'O']; // Player game icons
  const board = createGameBoard();
  let currentPlayer = player1;
  const stats = {
    currentRound: 0,
    score: {
      wins: 0,
      losses: 0,
      draws: 0
    },
  }


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

  const switchPlayers = () => currentPlayer = currentPlayer === player1 ? player2 : player1;

  const playRound = () => {
    board.printBoard();
    const playerMove = getPlayerMove();
    board.updateBoard(playerMove, currentPlayer);
    if (checkWinner(currentPlayer)){
      console.log(`Player ${currentPlayer} is the winner!`);
      board.printBoard();
      return true;
    } else {
      switchPlayers();
    }
  }

  return { playRound };
}

function main(){
  const game = createGameController();
  while(true){
    if(game.playRound()){
      break;
    }
  }
}


main();


// Object.setPrototypeOf(createPlayer,)

// const game = {
//   board: [
//     1, 2, 3,
//     4, 5, 6,
//     7, 8, 9
//   ],

//   score: {
//     wins: 0,
//     losses: 0,
//     draws: 0
//   },

//   stats: {
//     round: 0,
//     currentMoves: 0,
//     winner: '',
//   },

//   playGame(){
//     let running = true;
//     while(running){
//       this.displayBoard();
//       this.getPlayerMove();
//       running = !this.checkIfWinner();
//       this.getCompMove();
//       running = !this.checkIfWinner();
//     }
//   },

//   resetScore(){
//     [this.score.wins,
//     this.score.losses,
//     this.score.draws] = [0,0,0];
//   },

//   displayBoard(){
//     let row = '';
//     for (let i = 0; i < this.board.length; i++ ) {
//       row += `${this.board[i]} `
//       if ((i+1)%3==0) {
//         console.log((i+1)/3,row.trimEnd());
//         row = '';
//       }
//     }
//   },

//   validateMove(move){
//     return this.board.includes(move);
//   },

//   updateBoard(symbol, cell){
//     this.board[this.board.indexOf(cell)] = symbol;
//   },

//   getPossibleMoves(){
//     const moves = this.board.filter(value => typeof value === 'number');
//     return moves;
//   },

//   getPlayerMove(){
//     moves = this.getPossibleMoves();
//     console.log(moves); 
//     while (true){
//       let playerMove = +prompt(`Please pick from the following numbers: ${moves.join(', ')}`);
//       if (this.validateMove(playerMove)) {
//         this.updateBoard('X', playerMove);
//         break;
//       }
//     }
//   },

//   getCompMove(){
//     const compMove = Math.ceil(Math.random()*this.board.length);
//     console.log("comp move", compMove);
//     this.updateBoard('O', this.getPossibleMoves()[compMove]);
//   },

//   checkIfWinner(){
//     if (++this.stats.currentMoves < 5) return;
//     b = this.board;
//     symbols = ['X','O'];
//     for (let i = 0; i < 2; i++){
//       if (
//       [b[0], b[1], b[2]].every(value => value === symbols[i]) ||
//       [b[0], b[3], b[6]].every(value => value === symbols[i]) ||
//       [b[0], b[4], b[8]].every(value => value === symbols[i]) ||
//       [b[1], b[4], b[7]].every(value => value === symbols[i]) ||
//       [b[2], b[5], b[8]].every(value => value === symbols[i]) ||
//       [b[2], b[4], b[6]].every(value => value === symbols[i]) ||
//       [b[3], b[4], b[5]].every(value => value === symbols[i]) ||
//       [b[6], b[7], b[8]].every(value => value === symbols[i])
//       ){
//         console.log(b);
//         this.stats.winner = symbols[i];
//         console.log(`Player ${this.stats.winner} wins!`);
//     }
//     }
//     return this.stats.winner;
//   },

//   // checkIfWinnerTest(){
//   //   b = this.board;
//   //   symbols = ['X','O'];
//   //   for (let i = 0; i < 2; i++){
//   //     console.log([b[0], b[1], b[2]].every(value => value === symbols[i]));
//   //     console.log([b[0], b[3], b[6]].every(value => value === symbols[i]));
//   //     console.log([b[0], b[4], b[8]].every(value => value === symbols[i]));
//   //     console.log([b[1], b[4], b[7]].every(value => value === symbols[i]));
//   //     console.log([b[2], b[5], b[8]].every(value => value === symbols[i]));
//   //     console.log([b[2], b[4], b[6]].every(value => value === symbols[i]));
//   //     console.log([b[3], b[4], b[5]].every(value => value === symbols[i]));
//   //     console.log([b[6], b[7], b[8]].every(value => value === symbols[i]));   
//   //   }
//   // }

// }


// const domElement = (function(){

// })
