import { fetchMinInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass } from '../js/utils.js';
import { startWebSocket } from './login_base.js';
import { logoutUser } from '../src/logout.js';

export class Pong extends Page {
    constructor() {
        super();
        this.template = `
            <div class="header">
        <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand " href="/home" data-link="/home">
                    <img src="/static/imgs/logo.png" alt="" width="25" class="d-inline-block align-text-top invert">
                    <p class="d-inline montserrat-bold">Ft_transcendence</p>
                </a>
                <a class="nav-link active" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img alt="logo_profile_picture" width="40" height="40" class="rounded-circle" style="
                              object-fit: cover;
                            " src=""
                        alt="profile_picture" />
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item" href="/profile" data-link="/profile">Profile</a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/settings" data-link="/settings" >Settings</a>
                    </li>
                    <li>
                        <a class="dropdown-item fw-bold text-danger" href="/" data-link="/" id="logout-butt" >Logout</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    <div class="menu">
        <div class="container-fluid d-flex justify-content-center align-items-center center">
            <div id="menu" class="d-flex flex-column align-items-center gap-2">
                <div id="logo" style="display: flex; align-items: center">
                    <h1 id="menu" class="display-1 montserrat-bold fw-bold mx-auto">PONG</h1>
                </div>
                <div class="d-flex flex-row gap-3">
                    <div class="card" style="width: 18rem;">
                      <div class="card-body">
                        <h2 class="card-title">GameMode </h2>
                        <div class="d-flex flex-column gap-2">
                            <button id="start_button" value="pvp" class="btn btn-outline-light full-width">1
                                vs 1</button>
                            <button id="start_button2" value="vsa" class="btn btn-outline-light full-width">1
                                vs AI</button>
                            <button id="tournament_button" class="btn btn-light full-width">Tournament</button>
                        </div>
                      </div>
                    </div>
                    <div class="card" style="width: 18rem;">
                      <div class="card-body">
                        <h2 class="card-title"><i class="bi bi-gear settings"></i> Options</h2>
                        <div class="d-flex flex-column gap-2 mt-3">
                            <div class="d-flex flex-row gap-2">
                                <p class="text-muted">Volume</p>
                                <i class="bi bi-volume-up"></i>
                                <input type="range" class="form-range" id="volume" min="0" max="100" value="50">
                            </div>
                            <div class="d-flex flex-row gap-2">
                            <p class="text-muted">Select the difficulty</p>

                            <select class="form-select" id="difficulty">
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div class="d-flex flex-row gap-2">
                                <p class="text-muted">Paddle color</p>
                            <input type="color" id="paddle_color" value="#ffffff">
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="game justify-content-center align-items-center">
        <canvas id="pong_canvas" style="display: none;"></canvas>
    </div>
        `;
    }

    render() {
        fetchMinInfo();
        startWebSocket();
        super.render();

        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                //event.preventDefault();
                logoutUser();
            });
        }
        const setupEventListeners = () => {
            const buttons = ['start_button', 'start_button2', 'tournament_button'];
            buttons.forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.replaceWith(button.cloneNode(true));
                    document.getElementById(buttonId).addEventListener('click', () => {
                        const canvas = document.getElementById('pong_canvas');
                        if (canvas && this.game) {
                            showElementsByClass('game', 'flex');
                            hideElementsByClass('menu');
                            addClassToElementsByClass('game', 'center');
                            document.getElementById('pong_canvas').style.display = 'block';
                            this.game(button.value);
                        }
                    });
                }
            });
        };

        if (!document.getElementById('pong_game_script')) {
            return new Promise((resolve) => {
                import('/static/spa/pong_game.js')
                    .then(module => {
                        this.game = module.game;
                        setupEventListeners();
                        resolve();
                    })
                    .catch(err => console.error('Error loading game:', err));
            });
        } else {
            setupEventListeners();
        }
    }
}