import { html, render } from 'lit-html';
import ShipView from './shipView';
import BoardView from './boardView';

// game-page creates two boards: one for the player and one for the computer using BoardView component. and the ships of the player to place on his board using ShipView component and a start button to start the battle

export default class GamePage extends HTMLElement {
   constructor(game) {
      super();
      this.game = game;
      this.render();
   }

   render() {
      let computerBoard = new BoardView(this.game.computerBoard);
      let humanBoard = new BoardView(this.game.humanBoard);
      let shipsContainer = document.createElement('div');
      shipsContainer.classList.add('ships-container');
      this.game.humanBoard.ships.forEach((ship) =>
         shipsContainer.appendChild(new ShipView(ship))
      );

      this.appendChild(computerBoard);
      // this.appendChild(humanBoard);
      // this.appendChild(shipsContainer);
   }
}

customElements.define('game-page', GamePage);
