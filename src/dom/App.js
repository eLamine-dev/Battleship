import { html, render } from 'lit-html';
import ShipView from './shipView';
import BoardView from './boardView';
import pubsub from '../utils/pubSub';
import endImgLost from '../assets/images/end-lost.jpg';
import endImgWin from '../assets/images/end-win.jpg';

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
      // let humanBoard = this.boardContainer(
      //    this.game.humanBoard,
      //    this.game.human
      // );
      let humanBoard = new BoardView(this.game.humanBoard);
      humanBoard.classList.add('human-board');
      const shipsContainer = html`
         <div class="ships-container">
            <div class="start-page-avatars">
               <div class="leader-img"></div>
               <p><b>Rai Ryuga: </b>Sishin, is the battle plan ready?</p>
               <div class="strategist-img"></div>
               <p><b>Sishin: </b>Yes Rai, this is the ships positioning:</p>
            </div>
            <div class="ships">
               ${[...this.game.humanBoard.ships].map(
                  (ship) => new ShipView(ship)
               )}
            </div>
            <button class="start-button">Start Battle</button>
         </div>
      `;

      // let startButton = html``;
      render(html`${humanBoard}${shipsContainer}`, this);
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
      winnerDialog.classList.add('end-dialog');
      let endImg;
      let endMessage;

      if (winner.type === 'human') {
         endImg = endImgWin;
         endMessage = 'We won, Rai is now the galaxy Emperor';
      } else {
         endImg = endImgLost;
         endMessage = 'We lost this battle, but we will meet again Rakou';
      }

      const winnerDialogHtml = html`
         <div class="end-modal-content">
            <p class="end-msg">${endMessage}</p>
            <img class="end-img" src="${endImg}" alt="" srcset="" />
            <button class="restart-button">Play again</button>
         </div>
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
         const unplacedShips = this.querySelectorAll('.ships-container .ship');
         if (unplacedShips.length > 0) return;
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
      return html` <div class="board-container ${player.type}">
         <div class="board-avatars">
            <div class="leader-img">${player.captainName}</div>
            <div class="strategist-img">${player.strategistName}</div>
         </div>
         <board-view .board=${board} class="${player.type}-board"></board-view>
      </div>`;
   }
}

customElements.define('app-container', AppContainer);
