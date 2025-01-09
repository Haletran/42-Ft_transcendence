import { Page } from '../src/pages.js';
import { logoutUser } from '../src/logout.js';
import { startWebSocket } from './login_base.js';
import { getACookie, setACookie } from '../js/utils.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';
import { isUserLoggedIn, router } from '../app.js';


export class HomePage extends Page {
    constructor() {
        super();
        this.template = `
      <div class="header">
        <nav class="navbar bg-dark border-body" data-bs-theme="dark">
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
    <div class="app">
        <div class="container d-flex flex-column justify-content-center align-items-center gap-3"
            style="min-height: 90vh">
            <div class="block flex-row gap-2 p-5 animate__animated animate__backInDown"
                data-link="/pong">
                <img class="invert" src="/static/imgs/logo.png" alt="pong_logo" width="30">
                <h1 class="montserrat-bold fs-1">Pong</h1>
            </div>
            <div class="block gap-2 p-5 flex-row animate__animated animate__backInUp"
                data-link="/monopoly">
                <img class="invert" src="/static/imgs/dice.png" alt="dice_logo" width="40">
                <h1 class="montserrat-bold fs-1">Monopoly</h1>
            </div>
        </div>
    </div>
	  `;
    }

    async render() {
        const loggedIn = await isUserLoggedIn();
        if (loggedIn == false) {
            router.goTo('/login_base');
            return;
        }
        setACookie('game_running', 'false', 1);
        fetchMinInfo();
        isUserOnline();
        super.render();
        const unsubscribe = subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });

        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                unsubscribe();
                logoutUser();
            });
        }
    }
}


export async function isUserOnline() {
    try {
        const response = await fetch('/api/credentials/is_online/', {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            if (data.is_online == false)
                startWebSocket();
        }
        else {
            throw new Error('Error fetching online status');
        }
    } catch (error) {
        console.error("Error fetching online status");
    }

}

export async function isFriendOnline(username) {
    try {
        const response = await fetch(`/api/credentials/is_online/?user=${username}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            return data.is_online;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}