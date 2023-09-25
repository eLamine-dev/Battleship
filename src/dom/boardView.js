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

      const squares = document.querySelectorAll('.square');

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

         draggable.classList.remove('hide');
      }
   }
}

customElements.define('board-view', BoardView);

// Board {
//     squares: Map(100) {
//       '0-0' => { x: 0, y: 0, isShot: false, ship: null },
//       '0-1' => { x: 0, y: 1, isShot: false, ship: null },
//       '0-2' => { x: 0, y: 2, isShot: false, ship: null },
//       '0-3' => { x: 0, y: 3, isShot: false, ship: null },
//       '0-4' => { x: 0, y: 4, isShot: false, ship: null },
//       '0-5' => { x: 0, y: 5, isShot: false, ship: null },
//       '0-6' => { x: 0, y: 6, isShot: false, ship: null },
//       '0-7' => { x: 0, y: 7, isShot: false, ship: null },
//       '0-8' => { x: 0, y: 8, isShot: false, ship: null },
//       '0-9' => { x: 0, y: 9, isShot: false, ship: null },
//       '1-0' => { x: 1, y: 0, isShot: false, ship: null },
//       '1-1' => { x: 1, y: 1, isShot: false, ship: null },
//       '1-2' => { x: 1, y: 2, isShot: false, ship: null },
//       '1-3' => { x: 1, y: 3, isShot: false, ship: null },
//       '1-4' => { x: 1, y: 4, isShot: false, ship: null },
//       '1-5' => { x: 1, y: 5, isShot: false, ship: null },
//       '1-6' => { x: 1, y: 6, isShot: false, ship: null },
//       '1-7' => { x: 1, y: 7, isShot: false, ship: null },
//       '1-8' => { x: 1, y: 8, isShot: false, ship: null },
//       '1-9' => { x: 1, y: 9, isShot: false, ship: null },
//       '2-0' => { x: 2, y: 0, isShot: false, ship: null },
//       '2-1' => { x: 2, y: 1, isShot: false, ship: null },
//       '2-2' => { x: 2, y: 2, isShot: false, ship: null },
//       '2-3' => { x: 2, y: 3, isShot: false, ship: null },
//       '2-4' => { x: 2, y: 4, isShot: false, ship: null },
//       '2-5' => { x: 2, y: 5, isShot: false, ship: null },
//       '2-6' => { x: 2, y: 6, isShot: false, ship: null },
//       '2-7' => { x: 2, y: 7, isShot: false, ship: null },
//       '2-8' => { x: 2, y: 8, isShot: false, ship: null },
//       '2-9' => { x: 2, y: 9, isShot: false, ship: null },
//       '3-0' => { x: 3, y: 0, isShot: false, ship: null },
//       '3-1' => { x: 3, y: 1, isShot: false, ship: null },
//       '3-2' => { x: 3, y: 2, isShot: false, ship: null },
//       '3-3' => { x: 3, y: 3, isShot: false, ship: null },
//       '3-4' => { x: 3, y: 4, isShot: false, ship: null },
//       '3-5' => { x: 3, y: 5, isShot: false, ship: null },
//       '3-6' => { x: 3, y: 6, isShot: false, ship: null },
//       '3-7' => { x: 3, y: 7, isShot: false, ship: null },
//       '3-8' => { x: 3, y: 8, isShot: false, ship: null },
//       '3-9' => { x: 3, y: 9, isShot: false, ship: null },
//       '4-0' => { x: 4, y: 0, isShot: false, ship: null },
//       '4-1' => { x: 4, y: 1, isShot: false, ship: null },
//       '4-2' => { x: 4, y: 2, isShot: false, ship: null },
//       '4-3' => { x: 4, y: 3, isShot: false, ship: null },
//       '4-4' => { x: 4, y: 4, isShot: false, ship: null },
//       '4-5' => { x: 4, y: 5, isShot: false, ship: null },
//       '4-6' => { x: 4, y: 6, isShot: false, ship: null },
//       '4-7' => { x: 4, y: 7, isShot: false, ship: null },
//       '4-8' => { x: 4, y: 8, isShot: false, ship: null },
//       '4-9' => { x: 4, y: 9, isShot: false, ship: null },
//       '5-0' => { x: 5, y: 0, isShot: false, ship: null },
//       '5-1' => { x: 5, y: 1, isShot: false, ship: null },
//       '5-2' => { x: 5, y: 2, isShot: false, ship: null },
//       '5-3' => { x: 5, y: 3, isShot: false, ship: null },
//       '5-4' => { x: 5, y: 4, isShot: false, ship: null },
//       '5-5' => { x: 5, y: 5, isShot: false, ship: null },
//       '5-6' => { x: 5, y: 6, isShot: false, ship: null },
//       '5-7' => { x: 5, y: 7, isShot: false, ship: null },
//       '5-8' => { x: 5, y: 8, isShot: false, ship: null },
//       '5-9' => { x: 5, y: 9, isShot: false, ship: null },
//       '6-0' => { x: 6, y: 0, isShot: false, ship: null },
//       '6-1' => { x: 6, y: 1, isShot: false, ship: null },
//       '6-2' => { x: 6, y: 2, isShot: false, ship: null },
//       '6-3' => { x: 6, y: 3, isShot: false, ship: null },
//       '6-4' => { x: 6, y: 4, isShot: false, ship: null },
//       '6-5' => { x: 6, y: 5, isShot: false, ship: null },
//       '6-6' => { x: 6, y: 6, isShot: false, ship: null },
//       '6-7' => { x: 6, y: 7, isShot: false, ship: null },
//       '6-8' => { x: 6, y: 8, isShot: false, ship: null },
//       '6-9' => { x: 6, y: 9, isShot: false, ship: null },
//       '7-0' => { x: 7, y: 0, isShot: false, ship: null },
//       '7-1' => { x: 7, y: 1, isShot: false, ship: null },
//       '7-2' => { x: 7, y: 2, isShot: false, ship: null },
//       '7-3' => { x: 7, y: 3, isShot: false, ship: null },
//       '7-4' => { x: 7, y: 4, isShot: false, ship: null },
//       '7-5' => { x: 7, y: 5, isShot: false, ship: null },
//       '7-6' => { x: 7, y: 6, isShot: false, ship: null },
//       '7-7' => { x: 7, y: 7, isShot: false, ship: null },
//       '7-8' => { x: 7, y: 8, isShot: false, ship: null },
//       '7-9' => { x: 7, y: 9, isShot: false, ship: null },
//       '8-0' => { x: 8, y: 0, isShot: false, ship: null },
//       '8-1' => { x: 8, y: 1, isShot: false, ship: null },
//       '8-2' => { x: 8, y: 2, isShot: false, ship: null },
//       '8-3' => { x: 8, y: 3, isShot: false, ship: null },
//       '8-4' => { x: 8, y: 4, isShot: false, ship: null },
//       '8-5' => { x: 8, y: 5, isShot: false, ship: null },
//       '8-6' => { x: 8, y: 6, isShot: false, ship: null },
//       '8-7' => { x: 8, y: 7, isShot: false, ship: null },
//       '8-8' => { x: 8, y: 8, isShot: false, ship: null },
//       '8-9' => { x: 8, y: 9, isShot: false, ship: null },
//       '9-0' => { x: 9, y: 0, isShot: false, ship: null },
//       '9-1' => { x: 9, y: 1, isShot: false, ship: null },
//       '9-2' => { x: 9, y: 2, isShot: false, ship: null },
//       '9-3' => { x: 9, y: 3, isShot: false, ship: null },
//       '9-4' => { x: 9, y: 4, isShot: false, ship: null },
//       '9-5' => { x: 9, y: 5, isShot: false, ship: null },
//       '9-6' => { x: 9, y: 6, isShot: false, ship: null },
//       '9-7' => { x: 9, y: 7, isShot: false, ship: null },
//       '9-8' => { x: 9, y: 8, isShot: false, ship: null },
//       '9-9' => { x: 9, y: 9, isShot: false, ship: null }
//     },
//     ships: []
//   }
