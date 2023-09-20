export default class Player {
   constructor(type) {
      this.type = type;
   }

   play(board, x, y) {
      if (this.type === 'computer') {
         this.computerAttack(board);
      } else {
         this.humanAttack(board, x, y);
      }
   }

   humanAttack(board, x, y) {
      board.receiveAttack(x, y);
   }

   computerAttack(board) {
      const nonAttackedSquares = board.getNonAttackedSquares();
      let keys = Array.from(board.board.keys());
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const randomSquare = nonAttackedSquares.get(randomKey);
      board.receiveAttack(randomSquare.x, randomSquare.y);
   }
}
