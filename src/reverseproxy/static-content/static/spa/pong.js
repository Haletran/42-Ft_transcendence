import { fetchSettingsInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass } from '../js/utils.js';

export class Pong extends Page {
    constructor() {
        super();
        this.template = `
                    <div class="header">
        <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand " href="/" data-link="/">
                    <img src="/static/imgs/logo.png" alt="" width="25" class="d-inline-block align-text-top invert">
                    <p class="d-inline montserrat-bold">Ft_transcendence</p>
                </a>
                <a class="nav-link active" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img alt="Logo" width="40" height="40" class="rounded-circle" style="
                              object-fit: cover;
                            " src="https://cdn.intra.42.fr/users/65ca7a946948378f5cf99fb253ea4907/bapasqui.jpg"
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
                        <a class="dropdown-item fw-bold text-danger" href="/chat" data-link="/chat" >Logout</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    <div class="menu">
        <div class="container-fluid d-flex justify-content-center align-items-center center">
            <div id="menu" class="d-flex flex-column align-items-center gap-2">
                <button onclick="window.history.back()" class="btn btn-outline-light me-auto"><i
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
    <div class="game justify-content-center align-items-center">
        <canvas id="pong_canvas" style="display: none;"></canvas>
    </div>
        `;
    }

    render() {
        fetchSettingsInfo();
        super.render();

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

        // ['start_button', 'start_button2'].forEach(buttonId => {
        //     const button = document.getElementById(buttonId);
        //     if (button) {
        //         button.addEventListener('click', function () {
        //             hideElementsByClass('menu');
        //             showElementsByClass('game', 'flex');
        //             addClassToElementsByClass('game', 'center');
        //             document.getElementById('pong_canvas').style.display = 'block';
        //             game(this.value);
        //         });
        //     }
        // });

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