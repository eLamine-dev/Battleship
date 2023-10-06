import Ship from './ship';

export default class Board {
   constructor(size, player) {
      this.player = player;
      this.size = size;
      this.squares = this.createBoard();
      this.createShips();
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

      for (let i = 0; i < ship.length; i += 1) {
         const square = this.squares.get(`${x + i}-${y}`);
         square.ship = ship.id;
      }
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
      if (square.ship !== null) {
         this.ships.find((ship) => ship.id === square.ship).hit();
      }
   }

   allShipsSank() {
      return this.ships.every((ship) => ship.sank() === true);
   }

   allSquaresAvailable(shipLength, x, y) {
      let result = true;
      for (let i = 0; i < shipLength; i += 1) {
         const square = this.squares.get(`${x + i}-${y}`);

         if (!square || square.ship !== null) result = false;
      }

      return result;
   }

   placeShipsRandomly() {
      for (let i = 0; i < this.ships.length; i += 1) {
         const shipLength = this.ships[i].length;
         let x = Math.floor(Math.random() * 10);
         let y = Math.floor(Math.random() * 10);
         while (!this.allSquaresAvailable(shipLength, x, y)) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
         }
         this.placeShip(this.ships[i], x, y);
      }
      this.ready = true;
   }
}
