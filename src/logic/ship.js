import { v4 as uuidv4 } from 'uuid';

export default class Ship {
   constructor(length) {
      this.id = uuidv4();
      this.length = length;
      this.hits = 0;
   }

   hit = () => {
      this.hits += 1;
   };

   sank = () => {
      if (this.hits === this.length) {
         return true;
      }
      return false;
   };
}
