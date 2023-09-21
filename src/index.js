import BoardView from './dom/boardView';
import Board from './logic/board';
import './assets/css/reset.css';
import './assets/css/style.css';

document.addEventListener('DOMContentLoaded', () => {
   const myBoard = new Board(10);
   const myBoardView = new BoardView(myBoard);
   document.body.appendChild(myBoardView);
});
