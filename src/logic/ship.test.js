import Ship from './ship';

test('ship creation', () => {
   const testShip = new Ship(3);
   expect(testShip.length).toBe(3);
   expect(testShip.hits).toBe(0);
   expect(testShip.sunk).toBe(false);
});

test('ship hit', () => {
   const testShip = new Ship(3);
   testShip.hit();
   expect(testShip.hits).toBe(1);
   testShip.hit();
   testShip.hit();
   expect(testShip.hits).toBe(3);
   expect(testShip.isSunk()).toBe(true);
});
