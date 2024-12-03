import { Page } from '../src/pages.js';

export class ChatPage extends Page {
    constructor() {
        super();
        this.template = `
            <center><h1>Hello, Welcome to my chat site! {{username}}</h1></center>
            <br>
            <div class="user-info">
                <p><strong>Username:</strong> {{username}}</p>
                <p><strong>Email:</strong> {{email}}</p>
                <p><strong>Profile Picture:</strong> <img src="{{profile_picture}}" alt="Profile Picture" width="50" height="50"></p>
            </div>
            <br>
            <div class="chat__item__container" id="id_chat_item_container" style="font-size: 20px">
                <br />
                <input type="text" id="id_message_send_input" />
                <button type="submit" id="id_message_send_button">Send Message</button>
                <br />
                <br />
            </div>
        `;
    }

    async render() {
        const userInfo = await this.fetchUserInfo();
        console.log('Fetched user info:', userInfo); // Log the user info
        const username = userInfo.email;
        const email = userInfo.email;
        const profilePicture = userInfo.profile_picture;

        this.template = this.template
            .replace('{{username}}', username)
            .replace('{{email}}', email)
            .replace('{{profile_picture}}', profilePicture);

        super.render();
        this.setupWebSocket(username);
    }

    async fetchUserInfo() {
        try {
            const response = await fetch('/api/credentials/user-info/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    setupWebSocket(username) {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const chatSocket = new WebSocket(protocol + window.location.hostname + ":9000/ws/chat_test/");
        
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
            document.querySelector("#id_chat_item_container").appendChild(div);
        };
        
        document.querySelector("#id_message_send_input").focus();
        
        document.querySelector("#id_message_send_input").onkeyup = function (e) {
            if (e.keyCode == 13) {
                document.querySelector("#id_message_send_button").click();
            }
        };
        
        document.querySelector("#id_message_send_button").onclick = function (e) {
            if (chatSocket.readyState === WebSocket.OPEN) {
                var messageInput = document.querySelector("#id_message_send_input").value;
                chatSocket.send(JSON.stringify({ message: messageInput, username: username }));
            } else {
                console.log("WebSocket is not open. Ready state: " + chatSocket.readyState);
            }
        };
    }
}