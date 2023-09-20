import Player from './player';
import Board from './board';

test('randum play by computer', () => {
   let myBoard = new Board(10);
   let computer = new Player('computer');
   computer.play(myBoard);
   let attackedSquares = [...myBoard.board.values()].filter(
      (square) => square.isShot
   ).length;
   expect(attackedSquares).toBeGreaterThanOrEqual(1);
});
