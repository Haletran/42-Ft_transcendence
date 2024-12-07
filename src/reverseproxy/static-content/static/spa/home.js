import { Page } from '../src/pages.js';
import { fetchMinInfo } from '../src/fetchUser.js';
import { startWebSocket } from './login_base.js';
import { logoutUser } from '../src/logout.js';

export class HomePage extends Page {
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
                        <a class="dropdown-item fw-bold text-danger" href="/" data-link="/" id="logout-butt">Logout</a>
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
    
    render() {
        fetchMinInfo(); // will go fetch ONLY the profile pic
        startWebSocket();
        super.render();
        
        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                event.preventDefault();
                logoutUser();
            });
        }
    }
}