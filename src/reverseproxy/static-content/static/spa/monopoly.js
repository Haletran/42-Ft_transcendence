import { Page } from '../src/pages.js';
import { router, isUserLoggedIn } from '../app.js';
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass, setACookie } from '../js/utils.js';
import { startWebSocket } from './login_base.js';
import { logoutUser } from '../src/logout.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';


export class Monopoly extends Page {
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
        <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: 90vh">
            <div id="menu" class="d-flex flex-column align-items-center gap-3">
                    <button data-link="/home" class="btn btn-outline-light me-auto"><i 
                            class="bi bi-arrow-left"></i></button>
                <div id="logo" style="display: flex; align-items: center">
                    <h1 id="menu" class="display-1 montserrat-bold fw-bold mx-auto">MONOPOLY</h1>
                </div>
                <div class="d-flex flex-column gap-2 w-100">
                    <label for="customRange1" class="form-label">How many players ?</label>
                    <div class="d-flex justify-content-center gap-2">
                        <input type="range" class="form-range" min="2" max="4" step="1" id="customRange1"><span id="rangeValue"></span>
                    </div>
                        <p class="text-muted">2 to 4 players (default 3 players)</p>
                <button class="btn btn-primary w-100 hover-effect" data-bs-toggle="modal" data-bs-target="#monopolyModal">
                  <i class="bi bi-chevron-right"></i> Choose the Monopoly version
                </button>
                    <div class="user_name d-grid gap-2">
                    </div>
                    <div class="container mt-5">
                        <div class="modal fade" id="monopolyModal" tabindex="-1" aria-labelledby="monopolyModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="monopolyModalLabel">Choose the Monopoly version</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">
                                <p class="text-muted">Select a Monopoly map to play with your friends.</p>
                                <div id="mapGrid" class="row g-4">
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button id="saveButton" class="btn btn-primary" disabled>Save changes</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <button id="start_button_m" value="tour" class="btn btn-light w-100" disabled>Play</button>
            </div>
        </div>
    </div>
    <div class="game justify-content-center align-items-center">
    </div>
        `;
    }
    async render() {
        const loggedIn = isUserLoggedIn();
        if (loggedIn == false) {
            router.goTo('/login_base');
            return;
        }
        fetchMinInfo();
        startWebSocket();
        super.render();
        this.eventListeners();
        setACookie('game_running', 'false', 1);
        subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });
        this.render_modal();
    }


    render_modal() {
        const monopolyMaps = [
            { id: 1, name: "Classic", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FB4V-r4_CQAItF9A.jpg&f=1&nofb=1&ipt=c476ef91a21b4d46b6bfebe15ab644c75e35a12053dfdc600a15f30569d6aed6&ipo=images" },
            { id: 2, name: "Fortnite", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpreview.redd.it%2Fgd2p5dfl1e101.jpg%3Fauto%3Dwebp%26s%3D1e2731864f99e10ff3f107c9a9637003786e1699&f=1&nofb=1&ipt=743bb7acf6987b89dda98f65027c3f947a4aa04ba06b9900b8e0116f2ea564b7&ipo=images" },
        ];

        let selectedMap = null;

        const mapGrid = document.getElementById("mapGrid");
        monopolyMaps.forEach(map => {
            const col = document.createElement("div");
            col.className = "col-6";

            const card = document.createElement("div");
            card.className = "card cursor-pointer";
            card.dataset.id = map.id;
            card.innerHTML = `
              <img src="${map.image}" class="card-img-top" alt="${map.name}">
              <div class="card-body">
                <p class="card-text text-center">${map.name}</p>
              </div>
            `;
            card.addEventListener("click", () => handleMapSelect(map.id, card));
            col.appendChild(card);
            mapGrid.appendChild(col);
        });

        const handleMapSelect = (mapId, cardElement) => {
            selectedMap = mapId;
            document.querySelectorAll(".card").forEach(card => card.classList.remove("selected"));
            cardElement.classList.add("selected");
            document.getElementById("saveButton").disabled = false;
        };

        document.getElementById("saveButton").addEventListener("click", () => {
            if (selectedMap) {
                console.log("Selected Map ID:", selectedMap);
                const modal = bootstrap.Modal.getInstance(document.getElementById("monopolyModal"));
                modal.hide();
                document.getElementById("start_button_m").disabled = false;
            }
        });
    }

    eventListeners() {
        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                logoutUser();
                unsubscribe();
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
            const rangeValue = document.getElementById('rangeValue');
            rangeValue.innerHTML = range.value;
        });

        ['start_button_m'].forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', async function () {
                    hideElementsByClass('menu');
                    showElementsByClass('game', 'flex');
                    addClassToElementsByClass('game', 'center');
                    try {
                        const range = document.getElementById('customRange1');
                        const map = document.querySelector('.selected');
                        const module = await import(`/static/js/monopoly.js?timestamp=${new Date().getTime()}`);
                        console.log(map.dataset.id);
                        await module.init_monopoly_game(range.value, map.dataset.id);
                    }
                    catch (error) {
                        console.error('Error starting game:', error);
                    }
                });
            }
        });
    }
}