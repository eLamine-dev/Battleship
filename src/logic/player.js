export default class Player {
   constructor(type) {
      this.type = type;
   }

   attack(board, x, y) {
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
      const keys = Array.from(board.squares.keys());
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const randomSquare = nonAttackedSquares.get(randomKey);
      board.receiveAttack(randomSquare.x, randomSquare.y);
   }
}
