import { fetchProfileInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';
import { fetchMatchHistory, fetchStatistics } from '../src/scoreTable.js';
import { isUserOnline } from './home.js';

export class Profile extends Page {
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
                        <h5 class="card-title">Statistics (against AI)</h5>
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
    render() {
        fetchProfileInfo();
        fetchStatistics();
        fetchMatchHistory();
        isUserOnline();
        super.render(); // Call the parent render method
        //this.render_chart();
    }

    // render_chart() {
    //     const ctx = document.getElementById('myChart');

    //     const DATA_COUNT = 7;
    //     const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

    //     const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    //     const data = {
    //         labels: labels,
    //         datasets: [
    //             {
    //                 label: 'Win',
    //                 data: [10, 20, 30, 10, 50, -60, 70],
    //                 borderColor: 'rgb(255, 99, 132)',
    //                 backgroundColor: 'rgb(255, 99, 132)',
    //                 yAxisID: 'y',
    //             },
    //             {
    //                 label: 'Lose',
    //                 data: [100, 20, -30, 10, 50, 20],
    //                 borderColor: 'rgb(54, 162, 235)',
    //                 backgroundColor: 'rgb(54, 162, 235)',
    //                 yAxisID: 'y1',
    //             }
    //         ]
    //     };

    //     new Chart(ctx, {
    //         type: 'line',
    //         data: data,
    //         options: {
    //             responsive: true,
    //             interaction: {
    //                 mode: 'index',
    //                 intersect: false,
    //             },
    //             stacked: false,
    //             plugins: {
    //                 legend: {
    //                     position: 'bottom', // Move the label to the bottom
    //                 },
    //             },
    //             scales: {
    //                 y: {
    //                     type: 'linear',
    //                     display: true,
    //                     position: 'left',
    //                 },
    //                 y1: {
    //                     type: 'linear',
    //                     display: true,
    //                     position: 'right',

    //                     // grid line settings
    //                     grid: {
    //                         drawOnChartArea: false, // only want the grid lines for one axis to show up
    //                     },
    //                 },
    //             }
    //         },
    //     });
    // }
}