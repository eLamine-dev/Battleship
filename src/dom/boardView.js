import pubsub from '../utils/pubSub';

export default class BoardView extends HTMLElement {
   constructor(board) {
      super();
      this.board = board;
   }

   connectedCallback() {
      this.render();
      this.addEventListeners();
   }

   render() {
      this.classList.add('board');
      document.documentElement.style.setProperty(
         '--board-size',
         this.board.size
      );
      const coords = Array.from(this.board.squares.values());

      for (let i = 0; i < coords.length; i += this.board.size) {
         const column = document.createElement('div');
         column.classList.add('board-column');
         this.appendChild(column);

         for (let j = i; j < i + this.board.size; j += 1) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('x', coords[j].x);
            square.setAttribute('y', coords[j].y);
            square.id = `sq-${coords[j].x}-${coords[j].y}`;
            square.setAttribute('data-coords', `${coords[j].x}-${coords[j].y}`);
            square.innerText = `${coords[j].x}-${coords[j].y}`;
            square.setAttribute('occupied-by', null);
            column.prepend(square);
         }
      }
   }

   addEventListeners() {
      this.addEventListener('click', (event) => {
         if (!event.target.classList.contains('square')) return;
         const coords = event.target.getAttribute('data-coords');
         if (this.classList.contains('battle-started')) {
            pubsub.publish('square-attacked', coords);
         }
      });

      if (this.board.ready) return;

      const squares = this.querySelectorAll('.square');

      squares.forEach((square) => {
         square.addEventListener('dragenter', getDropData.bind(this));
         square.addEventListener('dragenter', dragOver.bind(this));
         square.addEventListener('dragover', dragOver.bind(this));
         square.addEventListener('dragleave', dragLeave.bind(this));
         square.addEventListener('drop', drop.bind(this));
      });

      let dropData = {
         ship: null,
         squaresToTake: [],
         canPlaceShip: false,
      };

      function getDropData(e) {
         dropData.ship = JSON.parse(e.dataTransfer.getData('text/plain'));
         dropData.squaresToTake.splice(0, dropData.squaresToTake.length);

         if (
            e.target.classList.contains('square') ||
            e.target.classList.contains('ship-square')
         ) {
            const anchorCoords = {
               x: Number(e.target.getAttribute('x')),
               y: Number(e.target.getAttribute('y')),
            };

            for (let i = 0; i < dropData.ship.length; i += 1) {
               const coords = `${anchorCoords.x + i - dropData.ship.anchor}-${
                  anchorCoords.y
               }`;
               if (this.board.squares.has(coords)) {
                  const square = this.querySelector(
                     `.square[data-coords="${coords}"]`
                  );
                  dropData.squaresToTake.push(square);
               }
            }
         }

         let availableSquare = (square) =>
            square.getAttribute('occupied-by') === 'null' ||
            square.getAttribute('occupied-by') === dropData.ship.id;

         let squaresAvailable = dropData.squaresToTake.every(availableSquare);

         if (
            dropData.squaresToTake.length === dropData.ship.length &&
            squaresAvailable
         ) {
            dropData.canPlaceShip = true;
         } else {
            dropData.canPlaceShip = false;
         }
      }

      function dragOver(e) {
         e.preventDefault();

         if (!dropData.canPlaceShip) return;

         dropData.squaresToTake.forEach((square) => {
            square.classList.add('drag-over');
         });
      }

      function dragLeave(e) {
         this.querySelectorAll(`.drag-over`).forEach((square) => {
            square.classList.remove('drag-over');
         });
         this.querySelectorAll(
            `.square[occupied-by="${dropData.ship.id}"]`
         ).forEach((square) => {
            square.setAttribute('occupied-by', null);
         });
      }

      function drop(e) {
         if (!dropData.canPlaceShip) return;
         const draggable = document.getElementById(dropData.ship.id);

         draggable.classList.add('placed');

         for (let i = 0; i < dropData.ship.length; i += 1) {
            draggable.childNodes[i].setAttribute(
               'x',
               dropData.squaresToTake[i].getAttribute('x')
            );
            draggable.childNodes[i].setAttribute(
               'y',
               dropData.squaresToTake[i].getAttribute('y')
            );
            dropData.squaresToTake[i].setAttribute(
               'occupied-by',
               dropData.ship.id
            );
            dropData.squaresToTake[i].classList.remove('drag-over');
         }

         const shipBowSquare = dropData.squaresToTake[0];
         shipBowSquare.style.position = 'relative';

         shipBowSquare.appendChild(draggable);
      }
   }
}

customElements.define('board-view', BoardView);
