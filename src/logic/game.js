import pubsub from '../utils/pubSub';
import Player from './player';
import Board from './board';

export default class Game {
   constructor() {
      this.human = new Player('human', 'Rai-Ryuga', 'SISHIN DAIGAKUYA');
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
      pubsub.publish('game:attack-made');
      this.checkForWin(this.computerBoard);
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
      pubsub.publish('game:attack-made');
      this.checkForWin(this.humanBoard);
   }

   checkForWin(board) {
      if (board.allShipsSank() === true) {
         pubsub.publish(`${this.currentPlayer.type}:won`);
         return;
      }
      this.changePlayer();
   }
}
