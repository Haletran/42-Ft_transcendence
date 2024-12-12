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
                <article class="d-flex flex-column gap-2">
                    <div class="card w-100 ">
                        <div class="card-header d-flex justify-content-between align-items-center gap-2">
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
                                <i class="bi bi-person"></i> <span id="username"></span>
                            </li>
                            <li class="list-group-item">
                                <i class="bi bi-robot"></i> AI
                            </li>
                        </ul>
                    </div>
                    <p id="error_msg" class="text-danger"></p>
                    <button id="start_button_m" class="btn btn-light full-width btn-lg">Play</button>
                </article>
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

        ['start_button_m'].forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', async function () {
                    hideElementsByClass('menu');
                    showElementsByClass('game', 'flex');
                    addClassToElementsByClass('game', 'center');
                    try {
                        // PREVENT CACHING ISSUE BY ADDING TIMESTAMP
                        let players = ["test", "test2"]
                        const module = await import(`/static/js/monopoly.js?timestamp=${new Date().getTime()}`);
                        await module.init_monopoly_game();
                    }
                    catch (error) {
                        console.error('Error starting game:', error);
                    }
                });
            }
        });
    }
}