import { Page } from '../src/pages.js';

export class HomePage extends Page {
	constructor() {
	  super();
	  this.template = `
	<div id="main" class="container-fluid">
      <div
        class="d-flex flex-column justify-content-center align-items-center gap-5"
        style="min-height: 90vh"
      >
        <div class="d-flex flex-column align-items-center text-center">
          <h1 id="game_name2" class="display-6 color-custom"></h1>
          <p class="lead">Fullstack Gaming Website</p>
          <div class="d-flex flex-column flex-md-row gap-3 justify-content-center" id="app"></div>
		    <a id="play_button" type="button" class="btn btn-light fw-bold" data-link=login
				>Start Playing</a
			  >
        </div>
        <div class="blob"></div>
        <div class="row justify-content-center gap-1">
          <div class="col-12 col-sm-6 col-md-3">
            <div
              id="card-present"
              class="card mb-3 h-80"
              style="
                background-color: rgba(255, 255, 255, 0.01);
                backdrop-filter: blur(10px);
                color: white;
                border-color: #393c49;
              "
            >
              <div class="card-header fw-bold">Pong</div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title montserrat-bold">
                  1. Classic Arcade Game
                </h5>
                <p class="card-text">
                  Pong is one of the first computer games created. This simple
                  "tennis-like" game features two paddles.
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div
              class="card mb-3 h-80"
              style="
                background-color: rgba(255, 255, 255, 0.01);
                color: white;
                border-color: #393c49;
              "
            >
              <div class="card-header fw-bold">Chess</div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title montserrat-bold">
                  2 . Strategic Board Game
                </h5>
                <p class="card-text">
                  Chess is a two-player strategy game played on a board with 64
                  squares arranged in an 8×8 grid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	  `;
	}
  }