import { fetchUserInfo } from "../src/fetchUser.js";
import { Page } from "../src/pages.js";

export class Friends extends Page {
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
                        class="list-group-item list-group-item-action active">Friends</a>
                    <a id="choose_param" href="/chat" data-link="/chat"
                        class="list-group-item list-group-item-action">Messages</a>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Friends</h5>
                        <p class="card-text">Add some friends here...</p>
                        <div id="add-friend-form" class="input-group mb-3">
                            <input id="friend-username" type="text" class="form-control" placeholder="Enter friend's username" aria-describedby="button-addon2" required>
                            <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Add friend</button>
                        </div>
                        <div id="add-friend-message"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 `;
  }
  render() {
    fetchUserInfo();
    super.render(); // Call the parent render method

    document
      .getElementById("add-friend-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const friendUsername = document.getElementById("friend-username").value;
        const messageDiv = document.getElementById("add-friend-message");

        try {
          // Make sure the URL is correct
          const response = await fetch(
            "http://django-friends:9001/api/friends/add/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ friend_username: friendUsername }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            messageDiv.textContent = `Friend ${friendUsername} added successfully!`;
            messageDiv.style.color = "green";
          } else {
            messageDiv.textContent = data.error || "Failed to add friend.";
            messageDiv.style.color = "red";
          }
        } catch (error) {
          messageDiv.textContent = "An error occurred. Please try again.";
          messageDiv.style.color = "red";
        }
      });
  }
}
