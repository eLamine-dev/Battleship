import { html, render } from 'lit-html';
import ShipView from './shipView';
import BoardView from './boardView';

// game-page creates two boards: one for the player and one for the computer using BoardView component. and the ships of the player to place on his board using ShipView component and a start button to start the battle
export default class GamePage extends HTMLElement {
   constructor(game) {
      super();
      this.game = game;
      this.render();
   }

   this.render() {
    
   }
}
