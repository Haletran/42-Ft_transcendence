import { fetchMinInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';
import { startWebSocket } from './login_base.js';
import { getCurrentFriendInfo } from './friends.js';
import { logoutUser } from '../src/logout.js';
import { fetchFriendHistory, fetchFriendStatistics } from '../src/scoreTable.js';

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
                    <a id="choose_param" href="/chat" data-link="/chat"
                        class="list-group-item list-group-item-action active">Messages</a>
                </div>
            </div>
            <center><h1>Hello, Welcome to the chat site!</h1></center>
            <br>
            <div id="friends-list" style="font-size: 20px"></div>
            <br>
            <div class="chat__item__container" id="id_chat_item_container" style="font-size: 20px; display: none;">
              <br />
              <input type="text" id="id_message_send_input" />
              <button type="submit" id="id_message_send_button">Send Message</button>
              <br />
              <br />
            </div>
        `;
    }

    async render() {
        super.render();
        fetchMinInfo();
        startWebSocket();
        const currentUserData = await getCurrentUserInfo();
        const currentUserName = currentUserData.username;
        this.displayFriends(currentUserData.id);

        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                //event.preventDefault();
                logoutUser();
            });
        }
    }

    async displayFriends(currentUserId) {
        try {
            const response = await fetch(`/api/friends/get_accepted_friendships/?user_id=${currentUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch friends');
            }

            const data = await response.json();
            const friendsList = document.getElementById('friends-list');
            friendsList.innerHTML = '';

            if (data.accepted_friendships.length === 0) {
                friendsList.textContent = 'No friends found.';
            } else {
                data.accepted_friendships.forEach(async(friend) => {
                    const friendBox = document.createElement('div');
                    friendBox.className = 'friend-box d-flex align-items-center';
                    friendBox.style.border = '1px solid black';
                    friendBox.style.padding = '10px';
                    friendBox.style.margin = '5px';

                    const pictureBox = document.createElement('div');
                    const friendData = await getCurrentFriendInfo(friend.friend_username);
                    pictureBox.className = 'cover-fit rounded-circle';
                    pictureBox.style.width = '40px';
                    pictureBox.style.height = '40px';
                    pictureBox.style.marginRight = '10px';
                    pictureBox.style.backgroundImage = `url('${friendData.profile_picture}')`;
                    pictureBox.style.backgroundSize = 'cover';
                    pictureBox.style.backgroundPosition = 'center';

                    const profileBox = document.createElement('div');
                    profileBox.className = 'profile-box';
                    profileBox.style.position = 'absolute';
                    profileBox.style.border = '1px solid gray';
                    profileBox.style.padding = '30px';
                    profileBox.style.backgroundColor = 'grey';
                    profileBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    profileBox.style.opacity = '0';
                    profileBox.style.transition = 'opacity 0.3s ease';
                    profileBox.style.pointerEvents = 'none';
                    profileBox.style.display = 'none';
                    //profileBox.textContent = `Profile of ${friend.friend_username}`;
                    document.body.appendChild(profileBox);

                    const friendName = document.createElement('span');
                    friendName.textContent = friend.friend_username;
                    friendName.style.flexGrow = '1';

                    friendName.addEventListener('mouseover', async (e) => {
                        profileBox.style.display = 'block';
                        profileBox.style.opacity = '1';
                        profileBox.style.pointerEvents = 'auto';
                        profileBox.textContent = '';

                        const rect = friendName.getBoundingClientRect();
                        profileBox.style.top = `${rect.bottom + 5}px`;
                        profileBox.style.left = `${rect.left}px`;

                        try {
                            const friendinfo = await getCurrentFriendInfo(friend.friend_username);
                            const profileSection = document.createElement('div');
                            profileSection.style.marginBottom = '10px';
                            profileSection.innerHTML = `
                                <strong>Profile Info:</strong><br>
                                ${friendinfo.username || 'N/A'}<br>
                                ${friendinfo.email || 'N/A'}<br>
                            `;
                            profileBox.appendChild(profileSection);

                            const statinfo = await fetchFriendStatistics(friend.friend_username);
                            const statSection = document.createElement('div');
                            statSection.style.marginBottom = '10px';
                            statSection.innerHTML = statinfo;
                            profileBox.appendChild(statSection);
                            

                            const matchhistory = await fetchFriendHistory(friend.friend_username);
                            const matchSection = document.createElement('div');
                            matchSection.style.marginBottom = '10px';
                            matchSection.innerHTML = matchhistory;
                            profileBox.appendChild(matchSection);

                        }
                        catch(error) {
                            console.error(error);
                            profileBox.textContent = 'Failed to load profile info';
                        }
                    });

                    friendName.addEventListener('mouseout', () => {
                        profileBox.style.opacity = '0';
                        profileBox.style.pointerEvents = 'none';
                    });

                    friendBox.appendChild(pictureBox);
                    friendBox.appendChild(friendName);

                    const chatIcon = document.createElement('i');
                    chatIcon.className = 'bi bi-chat';
                    chatIcon.style.cursor = 'pointer';
                    chatIcon.style.marginLeft = '10px';
                    chatIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.openChat(friend.friend_username)
                    });
                    friendBox.appendChild(chatIcon);

                    friendsList.appendChild(friendBox);
                });
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    }

    openChat(friendUsername) {
        const chatContainer = document.getElementById('id_chat_item_container');
        chatContainer.style.display = 'block';
        this.chatEvent(friendUsername);
    }

    scrollToBottom() {
        const chat = document.getElementById("id_chat_item_container");
        chat.scrollTop = chat.scrollHeight;
    }

    chatEvent(username) {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const chatSocket = new WebSocket(protocol + window.location.host + "/ws/chat_test/");

        chatSocket.onopen = function (e) {
            console.log("The connection was setup successfully!");
        };

        chatSocket.onclose = function (e) {
            console.log("WebSocket connection closed unexpectedly!");
        };

        chatSocket.onerror = function (e) {
            console.error("WebSocket error observed:", e);
        };

        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            var div = document.createElement("div");
            div.innerHTML = data.username + " : " + data.message;
            document.querySelector("#id_message_send_input").value = "";
            document.getElementById("id_chat_item_container").appendChild(div);
            this.scrollToBottom();
        }.bind(this);

        document.getElementById("id_message_send_button").addEventListener("click", () => {
            var msg = document.getElementById("id_message_send_input").value;
            if (msg) {
                chatSocket.send(JSON.stringify({ message: msg, username: username }));
                document.getElementById("id_message_send_input").value = '';
                this.scrollToBottom();
            }
        });

        document.getElementById("id_message_send_input").addEventListener("keypress", (e) => {
            if (e.key === 'Enter') {
                var msg = document.getElementById("id_message_send_input").value;
                if (msg) {
                    chatSocket.send(JSON.stringify({ message: msg, username: username }));
                    document.getElementById("id_message_send_input").value = '';
                    this.scrollToBottom();
                }
            }
        });
    }
}

async function getCurrentUserInfo() {
    const response = await fetch('/api/credentials/user-info/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    return await response.json();
}