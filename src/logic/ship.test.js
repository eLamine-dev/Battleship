import Ship from './ship';
import { validate as uuidValidate } from 'uuid';

test('ship creation', () => {
   const testShip = new Ship(3);
   expect(uuidValidate(testShip.id)).toBe(true);
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
