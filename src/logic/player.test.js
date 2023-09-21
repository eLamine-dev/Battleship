import Player from './player';
import Board from './board';

test('random play by computer', () => {
   let myBoard = new Board(10);
   let computer = new Player('computer');
   computer.attack(myBoard);
   let attackedSquares = [...myBoard.squares.values()].filter(
      (square) => square.isShot
   ).length;
   expect(attackedSquares).toBeGreaterThanOrEqual(1);
});
