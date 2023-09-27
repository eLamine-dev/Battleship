// import BoardView from './dom/boardView';
// import Board from './logic/board';
// import ShipView from './dom/shipView';
import Game from './logic/game';
import App from './dom/App';
import './assets/css/reset.css';
import './assets/css/style.css';

document.addEventListener('DOMContentLoaded', () => {
   const myGame = new Game();
   const AppPage = new App(myGame);
   AppPage.renderStartPage();
   // AppPage.renderBattlePage();
   document.body.appendChild(AppPage);
   // document.body.appendChild(myGamePage);
});
