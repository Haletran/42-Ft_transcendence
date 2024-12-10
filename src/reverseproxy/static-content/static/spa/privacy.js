import { fetchMinInfo } from "../src/fetchUser.js";
import { isUserOnline } from "./home.js";
import { Page } from '../src/pages.js';

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
                        <h5 class="card-title">Privacy options</h5>
                            <button type="button" class="btn btn-danger">Delete profile picture</button>
                            <button type="button" class="btn btn-danger">Delete match history</button><br>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="check1" name="track-match" value="something" not-checked>
                                <label class="form-check-label">Do not keep track of my match history</label>
                            </div> 
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="check1" name="track-match" value="something" not-checked>
                                <label class="form-check-label">Do not display my profile informations to my friends</label>
                            </div>
                            <button type="button" class="btn btn-danger">Delete my account</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
 `;
    }
    render() {
        isUserOnline();
        fetchMinInfo();
        super.render();
    }
}