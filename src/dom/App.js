import { html, render } from 'lit-html';
import ShipView from './shipView';
import BoardView from './boardView';
import pubsub from '../utils/pubSub';

export default class AppContainer extends HTMLElement {
   constructor(game) {
      super();
      this.game = game;
   }

   connectedCallback() {
      this.renderStartPage();
      this.addEventListeners();
   }

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
      console.log(this.game.computerBoard);
   }

   addEventListeners() {
      this.addEventListener('click', (e) => {
         if (e.target.matches('.start-button')) {
            let shipsCoords = [];
            this.querySelectorAll('.ship-square[ship-part="0"]').forEach(
               (square) => {
                  let shipData = {
                     shipId: square.parentElement.id,
                     x: Number(square.getAttribute('x')),
                     y: Number(square.getAttribute('y')),
                  };

                  shipsCoords.push(shipData);
               }
            );

            pubsub.publish('game:start', shipsCoords);
            this.renderBattlePage();
         }
      });
   }

   boardContainer(board) {
      return html` <div class="board-container">
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
         <board-view
            .board=${board}
            class="${board.player.type}-board"
         ></board-view>
      </div>`;
   }
}

customElements.define('app-container', AppContainer);
