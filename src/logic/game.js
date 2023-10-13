import pubsub from '../utils/pubSub';
import Player from './player';
import Board from './board';

export default class Game {
   constructor() {
      this.human = new Player('human', 'RAI', 'SISHIN');
      this.computer = new Player('computer', 'RAKOU', 'YUUSHUN');
      this.setUpNewGame();
      this.initializeListeners();
   }

   initializeListeners() {
      pubsub.subscribe('game:start', this.startGame.bind(this));
      pubsub.subscribe('human:attack', this.handleHumanAttack.bind(this));
   }

   setUpNewGame() {
      this.computerBoard = new Board(10);
      this.humanBoard = new Board(10);
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
         setTimeout(() => this.computerAttack(), 150);
      }
   }

   computerAttack() {
      this.computer.attack(this.humanBoard);
      pubsub.publish('game:attack-made');
      this.checkForWin(this.humanBoard);
   }

   checkForWin(board) {
      if (board.allShipsSank() === true) {
         pubsub.publish('game:winner', this.currentPlayer);
         return;
      }
      this.changePlayer();
   }
}
