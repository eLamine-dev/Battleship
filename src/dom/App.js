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
      pubsub.subscribe('game:winner', this.renderWinnerDialog.bind(this));
   }

   renderStartPage() {
      let humanBoard = this.boardContainer(
         this.game.humanBoard,
         this.game.human
      );
      let shipsContainer = html` <div class="ships-container">
         <h3>Rai Ryuga fleet</h3>
         ${[...this.game.humanBoard.ships].map((ship) => new ShipView(ship))}
      </div>`;
      let startButton = html`<button class="start-button">Start</button>`;
      render(html`${humanBoard}${shipsContainer}${startButton}`, this);
   }

   renderBattlePage() {
      let humanBoard = this.boardContainer(
         this.game.humanBoard,
         this.game.human
      );
      let computerBoard = this.boardContainer(
         this.game.computerBoard,
         this.game.computer
      );
      render(html`${humanBoard}${computerBoard}`, this);
   }

   renderWinnerDialog(winner) {
      const winnerDialog = document.createElement('dialog');
      winnerDialog.classList.add('winner-dialog');

      const winnerDialogHtml = html`
         <p>${winner.captainName} won!</p>
         <button class="restart-button">Restart</button>
      `;
      render(winnerDialogHtml, winnerDialog);
      document.body.appendChild(winnerDialog);
      winnerDialog.showModal();
      winnerDialog.addEventListener('click', (e) => {
         if (e.target.matches('.restart-button')) {
            winnerDialog.close();
            this.resetGame();
         }
         e.stopPropagation();
         e.preventDefault();
         return false;
      });
   }

   resetGame() {
      this.game.setUpNewGame();
      this.renderStartPage();
   }

   addEventListeners() {
      this.addEventListener('click', (e) => {
         if (e.target.matches('.start-button')) {
            const shipsCoords = [];
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

   boardContainer(board, player) {
      return html` <div class="board-container">
         <div class="board-header">
            <div class="leader-avatar">img<img src="" alt="" srcset="" /></div>
            <div class="leader-message">
               <p>
                  <span class="name">${player.captainName}</span>
                  <span class="message">We need a good plan</span>
               </p>
            </div>

            <div class="strategist-message">
               <p>
                  <span class="name">${player.strategistName}</span>
                  <span class="message">dfsgdfg dfgdfs dfgdfg </span>
               </p>
            </div>
            <div class="strategist-avatar">
               img<img src="" alt="" srcset="" />
            </div>
         </div>
         <board-view .board=${board} class="${player.type}-board"></board-view>
      </div>`;
   }
}

customElements.define('app-container', AppContainer);
