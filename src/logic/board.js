import Ship from './ship';

export default class Board {
   constructor(size) {
      this.board = this.createBoard(size);
      this.ships = [];
   }

   createBoard(size) {
      let board = new Map();
      for (let i = 0; i < size; i++) {
         // const column = [];
         // board.push(column);

         for (let j = 0; j < size; j++) {
            board.set(`${i}-${j}`, { x: i, y: j, isShot: false, ship: null });
            // const square = ;
            // board.push(square);
         }
      }
      return board;
   }

   placeShip(shipLength, x, y) {
      if (!this.allSquaresAvailable(shipLength, x, y)) {
         throw new Error('Not enough space');
      }

      const ship = new Ship(shipLength);
      for (let i = 0; i < shipLength; i++) {
         const square = this.board.get(`${x + i}-${y}`);
         square.ship = ship;
      }
      this.ships.push(ship);
   }

   allSquaresAvailable(shipLength, x, y) {
      let result = true;
      for (let i = 0; i < shipLength; i++) {
         const square = this.board.get(`${x + i}-${y}`);
         if (!square || square.ship !== null) result = false;
      }

      return result;
   }

   getNonAttackedSquares() {
      const nonAttackedSquares = new Map();

      this.board.forEach((value, key) => {
         if (!value.isShot) nonAttackedSquares.set(key, value);
      });
      return nonAttackedSquares;
   }

   receiveAttack(x, y) {
      const square = this.board.get(`${x}-${y}`);
      square.isShot = true;
      if (square.ship) {
         square.ship.hit();
      }
   }

   allShipsSunk() {
      let result = true;
      this.board.forEach((square) => {
         if (square.ship && !square.ship.isSunk()) {
            result = false;
         }
      });
      return result;
   }
}
