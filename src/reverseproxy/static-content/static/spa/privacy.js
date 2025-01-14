import { getUserInfos } from "../src/fetchUser.js";
import { isUserOnline } from "./home.js";
import { Page } from '../src/pages.js';
import { logoutUser } from "../src/logout.js";
import { getCSRFToken } from "../src/csrf.js";
import { deleteAccount } from "../src/logout.js";
import { unload, showToast } from '../js/utils.js';
import { router, isUserLoggedIn } from '../app.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';


export class Privacy extends Page {

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
            class="list-group-item list-group-item-action" aria-current="true">
            Profile
            </a>
            <a id="choose_param" data-link="/settings" 
            class="list-group-item list-group-item-action">Settings</a>
            <a id="choose_param" href="/friends" data-link="/friends"
            class="list-group-item list-group-item-action">Friends</a>
            <a id="choose_param" href="/privacy" data-link="/privacy"
            class="list-group-item list-group-item-action active-menu" aria-current="true">Privacy</a>
            </div>
            </div>
            <div class="col">
            <div class="card">
            <div class="card-body">
            <h3 class="card-title">Terms and Conditions</h3>
            <p class="text-muted">Effective date: December 2024</p>
            <p class="card-text">
                Welcome to ft_transcendence. These terms and conditions govern your use of our website, services, and any related content. By accessing or using ft_transcendence, you agree to comply with and be bound by these terms.
            </p>
            <p class="card-text">
                To access the website, play the two games available, send friend requests, and see your results history, you are required to create an account. To do so, you need to agree to provide a username and an email (no emails will be sent), and optionally a profile picture. Other users will be able to send you friend requests using either your username or your email.
            </p>
            <p class="card-text">
                Additionally, all your game results may be collected by us to provide statistics and a record of the games you played. Please note that this data may be accessible to your friends.
            </p>
            <p class="card-text">
                <strong>These terms are construed in accordance with the General Data Protection Regulation (GDPR)</strong>, which guarantees that all data is processed by us in accordance with the principles outlined in Article 5.1-2:
            </p>
            <ul>
                <li>Lawfulness, fairness, and transparency — Processing must be lawful, fair, and transparent to the data subject.</li>
                <li>Purpose limitation — You must process data for the legitimate purposes specified explicitly to the data subject when you collected it.</li>
                <li>Data minimization — You should collect and process only as much data as absolutely necessary for the specified purposes.</li>
                <li>Accuracy — You must keep personal data accurate and up to date.</li>
                <li>Storage limitation — You may only store personally identifying data for as long as necessary for the specified purpose.</li>
                <li>Integrity and confidentiality — Processing must be done in such a way as to ensure appropriate security, integrity, and confidentiality (e.g., by using encryption).</li>
                <li>Accountability — The data controller is responsible for being able to demonstrate GDPR compliance with all of these principles.</li>
            </ul>
            <p class="card-text">
                If you wish to learn more about the GDPR, please follow this <a href="https://gdpr-info.eu/" target="_blank" id="gdpr-link">link.</a>
            </p>
            <p class="card-text">
                <strong>At any time, you will find these terms and conditions, in addition to privacy settings to monitor our use of your data, under the Privacy section.</strong>
            </p>
            <p class="card-text">
                <strong>We will not share your data with any third party, and if you wish to delete your match history or delete your account, this data will be permanently erased from our databases.</strong>
            </p>
            </div>
            </div>
            <br>
            <div class="card">
            <div class="card-body mt-2">
            <h3 class="card-title">Privacy options</h3>
            <p class="card-text text-muted">Here you can update your privacy settings.</p>
            <button type="button" class="btn btn-danger me-2 mb-2" id="propic-btn">Delete profile picture</button>
            <button type="button" class="btn btn-danger mb-2" id="match-btn">Delete match history</button>
            <form id="privacy_form">
                <div class="mb3 form-check">
                <input class="form-check-input" type="checkbox" id="matchHistory">
                <label class="form-check-label" for="matchHistory">Do not keep track of my match history</label>
                </div>
                <div class="mb3 form-check">
                <input class="form-check-input" type="checkbox" id="displayFriends">
                <label class="form-check-label" for="displayFriends">Do not display my profile informations to my friends</label>
                </div>
                <button id="update_privacy" type="submit" class="btn btn-light mt-3">Update privacy settings</button>
            </form>
            <button type="button" class="btn btn-danger mt-3" id="delete_button">Delete my account</button>
            <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                <h5 class="modal-title" id="confirmationModalLabel">Confirm Account Deletion</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                Are you sure you want to delete your account? This action cannot be undone.
                  </div>
                  <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteButton">Yes, Delete</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
            </div>
        </div>
            <div aria-live="polite" aria-atomic="true" class="position-relative">
                <div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>
            </div>
        </div>
        <br>
         `;
    }
    async render() {
        const loggedIn = isUserLoggedIn();
        if (loggedIn == false) {
            router.goTo('/login_base');
        }
        fetchMinInfo();
        unload();
        isUserOnline();
        super.render();

        subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });

        const userData = await getUserInfos();
        userData.match_history == true ? document.getElementById('matchHistory').checked = false : document.getElementById('matchHistory').checked = true;
        userData.display_friends == true ? document.getElementById('displayFriends').checked = false : document.getElementById('displayFriends').checked = true;

        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                event.preventDefault();
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

                    const response = await fetch('/api/credentials/update_profile/', {
                        method: 'POST',
                        headers: { 'X-CSRFToken': csrfToken, },
                        credentials: 'include',
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        this.render();
                        showToast('Profile picture updated successfully', 'success');
                    } else {
                        const error = await response.json();
                        showToast('Edit failed: ' + error.message, 'error');
                    }
                } catch (error) {
                    showToast('An error occurred: ' + error.message, 'error');
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
                        showToast('Match history cleared successfully', 'success');
                    }
                    else {
                        showToast('Match history clear failed: ' + data.message, 'error');
                    }

                } catch (error) {
                    showToast('An error occurred: ' + error.message, 'error');
                    alert('An error occurred: ' + error.message);
                }

            });
        }


        let matchHistoryBOOL = userData.match_history;
        let friendsBOOL = userData.display_friends;

        const matchHistory = document.getElementById('matchHistory');
        matchHistory.addEventListener('change', function () {
            if (this.checked) {
                matchHistoryBOOL = false;
                console.log(matchHistoryBOOL);
            } else {
                matchHistoryBOOL = true;
                console.log(matchHistoryBOOL);
            }
        });

        const displayFriends = document.getElementById('displayFriends');
        displayFriends.addEventListener('change', function () {
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
                    this.render();
                    showToast('Privacy settings updated successfully', 'success');
                } else {
                    const error = await response.json();
                    showToast('Privacy edit failed: ' + error.message, 'error');
                    console.error('Privacy edit failed:', error);
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('An error occurred: ' + error.message, 'error');
            }
        });

        const deleteButton = document.getElementById('delete_button');
        deleteButton.addEventListener('click', async (e) => {
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
        });

        document.getElementById('confirmDeleteButton').addEventListener('click', function () {
            deleteAccount();
            alert('Your account has been deleted.');
            const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
            confirmationModal.hide();
        });

    }
}
