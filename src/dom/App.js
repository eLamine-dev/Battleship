import { html, render } from 'lit-html';
import ShipView from './shipView';
import BoardView from './boardView';

// game-page creates two boards: one for the player and one for the computer using BoardView component. and the ships of the player to place on his board using ShipView component and a start button to start the battle

export default class AppContainer extends HTMLElement {
   constructor(game) {
      super();
      this.game = game;
   }

   connectedCallback() {}

   renderStartPage() {
      let humanBoard = this.boardContainer(this.game.humanBoard);
      let shipsContainer = html` <div class="ships-container">
         <h3>Rai Ryuga fleet</h3>
         ${[...this.game.humanBoard.ships].map((ship) => new ShipView(ship))}
      </div>`;
      let startButton = html`<button class="start-button">Start</button>`;
      render(html`${humanBoard}${shipsContainer}${startButton}`, this);
   }

   renderBattlePage() {
      let humanBoard = this.boardContainer(this.game.humanBoard);
      let computerBoard = this.boardContainer(this.game.computerBoard);
      render(html`${humanBoard}${computerBoard}`, this);
   }

   boardContainer(board) {
      return html` <div class="board-container ${board.player.type}">
         <div class="board-header">
            <div class="leader-avatar">img<img src="" alt="" srcset="" /></div>
            <div class="leader-message">
               <p>
                  <span class="name">Rai Ryouja</span>
                  <span class="message">We need a good plan</span>
               </p>
            </div>

            <div class="strategist-message">
               <p>
                  <span class="name">dhsgfg</span>
                  <span class="message">dfsgdfg dfgdfs dfgdfg </span>
               </p>
            </div>
            <div class="strategist-avatar">
               img<img src="" alt="" srcset="" />
            </div>
         </div>
         <board-view .board=${board} class="board-view board"></board-view>
      </div>`;
   }
}

customElements.define('app-container', AppContainer);
