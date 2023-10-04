import pubsub from '../utils/pubSub';
import Player from './player';
import Board from './board';

export default class Game {
   constructor() {
      this.human = new Player('human');
      this.computer = new Player('computer');
      this.computerBoard = new Board(10, this.computer);
      this.humanBoard = new Board(10, this.human);
      this.initializeListeners();
   }

   initializeListeners() {
      pubsub.subscribe('game:start', this.startGame.bind(this));
      pubsub.subscribe('human:attack', this.handleHumanAttack.bind(this));
   }

   startGame(humanShipsData) {
      this.computerBoard.placeShipsRandomly();
      humanShipsData.forEach((shipData) => {
         const ship = this.humanBoard.ships.find(
            (_ship) => _ship.id === shipData.shipId
         );
         this.humanBoard.placeShip(ship, shipData.x, shipData.y);
      });
      this.currentPlayer = this.human;
   }

   handleHumanAttack(coords) {
      if (this.currentPlayer !== this.human) return;

      this.human.attack(this.computerBoard, coords.x, coords.y);
      if (this.computerBoard.allShipsSunk()) {
         alert('human won');
         pubsub.publish('human:won');
      } else this.changePlayer();
   }

   changePlayer() {
      this.currentPlayer =
         this.currentPlayer === this.human ? this.computer : this.human;

      if (this.currentPlayer === this.computer) {
         this.computerAttack();
      }
      pubsub.publish('game:player-changed');
   }

   computerAttack() {
      this.computer.attack(this.humanBoard);
      if (this.humanBoard.allShipsSunk()) {
         pubsub.publish('computer:won');
      } else this.changePlayer();
   }

   // isGameOver() {
   //    if (this.humanBoard.allShipsSunk()) {
   //       pubsub.publish('computer:won');
   //    } else if (this.computerBoard.allShipsSunk()) {
   //       pubsub.publish('human:won');
   //    }
   // }
}
