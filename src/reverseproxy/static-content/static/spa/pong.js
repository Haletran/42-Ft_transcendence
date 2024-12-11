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
                <button class="btn btn-outline-light me-auto" href="/home" data-link="/home"><i
                        class="bi bi-arrow-left"></i></button>
                <div id="logo" style="display: flex; align-items: center">

                    <h1 id="menu" class="display-1 montserrat-bold fw-bold mx-auto">PONG</h1>
                </div>
                <article class="d-flex flex-column gap-2">
                    <h2 id="menu" class="display-6 montserrat-bold">Choose your game mode</h2>
                    <button id="start_button" value="pvp" class="btn btn-outline-light full-width btn-lg">1
                        vs 1</button>
                    <button id="start_button2" value="vsa" class="btn btn-outline-light full-width btn-lg">1
                        vs AI</button>
                    <hr>
                    <div class="d-flex flex-column gap-2">
                        <h2 id="menu" class="display-6 montserrat-bold">Tournament</h2>
                        <label for="customRange1" class="form-label">How many players ?</label>
                        <input type="range" class="form-range" min="2" max="6" step="2" id="customRange1">
                        <div class="user_name d-flex flex-column gap-2">
                            <input type="text" class="form-control" id="player_1" placeholder="Player 1">
                            <input type="text" class="form-control" id="player_2" placeholder="Player 2">
                            <input type="text" class="form-control" id="player_2" placeholder="Player 3">
                            <input type="text" class="form-control" id="player_2" placeholder="Player 4">
                        </div>
                    </div>
                    <button id="tournament_button" value="tour" class="btn btn-light">Start Tournament</button>
                </article>
            </div>
        </div>
    </div>
    <div id="test" class="game justify-content-center align-items-center">
    </div>
        `;
    }

    render() {
        fetchMinInfo();
        startWebSocket();
        super.render();
        this.eventListeners();
    }

    eventListeners() {
        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                logoutUser();
            });
        }

        document.getElementById('customRange1').addEventListener('input', function () {
            const range = document.getElementById('customRange1');
            const userNameContainer = document.querySelector('.user_name');
            userNameContainer.innerHTML = '';
            for (let i = 1; i <= range.value; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control';
                input.id = `player_${i}`;
                input.placeholder = `Player ${i}`;
                userNameContainer.appendChild(input);
            }
        });


        ['start_button', 'start_button2', 'tournament_button'].forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', async function () {
                    const existingCanvas = document.querySelector('#pong_canvas');
                    if (existingCanvas) {
                        existingCanvas.remove();
                    }
                    hideElementsByClass('menu');
                    showElementsByClass('game', 'flex');
                    addClassToElementsByClass('game', 'center');
                    try {
                        // PREVENT CACHING ISSUE BY ADDING TIMESTAMP
                        const module = await import(`/static/spa/pong_game.js?timestamp=${new Date().getTime()}`);
                        if (buttonId === 'tournament_button') {
                            let player_name = [];
                            const range = document.getElementById('customRange1');
                            for (let i = 1; i <= range.value; i++) {
                                const player = document.getElementById(`player_${i}`);
                                if (player) {
                                    if (player.value == "") {
                                        player_name.push(`Player ${i}`);
                                    } else 
                                        player_name.push(player.value);
                                }
                            }
                            module.startGame(button.value, player_name);
                        }
                        else {
                            await module.startGame(button.value);
                        }
                    } catch (err) {
                        console.error('Error loading game:', err);
                    }
                });
            }
        });
    }
}