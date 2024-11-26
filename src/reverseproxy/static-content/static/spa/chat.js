import { Page } from '../src/pages.js';
import { fetchUserInfo } from '../src/fetchUser.js';
import { getProfileName } from '../src/fetchUser.js';

export class Chat extends Page {
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
                        class="list-group-item list-group-item-action">
                        Profile
                    </a>
                    <a id="choose_param" data-link="/settings" 
                        class="list-group-item list-group-item-action ">Settings</a>
					<a id="choose_param" href="/friends" data-link="/friends"
                        class="list-group-item list-group-item-action">Friends</a>
                    <a id="choose_param" href="/chat" data-link="/chat"
                        class="list-group-item list-group-item-action active" aria-current="true">Messages</a>
                </div>
            </div>
            <!-- A FAIRE : 
            Direct message
            Main Channel
            Invitation a jouer a un jeu
            Pouvoir blocker les users
            Acceder au autre profile -->
             <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Live-Chat</h5>
                        <p class="card-text">You can chat with other users in real time.</p>
                        <div class="input-group mb-3 gap-2">
                             <div class="input-group-text text-start" style="width: 100%; height: 200px;">
                                <div id="chat" style="overflow-y: scroll; height: 100%; width: 100%;"></div>
                             </div>
                            <div class="input-group mt-2">
                                <input id="msg" type="text" class="form-control" placeholder="Type your message here"
                                    aria-label="Type your message here" aria-describedby="button-addon2">
                                <button id="send" class="btn btn-outline-secondary" type="button">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
 `;
    }
    async render() {
        fetchUserInfo();
        const email = await getProfileName();
        const username = email.split('@')[0];
        super.render();
        this.chatEvent(username);
    }

    scrollToBottom() {
        const chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
    }
    
    chatEvent(username) {
        document.getElementById("send").addEventListener("click", () => {
            var msg = document.getElementById("msg").value;
            var chat = document.getElementById("chat");
            var p = document.createElement("p");
            p.textContent = username + " : " + msg;
            p.style.margin = '0';
            chat.appendChild(p);
            document.getElementById("msg").value = '';
            this.scrollToBottom();
        });
    
        // when pressing enter
        document.getElementById("msg").addEventListener("keypress", (e) => {
            if (e.key === 'Enter') {
                var msg = document.getElementById("msg").value;
                var chat = document.getElementById("chat");
                var p = document.createElement("p");
                p.textContent = username + " : " + msg;
                p.style.margin = '0';
                chat.appendChild(p);
                document.getElementById("msg").value = '';
                this.scrollToBottom();
            }
        });
    }
}