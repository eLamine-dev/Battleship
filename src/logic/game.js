import pubsub from '../utils/pubSub';
import Player from './player';
import Board from './board';

export default class Game {
   constructor() {
      this.computerBoard = new Board(10);
      this.humanBoard = new Board(10);
      this.human = new Player('human');
      this.computer = new Player('computer');
   }

   initializeListeners() {
      pubsub.subscribe('game:start', this.startGame.bind(this));
      pubsub.subscribe('human:attack', this.handleHumanAttack.bind(this));
   }

   handleHumanAttack(x, y) {
      this.human.attack(this.computerBoard, x, y);
      if (this.computerBoard.allShipsSunk()) {
         pubsub.publish('human:won');
      } else this.computerAttack();
   }

   computerAttack() {
      this.computer.attack(this.humanBoard);
      if (this.humanBoard.allShipsSunk()) {
         pubsub.publish('computer:won');
      }
   }

   startGame(humanShipsCoordinates) {
      this.computerBoard.placeShipsRandomly();
      this.humanBoard.placeShips(humanShipsCoordinates);
   }

   isGameOver() {
      if (this.humanBoard.allShipsSunk()) {
         pubsub.publish('computer:won');
      } else if (this.computerBoard.allShipsSunk()) {
         pubsub.publish('human:won');
      }
   }
}
