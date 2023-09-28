import pubSub from '../utils/pubSub';

export default class ShipView extends HTMLElement {
   constructor(ship) {
      super();
      this.ship = ship;
      this.render();
      this.addEventListeners();
   }

   // connectedCallback() {}

   render() {
      this.id = this.ship.id;
      this.classList.add('ship');
      this.draggable = true;
      this.style.gridTemplateColumns = `repeat(${this.ship.length}, 1fr)`;
      for (let i = 0; i < this.ship.length; i += 1) {
         const square = document.createElement('div');
         square.classList.add('ship-square');
         square.setAttribute('ship-part', `${i}`);
         this.appendChild(square);
      }
   }

   addEventListeners() {
      this.addEventListener('mousedown', (e) => {
         this.childNodes.forEach((square) => {
            square.classList.remove('anchor');
         });
         e.target.classList.add('anchor');
      });

      this.addEventListener('dragstart', (e) => {
         let ShipData = {
            id: e.target.id,
            length: this.ship.length,
            anchor: Number(
               this.querySelector('.anchor').getAttribute('ship-part')
            ),
         };
         pubSub.publish('ship-dragstart', ShipData);
         e.dataTransfer.setData('text/plain', JSON.stringify(ShipData));
         setTimeout(() => {
            e.target.classList.add('hide');
         }, 0);
      });

      this.addEventListener('dragend', (e) => {
         e.target.classList.remove('hide');
      });
   }
}

customElements.define('ship-view', ShipView);
