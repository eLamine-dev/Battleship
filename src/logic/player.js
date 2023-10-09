export default class Player {
   constructor(type, captain, strategist) {
      this.type = type;
      this.captainName = captain;
      this.strategistName = strategist;
      this.computerHitAdjacentSquares = [];
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
      let targetSquare;
      const nonAttackedSquares = board.getNonAttackedSquares();
      if (this.computerHitAdjacentSquares.length > 0) {
         targetSquare = nonAttackedSquares.get(
            this.computerHitAdjacentSquares.pop()
         );
      } else {
         const keys = Array.from(nonAttackedSquares.keys());
         const randomKey = keys[Math.floor(Math.random() * (keys.length - 1))];
         targetSquare = nonAttackedSquares.get(randomKey);
      }

      if (targetSquare.ship !== null) {
         const leftSquare = `${targetSquare.x - 1}-${targetSquare.y}`;
         const rightSquare = `${targetSquare.x + 1}-${targetSquare.y}`;

         if (nonAttackedSquares.has(leftSquare))
            this.computerHitAdjacentSquares.push(leftSquare);
         if (nonAttackedSquares.has(rightSquare))
            this.computerHitAdjacentSquares.push(rightSquare);
      }

      board.receiveAttack(targetSquare.x, targetSquare.y);
   }
}
