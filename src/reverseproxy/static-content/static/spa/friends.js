import { fetchUserInfo } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';

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
            <div>
                <h2>Add a Friend</h2>
                <form id="add-friend-form">
                    <input type="text" id="friend-username" placeholder="Enter friend's username" required />
                    <button type="submit">Add Friend</button>
                </form>
            <div id="add-friend-message"></div>
            <div>
                <button id="fetch-emails-button">Fetch Emails</button>
                <div id="emails-list"></div>
            </div>
        </div>
    </div>
 `;
    }
    render() {
        fetchUserInfo();
        super.render(); // Call the parent render method
    
        document.getElementById('add-friend-form').addEventListener('submit', async (event) => {
            event.preventDefault();
        
            const usernameOrEmail = document.getElementById('friend-username').value;
            const messageDiv = document.getElementById('add-friend-message');
        
            console.log('Form submitted with username or email:', usernameOrEmail);
        
            // Fetch current user info
            const currentUserResponse = await fetch('/api/user-info/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            const currentUserData = await currentUserResponse.json();
            const currentUserEmail = currentUserData.email;
            const currentUserName = currentUserData.username;
        
            // Check if the user is trying to add themselves
            if (usernameOrEmail === currentUserEmail || usernameOrEmail === currentUserName) {
                messageDiv.textContent = "You cannot add yourself as a friend.";
                messageDiv.style.color = 'red';
                console.log("Attempt to add self as friend prevented.");
                return;
            }
        
            try {
                // Step 1: Fetch emails from credentials service
                console.log('Starting fetch request for emails...');
                const emailsResponse = await fetch('http://localhost:9001/api/friends/fetch_emails/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
        
                console.log('Fetch request for emails completed.');
                console.log('Response status:', emailsResponse.status);
        
                const emailsData = await emailsResponse.json();
                console.log('Emails response data:', emailsData);
        
                if (!emailsResponse.ok) {
                    messageDiv.textContent = emailsData.error || 'Failed to fetch emails.';
                    messageDiv.style.color = 'red';
                    console.log('Failed to fetch emails:', emailsData.error);
                    return;
                }
        
                // Step 2: Check if the email exists in the fetched list
                const emailExists = emailsData.emails.includes(usernameOrEmail);
                const userExists = emailsData.usernames.includes(usernameOrEmail);
                let userEmail = null;
                let userName = null;
        
                if (emailExists) {
                    console.log(`Email ${usernameOrEmail} found in credentials service.`);
                    userEmail = usernameOrEmail;
                    userName = emailsData.usernames[emailsData.emails.indexOf(usernameOrEmail)];
                    messageDiv.textContent = `Email ${usernameOrEmail} found in credentials service. Username: ${userName}`;
                    messageDiv.style.color = 'green';
                    console.log(`Corresponding username: ${userName}`);
                } else if (userExists) {
                    console.log(`Username ${usernameOrEmail} found in credentials service.`);
                    userName = usernameOrEmail;
                    userEmail = emailsData.emails[emailsData.usernames.indexOf(usernameOrEmail)];
                    messageDiv.textContent = `Username ${usernameOrEmail} found in credentials service. Email: ${userEmail}`;
                    messageDiv.style.color = 'green';
                    console.log(`Corresponding email: ${userEmail}`);
                } else {
                    messageDiv.textContent = `Email or Username ${usernameOrEmail} not found in credentials service.`;
                    messageDiv.style.color = 'red';
                    console.log(`Email or Username ${usernameOrEmail} not found in credentials service.`);
                    return;
                }
        
                // Step 3: Send POST request to add the friend
                console.log('Starting fetch request to add friend...');
                const addFriendResponse = await fetch('http://localhost:9001/api/friends/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value
                    },
                    body: JSON.stringify({ username: userName, email: userEmail })
                });
        
                console.log('Fetch request to add friend completed.');
                console.log('Response status:', addFriendResponse.status);
        
                const addFriendData = await addFriendResponse.json();
                console.log('Add friend response data:', addFriendData);
        
                if (addFriendResponse.ok) {
                    messageDiv.textContent = `Friend ${userName} added successfully!`;
                    messageDiv.style.color = 'green';
                    console.log('Friend added successfully');
                } else {
                    messageDiv.textContent = addFriendData.error || 'Failed to add friend.';
                    messageDiv.style.color = 'red';
                    console.log('Failed to add friend:', addFriendData.error);
                }
            } catch (error) {
                console.error('Error occurred during fetch request:', error);
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.style.color = 'red';
            }
        });

    document.getElementById('fetch-emails-button').addEventListener('click', async () => {
    try {
        console.log('Starting fetch request for emails...');
        const response = await fetch('http://localhost:9001/api/friends/fetch_emails/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Fetch request completed.');
        console.log('Response status:', response.status);

        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            const emailsDiv = document.getElementById('emails-list');
            emailsDiv.innerHTML = '<h3>Emails in the credentials database:</h3>';
            data.emails.forEach(email => {
                const emailElement = document.createElement('p');
                emailElement.textContent = email;
                emailsDiv.appendChild(emailElement);
            });
            console.log('Emails fetched successfully');
        } else {
            console.log('Failed to fetch emails:', data.error);
        }
    } catch (error) {
        console.error('Error occurred during fetch request:', error);
    }
});
    }
}