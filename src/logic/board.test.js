import Board from './board';
import Ship from './ship';

let myBoard;
let ship;

beforeEach(() => {
   myBoard = new Board(10);
   ship = new Ship(3);
});

test('board creation', () => {
   expect(myBoard.squares.get('0-0')).toMatchObject({
      x: 0,
      y: 0,
      isShot: false,
      ship: null,
   });
});

test('placing ship on board', () => {
   myBoard.placeShip(ship, 0, 0);
   expect(myBoard.squares.get('0-0').ship).not.toBeNull();
   expect(myBoard.squares.get('1-0').ship).not.toBeNull();
   expect(myBoard.squares.get('2-0').ship).not.toBeNull();
});

test('throw error when placing ship out of board', () => {
   expect(() => {
      myBoard.placeShip(ship, 9, 0);
   }).toThrow('Not enough space');
});

test('receive attack', () => {
   myBoard.placeShip(ship, 0, 0);
   myBoard.ships.push(ship);
   myBoard.receiveAttack(0, 0);
   expect(myBoard.squares.get('0-0').isShot).toBe(true);
   expect(ship.hits).toBe(1);
   myBoard.receiveAttack(1, 0);
   expect(ship.hits).toBe(2);
   expect(ship.isSunk()).toBe(false);
   myBoard.receiveAttack(2, 0);
   expect(ship.hits).toBe(3);
   expect(ship.isSunk()).toBe(true);
});
