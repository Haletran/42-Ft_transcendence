import { Page } from '../src/pages.js';

export class Pong extends Page {
    constructor() {
        super();
        this.template = `
            <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: 90vh">
                <div id="bob" class="blob"></div>
                <canvas id="game" style="display: block;"></canvas>
            </div>
        `;
    }

    render() {
        super.render(); // Call the parent render method
      
        const script = document.createElement('script');
        script.src = '/static/spa/pong_game.js'; // Correct path to your game script
        document.body.appendChild(script);
      
        script.onload = () => {
            game(); // Call the game function after the script is loaded
        };
    }
}