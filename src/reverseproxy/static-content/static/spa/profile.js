import { Page } from '../src/pages.js';
import { fetchSettingsInfo } from '../src/fetchUser.js';

export class Profile extends Page {
    constructor() {
        super();
        this.template = `
            <div class="header">
        <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand " href="/" data-link="/">
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
                        <a class="dropdown-item fw-bold text-danger" href="/chat" data-link="/chat" >Logout</a>
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
                        class="list-group-item list-group-item-action active" aria-current="true">
                        Profile
                    </a>
                    <a id="choose_param" data-link="/settings" 
                        class="list-group-item list-group-item-action">Settings</a>
                    <a id="choose_param" href="/chat" data-link="/chat"
                        class="list-group-item list-group-item-action">Messages</a>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Profile Information</h5>
                        <p class="card-text">Here you can update your profile information.</p>
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
                                src="/static/imgs/bapasqui.jpg"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="/static/imgs/asterix.gif"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="/static/imgs/spirou.jpeg"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="/static/imgs/gaston.jpg"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="/static/imgs/haddock.jpg"
                                alt="profile_picture" class="rounded-circle pp">
                        </div>
                        <button id="update_info" type="button" class="btn btn-primary mt-3">Update</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="toast align-items-center position-fixed bottom-0 end-0" role="alert" aria-live="assertive"
            aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    Profile successfully updated!
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>
    `
    ;
    }
    render() {
        fetchSettingsInfo();
        super.render(); // Call the parent render method
    }
}