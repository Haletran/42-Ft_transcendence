import { Page } from '../src/pages.js';
import { Router } from '../src/router.js';
import { fetchSettingsInfo } from '../src/fetchUser.js';
import { getCSRFToken } from '../src/csrf.js';
import { setupProfilePictureSelection } from '../js/event.js';

export class Settings extends Page {
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
                        <a class="dropdown-item fw-bold text-danger" href="/" data-link="/" >Logout</a>
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
                        class="list-group-item list-group-item-action  active">Settings</a>
                    <a id="choose_param" href="/friends" data-link="/friends"
                        class="list-group-item list-group-item-action">Friends</a>
                    <a id="choose_param" href="/chat" data-link="/chat"
                        class="list-group-item list-group-item-action">Messages</a>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Settings</h5>
                        <p class="card-text">Here you can update your profile information.</p>
                        <form id="profile_form">
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
                            <img src="/static/imgs/asterix.gif"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="/static/imgs/spirou.jpeg"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="/static/imgs/gaston.jpg"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="/static/imgs/haddock.jpg"
                                alt="profile_picture" class="rounded-circle pp">
                        </div>
                        <button id="update_info" type="submit" class="btn btn-primary mt-3">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="toast align-items-center position-fixed bottom-0 end-0" role="alert" aria-live="assertive"
            aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>
    `
            ;
    }
    render() {
        // fetchSettingsInfo();
        super.render(); // Call the parent render method
        setupProfilePictureSelection();
        this.attachFormListener();
    }

    attachFormListener() {
        const form = document.getElementById('profile_form');
        let imageURL = null;

        const profilePics = document.getElementById('choice_pp');
        profilePics.addEventListener('click', (event) => {
            const clicked = event.target.closest('img');
            if (clicked) {
                imageURL = clicked.src;
            }
        });
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            const email = document.getElementById('floatingInput').value;
            const password = document.getElementById('floatingPassword').value;
            // Prepare the data to send
            const data = {
                email: email,
                password: password,
                profile_picture: imageURL,
            };

            try {
                const csrfToken = getCSRFToken('csrftoken');
                if (!csrfToken) {
                    console.error('CSRF token is missing!');
                }
                const response = await fetch('/api/update_profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    this.render();
                    document.querySelector(".toast-body").textContent = "Profile updated successfully!";
                    document.querySelector(".toast").classList.add("show");
                } else {
                    this.render();
                    document.querySelector(".toast-body").textContent = "Error : Profile update failed!";
                    document.querySelector(".toast").classList.add("show");
                }
            } catch (error) {
                this.render();
                document.querySelector(".toast-body").textContent = "Error: " + error;
                document.querySelector(".toast").classList.add("show");
            }
        });

    }
}