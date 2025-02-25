import { Page } from '../src/pages.js';
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass, unload, setACookie } from '../js/utils.js';
import { startWebSocket } from './login_base.js';
import { logoutUser } from '../src/logout.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';
import { getProfileUsername } from '../src/fetchUser.js';
import { router, isUserLoggedIn } from '../app.js';


export class Pong extends Page {
    constructor() {
        super();
        this.template = `
                <div class="header">
        <nav class="navbar bg-dark  border-body" data-bs-theme="dark">
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
                <a class="dropdown-item" href="/friends" data-link="/friends" >Friends</a>
                </li>
                <li>
                <a class="dropdown-item" href="/privacy" data-link="/privacy" >Privacy</a>
                </li>
                <li>
                <a class="dropdown-item fw-bold text-danger" href="/" data-link="/" id="logout-butt"><i class="bi bi-box-arrow-left"></i> Logout</a>
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
                <button id="settings_button" class="btn btn-outline-info full-width btn-lg">
                    <i class="bi bi-gear-fill"></i> Settings
                </button>
                <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="settingsModalLabel">Game Settings</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                        <div class="col mb-3">
                            <label for="playerColor" class="form-label">Player Color</label>
                            <input type="color" class="form-control form-control-color" id="playerColor" value="#ffffff">
                        </div>
                        <div class="col mb-3">
                            <label for="ballColor" class="form-label">Ball Color</label>
                            <input type="color" class="form-control form-control-color" id="ballColor" value="#000000">
                        </div>
                        </div>
                        <div class="row">
                        <div class="col mb-3">
                            <label for="mapColor" class="form-label">Map Color</label>
                            <input type="color" class="form-control form-control-color" id="mapColor" value="#000000">
                        </div>
                        <div class="col mb-3">
                            <label for="textColor" class="form-label">Text Color</label>
                            <input type="color" class="form-control form-control-color" id="textColor" value="#000000">
                        </div>
                        <div class="col mb-3">
                            <label for="powerUp" class="form-label">Power Up</label>
                            <input type="checkbox" class="form-check-input" id="powerUp">
                        </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="resetSettings">RESET</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="saveSettings">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>
                <div class="modal fade" id="1v1Modal" tabindex="-1" aria-labelledby="1v1ModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="1v1ModalLabel">Choose display names</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="player1name">Player 1 name</label>
                                <input type="name" class="form-control" id="player1name" placeholder="enter name (less than 10 char)">
                            </div><br>
                            <div class="form-group">
                                <label for="player2name">Player 2 name</label>
                                <input type="name" class="form-control" id="player2name" placeholder="enter name (less than 10 char)">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-secondary" id="Start1v1">Play</button>
                    </div>
                    </div>
                </div>
                </div>
                <div class="accordion" id="accordionExample">
                <div class="accordion-item text-align-center">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <h3 id="menu" ><i class="bi bi-trophy-fill"></i> Tournament</h3>
                    </button>
                  </h2>
                  <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                    <div class="d-flex flex-column gap-2">
                        <label for="customRange1" class="form-label">How many players ?</label>
                        <div class="d-flex justify-content-center gap-2">
                        <input type="range" class="form-range" min="4" max="8" step="4" id="customRange1"><span id="rangeValue"></span>
                        </div>
                        <div class="user_name d-flex flex-column gap-2">
                            <input type="text" class="form-control" id="player_1" placeholder="Player 1">
                            <input type="text" class="form-control" id="player_2" placeholder="Player 2">
                            <input type="text" class="form-control" id="player_2" placeholder="Player 2">
                            <input type="text" class="form-control" id="player_2" placeholder="Player 4">
                        </div>
                        <button id="tournament_button" value="tour" class="btn btn-light" disabled=true>Start Tournament</button>
                    </div>
                    </div>
                  </div>
                </div>
                </div>
            </article>
            </div>
        </div>
        </div>
        <div id="test" class="game justify-content-center align-items-center position-relative">
            <button id="pause_button" class="btn btn-outline-light position-absolute position-absolute top-0 start-50 translate-middle"><i class="bi bi-pause-fill"></i></button>
        </div>
        `;
    }

    async render() {
        const loggedIn = isUserLoggedIn();
        if (loggedIn == false) {
            router.goTo('/login_base');
            return;
        }
        unload();
        fetchMinInfo();
        startWebSocket();
        super.render();
        this.eventListeners();
        subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });
    }

    eventListeners() {
        const settingsButton = document.getElementById('settings_button');
        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
                modal.show();
            });
        }
        const saveSettingsButton = document.getElementById('saveSettings');
        if (saveSettingsButton) {
            saveSettingsButton.addEventListener('click', () => {
                const playerColor = document.getElementById('playerColor').value;
                const ballColor = document.getElementById('ballColor').value;
                const mapColor = document.getElementById('mapColor').value;
                const textColor = document.getElementById('textColor').value;
                const powerUp = document.getElementById('powerUp').checked;
                localStorage.setItem('playerColor', playerColor);
                localStorage.setItem('ballColor', ballColor);
                localStorage.setItem('mapColor', mapColor);
                localStorage.setItem('textColor', textColor);
                localStorage.setItem('powerUp', powerUp);
                const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
                modal.hide();
            });
        }
        const playerColorInput = document.getElementById('playerColor');
        const mapColorInput = document.getElementById('mapColor');
        const ballColorInput = document.getElementById('ballColor');
        const textColorInput = document.getElementById('textColor');
        const powerUpInput = document.getElementById('powerUp');
        if (playerColorInput && mapColorInput && ballColorInput && textColorInput) {
            playerColorInput.value = localStorage.getItem('playerColor') || '#ffffff';
            ballColorInput.value = localStorage.getItem('ballColor') || '#ffffff';
            mapColorInput.value = localStorage.getItem('mapColor') || '#282931';
            textColorInput.value = localStorage.getItem('textColor') || '#ffffff';
            powerUpInput.checked = localStorage.getItem('powerUp') === 'true';
        }

        const resetSettingsButton = document.getElementById('resetSettings');
        if (resetSettingsButton) {
            resetSettingsButton.addEventListener('click', () => {
                localStorage.removeItem('playerColor');
                localStorage.removeItem('ballColor');
                localStorage.removeItem('mapColor');
                localStorage.removeItem('textColor');
                localStorage.removeItem('powerUp');
                playerColorInput.value = '#ffffff';
                ballColorInput.value = '#ffffff';
                mapColorInput.value = '#282931';
                textColorInput.value = '#ffffff';
                powerUpInput.checked = false;
            });
        }

        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                logoutUser();
            });
        }
        let rangelengthCheck;

        document.getElementById('customRange1').addEventListener('input', function () {
            const tour_button = document.getElementById('tournament_button');
            if (tour_button) {
                tour_button.disabled = false;
            }
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
            const rangeValue = document.getElementById('rangeValue');
            rangeValue.innerHTML = range.value;
            rangelengthCheck = range.value; // pour plus tard
        });


        document.querySelectorAll('.accordion-button').forEach(button => {
            button.addEventListener('click', function () {
                const rangeInput = document.getElementById('customRange1');
                rangeInput.value = 4;
                rangeInput.focus();
            });
        });


        let gameInProgress = false;

        ['start_button', 'start_button2', 'tournament_button'].forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', async function () {
                    if (gameInProgress) {
                        return;
                    }

                    if (buttonId === 'start_button') {
                        const modal = new bootstrap.Modal(document.getElementById('1v1Modal'));
                        modal.show();

                        const play = document.getElementById('Start1v1');
                        play.addEventListener('click', async () => {
                            let player1 = document.getElementById('player1name').value;
                            let player2 = document.getElementById('player2name').value;

                            player1 = player1.trim() || 'player1';
                            player2 = player2.trim() || 'player2';

                            if (player1.search(' ') != -1 || player2.search(' ') != -1 || player2.search('\t') != -1) {
                                alert("no space allowed in fields");
                                document.getElementById('player1name').value = "";
                                document.getElementById('player2name').value = "";
                                modal.hide();
                            }
                            else if (player1.length > 10 || player2.length > 10) {
                                alert("display name is 10 char max");
                                document.getElementById('player1name').value = "";
                                document.getElementById('player2name').value = "";
                                modal.hide();
                            } else {
                                document.getElementById('player1name').value = "";
                                document.getElementById('player2name').value = "";
                                modal.hide();
                                gameInProgress = true;
                                try {
                                    await startthegame(button, buttonId, player1, player2);
                                } finally {
                                    gameInProgress = false;
                                }
                            }
                        }, { once: true });
                    } else if (buttonId === 'start_button2' || buttonId === 'tournament_button') {
                        gameInProgress = true;
                        try {
                            const player1 = await getProfileUsername();
                            await startthegame(button, buttonId, player1, 'player2');
                        } finally {
                            gameInProgress = false;
                        }
                    }
                });
            }
        });

    }
}

async function startthegame(button, buttonId, player1, player2) {
    const existingCanvas = document.querySelector('#pong_canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    hideElementsByClass('menu');
    showElementsByClass('game', 'flex');
    addClassToElementsByClass('game', 'center');
    try {
        let winner = 0;
        const module = await import(`/static/spa/pong_game.js?timestamp=${new Date().getTime()}`);
        setACookie('game_running', 'true', 1);
        localStorage.setItem('username', player1);
        localStorage.setItem('username2', player2);
        if (buttonId === 'tournament_button') {
            let player_name = [];
            const range = document.getElementById('customRange1');
            for (let i = 1; i <= range.value; i++) {
                const player = document.getElementById(`player_${i}`);
                if (player) {
                    if (player.value == "") {
                        player_name.push(`Player ${i}`);
                    } else {
                        if (player.value.length > 10) {
                            player_name.push(`Player ${i}`);
                        }
                        else if (player.value.trim().search(' ') != -1 || player.value.trim().search('\t') != -1 || player.value.trim() == "") {
                            player_name.push(`Player ${i}`);
                        }
                        else
                            player_name.push(player.value.trim());
                    }
                }
            }
            winner = await module.startGame(button.value, player_name);
            setACookie('game_running', 'false', 1);
        }
        else {
            winner = await module.startGame(button.value);
            setACookie('game_running', 'false', 1);
        }
    } catch (err) {
        console.error('Error loading game:', err);
    }
}