function createPlayer(symbol){

  return {symbol}
}



// Object.setPrototypeOf(createPlayer,)

const game = {
  gameBoard: [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9
  ],

  score: {
    wins: 0,
    losses: 0,
    draws: 0
  },

  settings: {
    //empty
  },

  resetScore(){
    [this.score.wins,
    this.score.losses,
    this.score.draws] = [0,0,0];
  },

  displayBoard(){
    let row = '';
    for (let i = 0; i < this.gameBoard.length; i++ ) {
      row += `${this.gameBoard[i]} `
      if ((i+1)%3==0) {
        console.log((i+1)/3,row.trimEnd());
        row = '';
      }
    }
  },

  getPlayerMove(){
    const moves = this.gameBoard.filter(value => typeof value === 'number');
    this.displayBoard();
    console.log(moves); 
    while (true){
      let playerMove = +prompt(`Please pick from the following numbers: ${moves.join(', ')}`);
      if (this.validateMove(playerMove)) {
        console.log(playerMove);
        break;
      }
    }
    

  },

  validateMove(move){
    return this.gameBoard.includes(move);
  }
}

const domElement = (function(){

})
