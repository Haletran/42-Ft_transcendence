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
                    <button id="tournament_button" class="btn btn-light full-width btn-lg">Tournament</button>
                    <article id="dropdown-tour" class="flex-column justify-content-center align-items-center gap-2">
                        <div class="card w-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                How many players?
                                <div>
                                    <button id="add_player" class="btn btn-outline-light"><i
                                            class="bi bi-plus-circle"></i></button>
                                    <button id="rm_player" class="btn btn-outline-light"><i
                                            class="bi bi-dash-circle"></i></button>
                                </div>
                            </div>
                            <ul class="list-group list-group-flush ">

                                <li class="list-group-item bg-grey">
                                    <i class="bi bi-person"></i> bapasqui
                                </li>
                                    <i class="bi bi-robot"></i> AI
                                </li>
                            </ul>
                        </div>
                                <li class="list-group-item">
                                    <i class="bi bi-robot"></i> AI
                                </li>
                            </ul>
                        </div>
                        <p id="error_msg" class="text-danger"></p>
                    </article>
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

        ['start_button', 'start_button2'].forEach(buttonId => {
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
                        await module.startGame();
                    } catch (err) {
                        console.error('Error loading game:', err);
                    }
                });
            }
        });
    }
}