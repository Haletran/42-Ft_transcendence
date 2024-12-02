import { fetchProfileInfo } from '../src/fetchUser.js';
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
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Friends</h5>
                        <p class="card-text">Add some friends here...</p>
                        <form id="add-friend-form" class="input-group mb-3">
                            <input id="friend-username" type="text" class="form-control" placeholder="Enter friend's username" aria-describedby="button-addon2" required>
                            <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Add friend</button>
                        </div>
                        <div id="add-friend-message"></div>
                    </div>
                </div>
            </div>
            <div class="col mt-4">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <h2 class="title" >Friends</h2>
                            <div id="friends-list"></div>
                        </div>
                        <hr>
                        <div class="card-title">
                            <h2 class="title" >Friends request</h2>
                            <p class="text-muted">Manage your incoming and outgoing friend requests</p>
                                <ul class="nav nav-tabs" id="requestTabs" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link active" id="incoming-tab" data-bs-toggle="tab" href="#incoming" role="tab" aria-controls="incoming" aria-selected="true">Incoming Requests</a>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link" id="outgoing-tab" data-bs-toggle="tab" href="#outgoing" role="tab" aria-controls="outgoing" aria-selected="false">Outgoing Requests</a>
                                    </li>
                                </ul>

                                <!-- Tab content -->
                                <div class="tab-content" id="requestTabsContent">
                                    <!-- Incoming Requests Tab -->
                                    <div class="tab-pane fade show active" id="incoming" role="tabpanel" aria-labelledby="incoming-tab">
                                        <ul id="incoming-invitations-list" class="list-group mt-3">
                                        </ul>
                                    </div>
                                    <!-- Outgoing Requests Tab -->
                                    <div class="tab-pane fade" id="outgoing" role="tabpanel" aria-labelledby="outgoing-tab">
                                        <ul id="pending-invitations-list" class="list-group mt-3">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 `;
    }

    async render() {
        try {
            const currentUserData = await getCurrentUserInfo();
            if (!currentUserData) {
                throw new Error('Failed to fetch user info');
            }
            const currentUserId = currentUserData.id;
            const currentUserEmail = currentUserData.email;
            const currentUserName = currentUserData.username;

            super.render(); // Call the parent render method

            document.getElementById('add-friend-form').addEventListener('submit', async (event) => {
                event.preventDefault();

                const usernameOrEmail = document.getElementById('friend-username').value;
                const messageDiv = document.getElementById('add-friend-message');

                console.log('Form submitted with username or email:', usernameOrEmail);

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

                    if (emailsResponse.ok) {
                        // Step 2: Check if the email exists in the fetched list
                        const emailExists = emailsData.emails?.includes(usernameOrEmail);
                        const userExists = emailsData.usernames?.includes(usernameOrEmail);
                        let userEmail = null;
                        let userName = null;
                        let userId = null;

                        if (emailExists) {
                            const index = emailsData.emails.indexOf(usernameOrEmail);
                            userEmail = usernameOrEmail;
                            userName = emailsData.usernames[index];
                            userId = emailsData.id[index];  // Get the user ID using the same index
                            messageDiv.textContent = `Email ${usernameOrEmail} found. Username: ${userName}, ID: ${userId}`;
                            messageDiv.style.color = 'green';
                            console.log(`Found user - Email: ${userEmail}, Username: ${userName}, ID: ${userId}`);
                        } else if (userExists) {
                            const index = emailsData.usernames.indexOf(usernameOrEmail);
                            userName = usernameOrEmail;
                            userEmail = emailsData.emails[index];
                            userId = emailsData.id[index];  // Get the user ID using the same index
                            messageDiv.textContent = `Username ${usernameOrEmail} found. Email: ${userEmail}, ID: ${userId}`;
                            messageDiv.style.color = 'green';
                            console.log(`Found user - Email: ${userEmail}, Username: ${userName}, ID: ${userId}`);
                        } else {
                            messageDiv.textContent = `Email or Username ${usernameOrEmail} not found in credentials service.`;
                            messageDiv.style.color = 'red';
                            console.log(`Email or Username ${usernameOrEmail} not found in credentials service.`);
                            return;
                        }

                        console.log('Current User ID:', currentUserId);
                        console.log('Current User Email:', currentUserEmail);
                        console.log('Current User Name:', currentUserName);
                        console.log('User ID:', userId);
                        console.log('User Email:', userEmail);
                        console.log('User Name:', userName);

                        // Step 3: Send POST request to add the friend
                        console.log('Starting fetch request to add friend...');
                        const addFriendResponse = await fetch('http://localhost:9001/api/friends/add/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                // 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value
                            },
                            body: JSON.stringify({ id_friend1: currentUserId, email_friend1: currentUserEmail, name_friend1: currentUserName, id_friend2: userId, email_friend2: userEmail, name_friend2: userName, sender: currentUserId, receiver: userId, status: "pending" })
                        });

                        console.log('Fetch request to add friend completed.');
                        console.log('Response status:', addFriendResponse.status);

                        const addFriendData = await addFriendResponse.json();
                        console.log('Add friend response data:', addFriendData);

                        if (addFriendResponse.ok) {
                            messageDiv.textContent = `Invitation to Friend ${userName} sent successfully!`;
                            messageDiv.style.color = 'green';
                            console.log('Friend invitation sent successfully');
                        } else {
                            messageDiv.textContent = addFriendData.error || 'Failed to add friend.';
                            messageDiv.style.color = 'red';
                            console.log('Failed to add friend:', addFriendData.error);
                        }
                    } else {
                        messageDiv.textContent = emailsData.error || 'Failed to fetch emails.';
                        messageDiv.style.color = 'red';
                        console.log('Failed to fetch emails:', emailsData.error);
                    }
                } catch (error) {
                    console.error('Error occurred during fetch request:', error);
                    messageDiv.textContent = 'An error occurred. Please try again.';
                    messageDiv.style.color = 'red';
                }
            });
            fetchPendingConfirmations(currentUserId);
            getIncomingInvitations(currentUserId);
            fetchAcceptedFriendships(currentUserId);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }
}

async function getCurrentUserInfo() {
    const response = await fetch('/api/user-info/', {
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

async function fetchPendingConfirmations(currentUserId) {
    try {
        const response = await fetch(`http://localhost:9001/api/friends/get_pending_confirmations/?user_id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pending confirmations');
        }

        const data = await response.json();
        console.log('Pending confirmations data:', data);

        const confirmationList = document.getElementById('pending-invitations-list');
        confirmationList.innerHTML = '';

        if (data.pending_confirmations.length === 0) {
            confirmationList.textContent = 'No pending confirmations.';
        } else {
            data.pending_confirmations.forEach(confirmation => {

                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.textContent = `Pending confirmation for: ${confirmation.receiver_username}`;
                const btnContainer = document.createElement('div');
                btnContainer.className = 'btn-container';

                const cancelButton = document.createElement('button');
                cancelButton.className = 'btn btn-outline-light';
                cancelButton.innerHTML = '<i class="bi bi-x"></i>';
                cancelButton.onclick = () => handleInvitationResponse(confirmation.id, 'cancelled', currentUserId);

                btnContainer.appendChild(cancelButton);
                listItem.appendChild(btnContainer);
                confirmationList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error fetching pending confirmations:', error);
    }
}

async function getIncomingInvitations(currentUserId) {
    try {
        const response = await fetch(`http://localhost:9001/api/friends/get_incoming_invitations/?user_id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch incoming invitations');
        }

        const data = await response.json();
        console.log('incoming invitations data:', data);

        const confirmationList = document.getElementById('incoming-invitations-list');
        confirmationList.innerHTML = '';

        if (data.pending_confirmations.length === 0) {
            confirmationList.textContent = 'No incoming invitations.';
        } else {
            data.pending_confirmations.forEach(confirmation => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.textContent = `Friend request from ${confirmation.sender_username}`;

                const btnContainer = document.createElement('div');
                btnContainer.className = 'btn-container';

                const acceptButton = document.createElement('button');
                acceptButton.className = 'btn btn-outline-light';
                acceptButton.innerHTML = '<i class="bi bi-check2"></i> Accept';
                acceptButton.onclick = () => handleInvitationResponse(confirmation.id, 'accepted', currentUserId);

                const denyButton = document.createElement('button');
                denyButton.className = 'btn btn-outline-light';
                denyButton.innerHTML = '<i class="bi bi-x"></i> Reject';
                denyButton.onclick = () => handleInvitationResponse(confirmation.id, 'rejected', currentUserId);

                btnContainer.appendChild(acceptButton);
                btnContainer.appendChild(denyButton);
                listItem.appendChild(btnContainer);

                confirmationList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error fetching incoming invitations:', error);
    }
}

async function handleInvitationResponse(invitationId, accept, currentUserId) {
    try {
        const url = `http://localhost:9001/api/friends/respond_invitation/?id=${invitationId}`;
        console.log(`Making request to: ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                choice: accept,
            }),
        });

        // Log response status for debugging
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorMessage = `Failed to respond to invitation: ${response.statusText} (Status: ${response.status})`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Invitation response data:', data);

        // Refresh the incoming invitations list
        getIncomingInvitations(currentUserId);
    } catch (error) {
        console.error('Error responding to invitation:', error);
    }
}

async function fetchAcceptedFriendships(currentUserId) {
    try {
        const response = await fetch(`http://localhost:9001/api/friends/get_accepted_friendships/?user_id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch accepted friendships');
        }

        const data = await response.json();
        console.log('Accepted friendships data:', data);

        const friendshipList = document.getElementById('friends-list');
        friendshipList.innerHTML = '';

        if (data.accepted_friendships.length === 0) {
            friendshipList.className = 'text-muted';
            friendshipList.textContent = 'No accepted friendships.';
        } else {
            data.accepted_friendships.forEach(friendship => {
                const listItem = document.createElement('div');
                listItem.textContent = `Friend: ${friendship.friend_username}`;

                friendshipList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error fetching accepted friendships:', error);
    }
}