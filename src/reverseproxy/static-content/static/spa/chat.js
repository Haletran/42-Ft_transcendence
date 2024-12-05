import { fetchMinInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';

let chatSocket;

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
                </div>
            </div>
        `;
    }

    async render() {
        super.render();
        fetchMinInfo();
        const currentUserData = await getCurrentUserInfo();
        const currentUserName = currentUserData.username;
        this.displayFriends(currentUserData.id, currentUserName);
    }

    async displayFriends(currentUserId, currentUserName) {
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
                data.accepted_friendships.forEach(friend => {
                    const friendBox = document.createElement('div');
                    friendBox.textContent = friend.friend_username;
                    friendBox.className = 'friend-box';
                    friendBox.style.border = '1px solid black';
                    friendBox.style.padding = '10px';
                    friendBox.style.margin = '5px';
                    friendBox.style.cursor = 'pointer';
                    friendBox.addEventListener('click', () => this.openChat(friend.friend_username));
                    friendsList.appendChild(friendBox);
                }); 
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    }

    openChat(friendUsername) {
    // Fetch or create the chat room for the selected friend
    const currentUserId = getCurrentUserInfo().id;
    const currentUserName = getCurrentUserInfo().name;
    const currentUserEmail = getCurrentUserInfo().email;
    fetch(`http://localhost:9002/api/create-or-fetch-chat-room/?id1=${currentUserId}&name1=${currentUserName}&email1=${currentUserEmail}&id2=${friendId}&name2=${friendUsername}&email2=${friendEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.room_id) {
                // Open chat with the room ID
                const chatContainer = document.getElementById('id_chat_item_container');
                chatContainer.style.display = 'block';
                chatContainer.innerHTML = `
                    <br />
                    <input type="text" id="id_message_send_input" />
                    <button type="submit" id="id_message_send_button">Send Message</button>
                    <br />
                    <br />
                `;
                this.chatEvent(friendUsername, data.room_id);
            }
        })
        .catch(error => console.error('Error fetching room:', error));
}


    scrollToBottom() {
        const chat = document.getElementById("id_chat_item_container");
        chat.scrollTop = chat.scrollHeight;
    }

    chatEvent(username) {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        if(!chatSocket)
            chatSocket = new WebSocket(protocol + window.location.host + "/ws/chat_test/");
    
        chatSocket.onopen = function (e) {
            console.log("The connection was set up successfully!");
        };
    
        chatSocket.onclose = function (e) {
            console.log("WebSocket connection closed unexpectedly!");
        };
    
        chatSocket.onerror = function (e) {
            console.error("WebSocket error observed:", e);
        };

        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const div = document.createElement("div");
            div.innerHTML = `${data.username}: ${data.message}`;
            document.querySelector("#id_message_send_input").value = "";
            document.getElementById("id_chat_item_container").appendChild(div);
            this.scrollToBottom();
        }.bind(this);
    
        // Store `sendMessage` reference
        const sendMessage = () => {
            const msg = document.getElementById("id_message_send_input").value.trim();
            if (msg) {
                chatSocket.send(JSON.stringify({ message: msg, username: username }));
                document.getElementById("id_message_send_input").value = '';
                this.scrollToBottom();
            }
        };
    
        // Ensure event listeners are added only once
        const messageSendButton = document.getElementById("id_message_send_button");
        const messageSendInput = document.getElementById("id_message_send_input");
    
        if (!messageSendButton.dataset.listenerAdded) {
            messageSendButton.addEventListener("click", sendMessage);
            messageSendButton.dataset.listenerAdded = true;
        }
    
        if (!messageSendInput.dataset.listenerAdded) {
            messageSendInput.addEventListener("keypress", (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            messageSendInput.dataset.listenerAdded = true;
        }
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