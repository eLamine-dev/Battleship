import pubsub from '../utils/pubSub';
import Player from './player';
import Board from './board';

export default class Game {
   constructor() {
      this.computerBoard = new Board(10);
      this.humanBoard = new Board(10);
      this.human = new Player('human');
      this.computer = new Player('computer');
      this.computerBoard.placeShipsRandomly();
   }

   initializeListeners() {
      pubsub.subscribe('game:start', this.startGame.bind(this));
      pubsub.subscribe('human:attack', this.handleHumanAttack.bind(this));
   }

   startGame(humanShipsCoordinates) {
      this.humanBoard.placeShips(humanShipsCoordinates);
      this.currentPlayer = this.human;
   }

   handleHumanAttack(x, y) {
      if (this.currentPlayer !== this.human) return;

      this.human.attack(this.computerBoard, x, y);
      if (this.computerBoard.allShipsSunk()) {
         pubsub.publish('human:won');
      } else this.changePlayer();
   }

   changePlayer() {
      this.currentPlayer =
         this.currentPlayer === this.human ? this.computer : this.human;

      if (this.currentPlayer === this.computer) {
         this.computerAttack();
      }
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
