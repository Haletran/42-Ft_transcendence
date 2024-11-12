import { Page } from '../src/pages.js';

export class Games extends Page {
    constructor() {
        super();
        this.template = `
            <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: 90vh">
                <div id="menu" class="d-flex flex-column align-items-center gap-2">
                    <h1 class="display-1 montserrat-bold">PONG</h1>
                    <button id="start_button" data-link=pong class="btn btn-outline-light btn-lg">Play</button>
                </div>
                <div id="bob" class="blob"></div>
                <canvas id="game" style="display: none;"></canvas>
            </div>
        `;
    }
}