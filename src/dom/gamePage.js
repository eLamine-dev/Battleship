import { html, render } from 'lit-html';
import ShipView from './shipView';
import BoardView from './boardView';

// game-page creates two boards: one for the player and one for the computer using BoardView component. and the ships of the player to place on his board using ShipView component and a start button to start the battle

export default class GamePage extends HTMLElement {
   constructor(game) {
      super();
      this.game = game;
   }

   connectedCallback() {}

   renderShipPositioningPage() {
      let humanSide = this.buildOneSideContainer(this.game.humanBoard);

      // document.body.appendChild(humanSide);

      // let computerSide = this.buildOneSideContainer(this.game.computerBoard);
      render(html`${humanSide}${this.buildShipsContainer()}`, document.body);

      // let computerBoard = new BoardView(this.game.computerBoard);

      // let humanBoard = new BoardView(this.game.humanBoard);
      // let shipsContainer = document.createElement('div');
      // shipsContainer.classList.add('ships-container');
      // this.game.humanBoard.ships.forEach((ship) =>
      //    shipsContainer.appendChild(new ShipView(ship))
      // );
   }

   renderBattlePage() {
      let humanSide = this.buildOneSideContainer(this.game.humanBoard);
      let computerSide = this.buildOneSideContainer(this.game.computerBoard);

      // document.body.appendChild(humanSide);

      // let computerSide = this.buildOneSideContainer(this.game.computerBoard);
      render(html`${humanSide}${computerSide}`, document.body);
   }

   buildShipsContainer() {
      let shipsContainer = document.createElement('div');
      shipsContainer.classList.add('ships-container');
      this.game.humanBoard.ships.forEach((ship) =>
         shipsContainer.appendChild(new ShipView(ship))
      );
      return shipsContainer;
   }

   buildOneSideContainer(board) {
      return html` <div class="side-container ${board.player.type}">
         <div class="avatar leader"><img src="" alt="" srcset="" /></div>
         <div class="message leader">
            <p>
               <span class="leader-name"></span>
               <span class="leader-message"></span>
            </p>
         </div>
         <div class="avatar strategist"><img src="" alt="" srcset="" /></div>
         <div class="message strategist">
            <p>
               <span class="strategist-name"></span>
               <span class="strategist-message"></span>
            </p>
         </div>

         <div class="ships-container">
            <!-- <ship-view></ship-view> -->
         </div>
         <div class="start-button">
            <button>Start</button>
         </div>
         <board-view .board=${board} class="board-view board"></board-view>
      </div>`;
   }
}

customElements.define('game-page', GamePage);
