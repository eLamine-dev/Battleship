import Game from './logic/game';
import App from './dom/App';
import './assets/css/reset.css';
import './assets/css/style.css';

document.addEventListener('DOMContentLoaded', () => {
   const myGame = new Game();
   const appPage = new App(myGame);
   document.body.appendChild(appPage);
});
