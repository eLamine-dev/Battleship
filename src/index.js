import BoardView from './dom/boardView';
import Board from './logic/board';
import ShipView from './dom/shipView';
import './assets/css/reset.css';
import './assets/css/style.css';

document.addEventListener('DOMContentLoaded', () => {
   const myBoard = new Board(10);
   const myBoardView = new BoardView(myBoard);
   const myShip = new ShipView(5);
   const myShip2 = new ShipView(4);
   document.body.appendChild(myBoardView);
   document.body.appendChild(myShip);
   document.body.appendChild(myShip2);
});