import Ship from './ship';

export default class Board {
   constructor(size) {
      this.size = size;
      this.squares = this.createBoard();
      this.createShips();
      this.ready = false;
   }

   createBoard() {
      const squares = new Map();
      for (let i = 0; i < this.size; i += 1) {
         for (let j = 0; j < this.size; j += 1) {
            squares.set(`${i}-${j}`, { x: i, y: j, isShot: false, ship: null });
         }
      }
      return squares;
   }

   createShips() {
      const shipLengths = [5, 4, 3, 3, 2, 2];
      this.ships = shipLengths.map((shipLength) => new Ship(shipLength));
   }

   placeShip(ship, x, y) {
      if (!this.allSquaresAvailable(ship.length, x, y)) {
         throw new Error('Not enough space');
      }

      for (let i = 0; i < ship.length; i++) {
         const square = this.squares.get(`${x + i}-${y}`);
         square.ship = ship.id;
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
         this.ships.find((ship) => ship.id === square.ship).hit();
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
      this.ready = true;
   }
}
