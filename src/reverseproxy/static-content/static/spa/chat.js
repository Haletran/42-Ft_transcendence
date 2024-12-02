import { Page } from '../src/pages.js';
import { fetchProfileInfo } from '../src/fetchUser.js';
import { getProfileName } from '../src/fetchUser.js';

export class Chat extends Page {
    constructor() {
        super();
        this.template = `
            <center><h1>Hello, Welcome to my chat site! {{request.user}}</h1></center>
            <br>
            {% if request.user.is_authenticated %}
            <center> Logout the chat Page <a href="{% url 'logout-user' %}">Logout</a></center>
            {% endif %}
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
        super.render();
        this.chatEvent("dorian");
    }

    scrollToBottom() {
        const chat = document.getElementById("id_chat_item_container");
        chat.scrollTop = chat.scrollHeight;
    }

    chatEvent(username) {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const chatSocket = new WebSocket(protocol + window.location.host + "/ws/chat_test/");
        // const chatSocket = new WebSocket(`wss://${window.location.host}/ws/chat_test/`)
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
            chatSocket.send(JSON.stringify({ message: msg, username: username }));
            var chat = document.getElementById("id_chat_item_container");
            var p = document.createElement("p");
            p.textContent = username + " : " + msg;
            p.style.margin = '0';
            chat.appendChild(p);
            document.getElementById("id_message_send_input").value = '';
            this.scrollToBottom();
        });

        document.getElementById("id_message_send_input").addEventListener("keypress", (e) => {
            if (e.key === 'Enter') {
                var msg = document.getElementById("id_message_send_input").value;
                chatSocket.send(JSON.stringify({ message: msg, username: username }));
                var chat = document.getElementById("id_chat_item_container");
                var p = document.createElement("p");
                p.textContent = username + " : " + msg;
                p.style.margin = '0';
                chat.appendChild(p);
                document.getElementById("id_message_send_input").value = '';
                this.scrollToBottom();
            }
        });
    }
}