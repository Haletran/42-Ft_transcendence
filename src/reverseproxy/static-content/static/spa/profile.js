import { fetchProfileInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';
import { fetchMatchHistory, fetchStatistics } from '../src/scoreTable.js';
import { isUserOnline } from './home.js';
import { logoutUser } from '../src/logout.js';
import { unload } from '../js/utils.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';
import { router, isUserLoggedIn } from '../app.js';


export class Profile extends Page {
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
    <div class="container mt-5">
        <div class="row gap-3">
            <div class="col-md-4">
                <div class="list-group">
                    <a id="choose_param"  href="/profile" data-link="/profile"
                        class="list-group-item list-group-item-action active-menu" aria-current="true">
                        Profile
                    </a>
                    <a id="choose_param" data-link="/settings" 
                        class="list-group-item list-group-item-action">Settings</a>
                    <a id="choose_param" href="/friends" data-link="/friends"
                        class="list-group-item list-group-item-action">Friends</a>
                    <a id="choose_param" href="/privacy" data-link="/privacy"
                        class="list-group-item list-group-item-action">Privacy</a>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Profile Information</h5>
                        <div class="mb-3">
                            <label for="profileUsername">Username</label>
                            <p id="username" class="form-control-plaintext"></p>
                        </div>
                        <div class="mb-3">
                            <label for="profileInput">Email address</label>
                            <p id="email" class="form-control-plaintext"></p>
                        </div>
                        <h5 class="card-title">Pong statistics (against AI)</h5>
                        <div class="d-flex flex-column gap-2">
                            <div class="d-flex flex-row gap-3">
                                <div class="card border-light mb-3">
                                    <div class="card-body">
                                        <p id="total" class="card-text"><strong></strong></p>
                                    </div>
                                </div>
                                <div class="card text-bg-success mb-3">
                                    <div class="card-body">
                                        <p id="wins" class="card-text"><strong></strong></p>
                                    </div>
                                </div>
                                <div class="card text-bg-danger mb-3">
                                    <div class="card-body">
                                        <p id="losses" class="card-text"><strong></strong></p>
                                    </div>
                                </div>
                                <div class="card border-light mb-3">
                                    <div class="card-body">
                                        <p id="rate" class="card-text"><strong></strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h5 class="card-title">Monopoly statistics</h5>
                        <div class="d-flex flex-column gap-2">
                            <div class="d-flex flex-row gap-3">
                                <div class="card border-light mb-3">
                                    <div class="card-body">
                                        <p id="monopoly_total" class="card-text"><strong></strong></p>
                                    </div>
                                </div>
                                <div class="card text-white bg-warning mb-3">
                                    <div class="card-body">
                                        <p id="monopoly_avg_money" class="card-text"><strong>Average winner's money</strong></p>
                                    </div>
                                </div>
                                <div class="card text-white bg-secondary mb-3">
                                    <div class="card-body">
                                        <p id="monopoly_avg_properties" class="card-text"><strong>Average winner's money</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h5 class="card-title">Match History</h5>
                        <div id="match-history-list" class="list-group">
                            <!-- Dynamic content will be added here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 `;
    }
    async render() {
        const loggedIn = isUserLoggedIn();
        if (loggedIn == false) {
            router.goTo('/login_base');
        }
        unload();
        fetchProfileInfo();
        fetchMinInfo();
        fetchStatistics();
        fetchMatchHistory();
        isUserOnline();

        super.render(); // Call the parent render method
        subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });

        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                // event.preventDefault();
                console.log("ABOUT TO LOG OUT");
                logoutUser();
            });
        }
    }
}