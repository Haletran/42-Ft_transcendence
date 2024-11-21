import { Page } from '../src/pages.js';

export class Chat extends Page {
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
                    <img alt="Logo" width="40" height="40" class="rounded-circle" style="
                              object-fit: cover;
                            " src="https://cdn.intra.42.fr/users/65ca7a946948378f5cf99fb253ea4907/bapasqui.jpg"
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
                        class="list-group-item list-group-item-action">
                        Profile
                    </a>
                    <a id="choose_param" data-link="/settings" 
                        class="list-group-item list-group-item-action ">Settings</a>
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
                        <div class="input-group mb-3">
                            <p id="chat" class="input-group-text text-start" style="width: 100%; height: 200px;"></p>
                            <input id="msg" type="text" class="form-control " placeholder="Type your message here"
                                aria-label="Type your message here" aria-describedby="button-addon2">
                            <button id="send" class="btn btn-outline-secondary" type="button"
                                id="button-addon2">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script>

    // when clicking button
    document.getElementById("send").addEventListener("click", function () {
        var msg = document.getElementById("msg").value;
        console.log(msg);
        var chat = document.getElementById("chat");
        if (chat.innerHTML.split("<br>").length > 8) {
            chat.innerHTML = chat.innerHTML.split("<br>").slice(1).join("<br>");
        }
        document.getElementById("chat").innerHTML += "USER 1: " + msg + "<br>";
        document.getElementById("msg").value = '';
    });

    // when pressing enter
    document.getElementById("msg").addEventListener("keypress", function (e) {
        if (e.key === 'Enter') {
            var msg = document.getElementById("msg").value;
            var chat = document.getElementById("chat");
            if (chat.innerHTML.split("<br>").length > 8) {
                chat.innerHTML = chat.innerHTML.split("<br>").slice(1).join("<br>");
            }
            document.getElementById("chat").innerHTML += "USER 1: " + msg + "<br>";
            console.log(msg);
            document.getElementById("msg").value = '';
        }
    });
    </script>
 `;
    }
    render() {
        super.render(); // Call the parent render method
    }
}