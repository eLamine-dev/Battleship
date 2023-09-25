import Ship from './ship';

export default class Board {
   constructor(size) {
      this.size = size;
      this.squares = this.createBoard(size);
      this.ships = [];
   }

   createBoard(size) {
      const squares = new Map();
      for (let i = 0; i < size; i++) {
         for (let j = 0; j < size; j++) {
            squares.set(`${i}-${j}`, { x: i, y: j, isShot: false, ship: null });
         }
      }
      return squares;
   }

   placeShip(shipLength, x, y) {
      if (!this.allSquaresAvailable(shipLength, x, y)) {
         throw new Error('Not enough space');
      }

      const ship = new Ship(shipLength);
      for (let i = 0; i < shipLength; i++) {
         const square = this.squares.get(`${x + i}-${y}`);
         square.ship = ship;
      }
      this.ships.push(ship);
   }

   allSquaresAvailable(shipLength, x, y) {
      let result = true;
      for (let i = 0; i < shipLength; i++) {
         const square = this.squares.get(`${x + i}-${y}`);
         if (!square || square.ship !== null) result = false;
      }

      return result;
   }

   getNonAttackedSquares() {
      const nonAttackedSquares = new Map();

      this.squares.forEach((value, key) => {
         if (!value.isShot) nonAttackedSquares.set(key, value);
      });
      return nonAttackedSquares;
   }

   receiveAttack(x, y) {
      const square = this.squares.get(`${x}-${y}`);
      square.isShot = true;
      if (square.ship) {
         square.ship.hit();
      }
   }

   allShipsSunk() {
      let result = true;
      this.squares.forEach((square) => {
         if (square.ship && !square.ship.isSunk()) {
            result = false;
         }
      });
      return result;
   }

   placeShipsRandomly() {
      const ships = [5, 4, 3, 3, 2];
      for (let i = 0; i < ships.length; i++) {
         const shipLength = ships[i];
         let x = Math.floor(Math.random() * 10);
         let y = Math.floor(Math.random() * 10);
         while (!this.allSquaresAvailable(shipLength, x, y)) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
         }
         this.placeShip(shipLength, x, y);
      }
   }
}
