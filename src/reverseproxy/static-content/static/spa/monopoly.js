import { fetchMinInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass } from '../js/utils.js';
import { startWebSocket } from './login_base.js';
import { logoutUser } from '../src/logout.js';


export class Monopoly extends Page {
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
                </ul>
            </div>
        </nav>
    </div>
    <div class="menu">
        <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: 90vh">
            <div id="menu" class="d-flex flex-column align-items-center gap-3">
                <button data-link="/home" class="btn btn-outline-light me-auto"><i 
                        class="bi bi-arrow-left"></i></button>
                <div id="logo" style="display: flex; align-items: center">
                    <h1 id="menu" class="display-1 montserrat-bold fw-bold mx-auto">MONOPOLY</h1>
                </div>
                <div class="d-flex flex-column gap-2">
                    <label for="customRange1" class="form-label">How many players ?</label>
                    <input type="range" class="form-range" min="2" max="6" step="2" id="customRange1">
                    <div class="user_name d-grid gap-2">
                        <input type="text" class="form-control" id="player_1" placeholder="Player 1">
                        <input type="text" class="form-control" id="player_2" placeholder="Player 2">
                        <input type="text" class="form-control" id="player_3" placeholder="Player 3">
                        <input type="text" class="form-control" id="player_4" placeholder="Player 4">
                    </div>
                </div>
                <button id="start_button_m" value="tour" class="btn btn-light">Play</button>
            </div>
        </div>
    </div>
    <div class="game justify-content-center align-items-center">
    </div>
        `;
    }
    render() {
        fetchMinInfo();
        startWebSocket();
        super.render(); // Call the parent render method
        this.eventListeners();
    }

    eventListeners() {
        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
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


        // document.addEventListener('DOMContentLoaded', function () {
        //     const rangeInput = document.getElementById('customRange1');
        //     rangeInput.value = 4;
        //     rangeInput.focus();
        // });

        ['start_button_m'].forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', async function () {
                    hideElementsByClass('menu');
                    showElementsByClass('game', 'flex');
                    addClassToElementsByClass('game', 'center');
                    try {
                        // PREVENT CACHING ISSUE BY ADDING TIMESTAMP
                        // ADD CHOICE OF NB PLAYERS
                        const range = document.getElementById('customRange1');
                        const module = await import(`/static/js/monopoly.js?timestamp=${new Date().getTime()}`);
                        await module.init_monopoly_game(range.value);
                    }
                    catch (error) {
                        console.error('Error starting game:', error);
                    }
                });
            }
        });
    }
}