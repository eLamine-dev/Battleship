import { v4 as uuidv4 } from 'uuid';

export default class Ship {
   constructor(length) {
      this.id = uuidv4();
      this.length = length;
      this.hits = 0;
      this.sunk = false;
   }

   hit = () => {
      this.hits += 1;
   };

   isSunk = () => {
      if (this.hits === this.length) {
         this.sunk = true;
      }
      return this.sunk;
   };
}
