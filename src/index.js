// import BoardView from './dom/boardView';
// import Board from './logic/board';
// import ShipView from './dom/shipView';
import Game from './logic/game';
import GamePage from './dom/gamePage';
import './assets/css/reset.css';
import './assets/css/style.css';

document.addEventListener('DOMContentLoaded', () => {
   const myGame = new Game();
   const myGamePage = new GamePage(myGame);
   myGamePage.renderShipPositioningPage();
   // myGamePage.renderBattlePage();
   // document.body.appendChild(myGamePage);
});
