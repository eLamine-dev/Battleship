import Ship from '../logic/ship';

export default class ShipView extends HTMLElement {
   constructor(length) {
      super();
      this.length = length;
   }

   connectedCallback() {
      this.render();
      this.addEventListeners();
   }

   render() {
      this.classList.add('ship');
      this.draggable = true;
      this.style.gridTemplateColumns = `repeat(${this.length}, 1fr)`;
      for (let i = 0; i < this.length; i += 1) {
         const square = document.createElement('div');
         square.classList.add('ship-square');
         square.setAttribute('ship-part', `${i}`);
         this.appendChild(square);
      }
   }

   addEventListeners() {
      this.addEventListener('mousedown', (e) => {
         e.target.classList.add('anchor');
      });
      this.addEventListener('dragstart', (e) => {
         let data = {
            ship: e.target.id,
            shipLength: this.length,
            anchor: this.querySelector('.anchor').getAttribute('ship-part'),
         };
         e.dataTransfer.setData('text/plain', JSON.stringify(data));
         setTimeout(() => {
            e.target.classList.add('hide');
         }, 0);
      });
   }
}

customElements.define('ship-view', ShipView);
