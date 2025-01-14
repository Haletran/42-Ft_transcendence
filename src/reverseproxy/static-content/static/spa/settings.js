import { Page } from '../src/pages.js';
import { router, isUserLoggedIn } from '../app.js';
import { fetchSettingsInfo, getUserInfos } from '../src/fetchUser.js';
import { getCSRFToken } from '../src/csrf.js';
import { setupProfilePictureSelection } from '../js/event.js';
import { logoutUser } from '../src/logout.js';
import { isUserOnline } from './home.js';
import { unload, showToast } from '../js/utils.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';


export class Settings extends Page {
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
                        class="list-group-item list-group-item-action  active-menu">Settings</a>
                    <a id="choose_param" href="/friends" data-link="/friends"
                        class="list-group-item list-group-item-action">Friends</a>
                    <a id="choose_param" href="/privacy" data-link="/privacy"
                        class="list-group-item list-group-item-action">Privacy</a>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Settings</h5>
                        <p class="card-text">Here you can update your profile information.</p>
                        <form id="profile_form">
                        <div class="form-floating mb-3">
                            <input type="username" value="" class="form-control" id="floatingUsername"
                                placeholder="exusername">
                            <label for="floatingUsername">Username</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="email" value="" class="form-control" id="floatingInput"
                                placeholder="name@example.com">
                            <label for="floatingInput">Email address</label>
                        </div>
                        <div class="form-floating">
                            <input type="password" value="" class="form-control" id="floatingPassword"
                                placeholder="Password">
                            <label for="floatingPassword">Password</label>
                        </div>
                        <br>
                        <h5 class="card-title">Profile Picture</h5>
                        <p class="card-text">Here you can update your profile picture.</p>
                        <div id="choice_pp" class="d-flex justify-content-center">
                            <img id="actual_pp"
                                src=""
                                alt="profile_picture_main" class="rounded-circle pp">
                        </div>
                        <br>
    			        <input type="file" id="customProfilePicture" name="customProfilePicture" accept=".jpg, .jpeg, .gif, .png" class="form-control">
                        <button id="update_info" type="submit" class="btn btn-light mt-3">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div aria-live="polite" aria-atomic="true" class="position-relative">
            <div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>
        </div>
    </div>
    `
            ;
    }
    async render() {
        const loggedIn = isUserLoggedIn();
        if (loggedIn == false) {
            router.goTo('/login_base');
        }
        fetchMinInfo();
        unload();
        fetchSettingsInfo();
        isUserOnline();
        super.render();
        setupProfilePictureSelection();
        this.attachFormListener();

        subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });
        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                logoutUser();
            });
        }
    }

    async attachFormListener() {
        const form = document.getElementById('profile_form');

        const profileInput = document.getElementById('customProfilePicture');
        profileInput.addEventListener('change', () => {
            console.log("Uploaded file:", profileInput.files[0]);
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            let email = document.getElementById('floatingInput').value;
            let username = document.getElementById('floatingUsername').value;
            const password = document.getElementById('floatingPassword').value;

            const _42auth = await getUserInfos();
            console.log(_42auth);
            if (_42auth.forty_two) {
                showToast('You are authenticated with 42, you cannot change your profile', 'danger');
                return;
            }

            // check for whitespaces in username and email
            username = username.trim();
            email = email.trim();
            if (username.search(' ') != -1 || email.search(' ') != -1) {
                showToast('Username and email cannot contain whitespaces', 'danger');
                return;
            }

            // Prepare the data to send
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);


            if (profileInput.files[0]) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
                if (!allowedTypes.includes(profileInput.files[0].type)) {
                    showToast('Invalid file type (allowed: jpg, jpeg, gif, png)', 'danger');
                    return;
                }
                if (profileInput.files[0].size > 1024 * 1024) {
                    showToast('File is too big (max 1MB)', 'danger');
                    return;
                }
                const isValid = await checkImageType(profileInput.files[0]);
                if (isValid === false) { return; }
                formData.append('profile_picture', profileInput.files[0]);
            }
            try {

                const csrfToken = getCSRFToken('csrftoken');
                if (!csrfToken) {
                    console.error('CSRF token is missing!');
                }

                // Send data to the backend
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
                    showToast('Profile updated successfully', 'success');
                } else {
                    const error = await response.json();
                    console.log('Edit failed:', error);
                    showToast('Edit failed: ' + error.message, 'danger');
                }
            } catch (error) {
                showToast('An error occurred: ' + error.message, 'danger');
            }
        });

    }
}

export function checkImageType(file) {
    return new Promise((resolve, reject) => {
        if (file) {
            const URL = window.URL || window.webkitURL;
            const image = new Image();
            const imageUrl = URL.createObjectURL(file);
            image.src = imageUrl;

            image.onload = function () {
                console.log('Valid image');
                resolve(true);
            }
            image.onerror = function () {
                alert('Invalid image');
                resolve(false);
            }
        } else {
            reject(new Error('No file provided'));
        }
    });
}