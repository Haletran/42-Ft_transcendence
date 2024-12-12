import { fetchMinInfo, getUserInfos } from "../src/fetchUser.js";
import { isUserOnline } from "./home.js";
import { Page } from '../src/pages.js';
import { logoutUser } from "../src/logout.js";
import { getCSRFToken } from "../src/csrf.js";
import { Router } from '../src/router.js';
import { deleteAccount } from "../src/logout.js";

export class Privacy extends Page {
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
                        <a class="dropdown-item" href="/friends" data-link="/friends" >Friends</a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/privacy" data-link="/privacy" >Privacy</a>
                    </li>
                    <li>
                        <a class="dropdown-item fw-bold text-danger" href="/" data-link="/" id="logout-butt">Logout</a>
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
                        class="list-group-item list-group-item-action" aria-current="true">
                        Profile
                    </a>
                    <a id="choose_param" data-link="/settings" 
                        class="list-group-item list-group-item-action">Settings</a>
                    <a id="choose_param" href="/friends" data-link="/friends"
                        class="list-group-item list-group-item-action">Friends</a>
                    <a id="choose_param" href="/privacy" data-link="/privacy"
                        class="list-group-item list-group-item-action active" aria-current="true">Privacy</a>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">EU's General Data Protection Regulation (GDPR)</h5>
                        <h5 class="card-title">What we do with your data</h5>
                        <h5 class="card-title">Privacy options</h5><br>
                            <button type="button" class="btn btn-danger" id="propic-btn">Delete profile picture</button>
                            <button type="button" class="btn btn-danger" id="match-btn">Delete match history</button><br>
                            <br><form id="privacy_form">
                            <div class="mb3 form-check">
                                <input class="form-check-input" type="checkbox" id="matchHistory">
                                <label class="form-check-label" for="matchHistory">Do not keep track of my match history</label>
                            </div> <br>
                            <div class="mb3 form-check">
                                <input class="form-check-input" type="checkbox" id="displayFriends">
                                <label class="form-check-label" for="displayFriends">Do not display my profile informations to my friends</label>
                            </div>
                            <button id="update_privacy" type="submit" class="btn btn-light mt-3">Update privacy settings</button>
                            </form><br>
                            <button type="button" class="btn btn-danger" id="delete_button">Delete my account</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
 `;
    }
    async render() {
        isUserOnline();
        fetchMinInfo();

        super.render();

        // update checkboxes value
        const userData = await getUserInfos();
        console.log('display_friends: ', userData.display_friends, ' match_history: ', userData.match_history);
        userData.match_history == true ? document.getElementById('matchHistory').checked = false : document.getElementById('matchHistory').checked = true;
        userData.display_friends == true ? document.getElementById('displayFriends').checked = false : document.getElementById('displayFriends').checked = true;
        
        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                //event.preventDefault();
                logoutUser();
            });
        }

        const ProfilePictureButton = document.getElementById('propic-btn');
        if (ProfilePictureButton) {
            ProfilePictureButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const formData = new FormData();

                let defaultFileBlob = null;
                
                try {

                    const responseBlob = await fetch('/static/imgs/gaston.jpg');
                    const blob = await responseBlob.blob();
                    defaultFileBlob = new File([blob], 'default-profile.jpg', { type: blob.type });
                    formData.append('profile_picture', defaultFileBlob);

                    console.log('In update profile, data to send: ', formData);


                    const csrfToken = getCSRFToken('csrftoken');
                    if (!csrfToken) {
                        console.error('CSRF token is missing!');
                    }
    
                    // Send data to the backend
                    console.log('about to go back to default profile picture');
                    const response = await fetch('/api/credentials/update_profile/', {
                        method: 'POST',
                        headers: { 'X-CSRFToken': csrfToken, },
                        credentials: 'include',
                        body: formData,
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        console.log('Edit successful:', result);
                        this.render();
                    } else {
                        const error = await response.json();
                        console.error('Edit failed:', error);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred: ' + error.message);
                }
            });
        }

        const deleteMatch = document.getElementById('match-btn');
        if (deleteMatch) {
            deleteMatch.addEventListener('click', async (event) => {
                event.preventDefault();

                const userData = await getUserInfos();
                const username = userData.username;

                console.log(username);

                const formData = new FormData();
                formData.append('username', username);

                try {

                    const csrfToken = getCSRFToken('csrftoken');
                    if (!csrfToken) {
                        console.error('CSRF token is missing!');
                    }

                    const response = await fetch(`/api/scores/clear_match_history/`, {
                        method: 'POST',
                        headers: { 'X-CSRFToken': csrfToken, },
                        credentials: 'include',
                        body: formData,
                    });

                    const data = await response.json();
                    if (response.ok) {
                        console.log("Match history cleared");
                    }
                    else {
                        console.error('Error when clearing history:', data);
                    }

                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred: ' + error.message);
                }

            });
        }


        let matchHistoryBOOL = userData.match_history;
        let friendsBOOL = userData.display_friends;

        const matchHistory = document.getElementById('matchHistory');
        matchHistory.addEventListener('change', function() {
            if (this.checked) {
                matchHistoryBOOL = false;
                console.log(matchHistoryBOOL);
            } else {
                matchHistoryBOOL = true;
                console.log(matchHistoryBOOL);
            }
        });

        const displayFriends = document.getElementById('displayFriends');
        displayFriends.addEventListener('change', function() {
            if (this.checked) {
                friendsBOOL = false;
                console.log(friendsBOOL);
            } else {
                friendsBOOL = true;
                console.log(friendsBOOL);
            }
        });

        const form = document.getElementById('privacy_form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            // console.log('display_friends: ', userData.display_friends, ' match_history: ', userData.match_history);
            formData.append('matchHistory', matchHistoryBOOL);
			formData.append('friendsDisplay', friendsBOOL);
            try {

                const csrfToken = getCSRFToken('csrftoken');
                if (!csrfToken) {
                    console.error('CSRF token is missing!');
                }
                const response = await fetch('/api/credentials/update_profile/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Privacy edit successful:', result);
                    this.render();
                } else {
                    const error = await response.json();
                    console.error('Privacy edit failed:', error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            }
        });

        const deleteButton = document.getElementById('delete_button');
        deleteButton.addEventListener('click', async (e) => {
            deleteAccount();
        });

    }
}