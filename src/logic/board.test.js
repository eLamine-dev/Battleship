import Board from './board';

test('board creation', () => {
   let myBoard = new Board(10);
   expect(myBoard.board.get('0-0')).toMatchObject({
      x: 0,
      y: 0,
      isShot: false,
      ship: null,
   });
});

test('placing ship on board', () => {
   let myBoard = new Board(10);
   myBoard.placeShip(3, 0, 0);
   expect(myBoard.board.get('0-0').ship).not.toBeNull();
   expect(myBoard.board.get('1-0').ship).not.toBeNull();
   expect(myBoard.board.get('2-0').ship).not.toBeNull();
});

test('throw error when placing ship out of board', () => {
   let myBoard = new Board(10);
   expect(() => {
      myBoard.placeShip(3, 9, 0);
   }).toThrow('Not enough space');
});

test('receive attack', () => {
   let myBoard = new Board(10);
   myBoard.placeShip(3, 0, 0);
   myBoard.receiveAttack(0, 0);
   expect(myBoard.board.get('0-0').isShot).toBe(true);
   expect(myBoard.board.get('0-0').ship.hits).toBe(1);
});
