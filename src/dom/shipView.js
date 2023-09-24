import Ship from '../logic/ship';

export default class ShipView extends HTMLElement {
   constructor(length) {
      super();
      this.length = length;
      this.render();
      this.addEventListeners();
   }

   connectedCallback() {}

   render() {
      this.id = Date.now();
      this.classList.add('ship');
      this.draggable = true;
      // this.style.position = 'absolute';
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
         this.childNodes.forEach((square) => {
            square.classList.remove('anchor');
         });
         e.target.classList.add('anchor');
      });
      this.addEventListener('dragstart', (e) => {
         const ShipData = {
            id: e.target.id,
            length: this.length,
            anchor: Number(
               this.querySelector('.anchor').getAttribute('ship-part')
            ),
         };
         e.dataTransfer.setData('text/plain', JSON.stringify(ShipData));
         setTimeout(() => {
            e.target.classList.add('hide');
         }, 0);
      });
   }
}

customElements.define('ship-view', ShipView);
