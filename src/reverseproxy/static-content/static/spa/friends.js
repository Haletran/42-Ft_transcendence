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
            <div>
                <h2>Your Friends</h2>
            <div id="friends-list"></div>
        </div>
          <div>
              <h2>Pending Invitations</h2>
              <div id="pending-invitations-list"></div>
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
    
          super.render(); // Call the parent render method
    
          document.getElementById('add-friend-form').addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const usernameOrEmail = document.getElementById('friend-username').value;
            const messageDiv = document.getElementById('add-friend-message');
    
            console.log('Form submitted with username or email:', usernameOrEmail);
    
            const currentUserData = await getCurrentUserInfo();
            console.log('Current User Data:', currentUserData);
            const currentUserEmail = currentUserData.email;
            const currentUserName = currentUserData.username;
            const currentUserId = currentUserData.id;
    
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
    
              // Step 3: Send POST request to add the friend
              console.log('Starting fetch request to add friend...');
              const addFriendResponse = await fetch('http://localhost:9001/api/friends/add/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value
                },
                body: JSON.stringify({ username: userName, email: userEmail, id: currentUserId })
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



              // Step 4: Send POST request to create a friend request
              console.log('Starting fetch request to create friend request...');
              console.log('currentUserId : ', currentUserId);
              console.log('userId : ', userId);
              console.log('currentUserEmail : ', currentUserEmail);
              const addFriendRequestResponse = await fetch('http://localhost:9001/api/friends/add_request/', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      // 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value
                  },
                  body: JSON.stringify({ sender_id: currentUserId, receiver_id: userId, sender_mail : currentUserEmail })
              });

              console.log('Fetch request to create friend request completed.');
              console.log('Response status:', addFriendRequestResponse.status);

              const addFriendRequestData = await addFriendRequestResponse.json();
              console.log('Add friend request response data:', addFriendRequestData);

              if (addFriendRequestResponse.ok) {
                  messageDiv.textContent = `Friend request sent to ${userName} successfully!`;
                  messageDiv.style.color = 'green';
                  console.log('Friend request sent successfully');
              } else {
                  messageDiv.textContent = addFriendRequestData.error || 'Failed to send friend request.';
                  messageDiv.style.color = 'red';
                  console.log('Failed to send friend request:', addFriendRequestData.error);
              }
            } catch (error) {
              console.error('Error occurred during fetch request:', error);
              messageDiv.textContent = 'An error occurred. Please try again.';
              messageDiv.style.color = 'red';
            }
            fetchFriends(currentUserId);
          });
    
          if (currentUserData) {
            const currentUserId = currentUserData.id;
            fetchFriends(currentUserId); // Fetch friends when the page loads
            fetchPendingInvitations(currentUserId);
          }
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
    
    async function fetchFriends(currentUserId) {
      const friendsListDiv = document.getElementById('friends-list');
      friendsListDiv.innerHTML = 'Loading...';
    
      try {
        const response = await fetch(`http://localhost:9001/api/friends/get_friends/?user_id=${currentUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }
    
        const friendsData = await response.json();
        friendsListDiv.innerHTML = '';
    
        if (friendsData.friends_usernames.length === 0) {
          friendsListDiv.innerHTML = 'You have no friends yet.';
        } else {
          const ul = document.createElement('ul');
          friendsData.friends_usernames.forEach(friend => {
            const li = document.createElement('li');
            li.textContent = friend;
            ul.appendChild(li);
          });
          friendsListDiv.appendChild(ul);
        }
      } catch (error) {
        friendsListDiv.innerHTML = 'Error loading friends.';
        console.error('Error fetching friends:', error);
      }
}

async function fetchPendingInvitations(currentUserId) {
  const pendingInvitationsListDiv = document.getElementById('pending-invitations-list');
  pendingInvitationsListDiv.innerHTML = 'Loading...';

  try {
      const response = await fetch(`http://localhost:9001/api/friends/get_pending_invitations/?user_id=${currentUserId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (!response.ok) {
          throw new Error('Failed to fetch pending invitations');
      }

      const pendingInvitationsData = await response.json();
      console.log('Pending Invitations Data:', pendingInvitationsData); // Log the response data
      pendingInvitationsListDiv.innerHTML = '';

      // Extract sender_email array
      const senderEmails = pendingInvitationsData.pending_invitations.map(invitation => invitation.sender_email);
      console.log('Sender Emails:', senderEmails); // Print the sender_email array

      if (pendingInvitationsData.pending_invitations.length === 0) {
          pendingInvitationsListDiv.innerHTML = 'You have no pending invitations.';
      } else {
          const ul = document.createElement('ul');
          pendingInvitationsData.pending_invitations.forEach(invitation => {
              const li = document.createElement('li');
              li.textContent = `Invitation from: ${invitation.sender_email}`;
              ul.appendChild(li);
          });
          pendingInvitationsListDiv.appendChild(ul);
      }
  } catch (error) {
      pendingInvitationsListDiv.innerHTML = 'Error loading pending invitations.';
      console.error('Error fetching pending invitations:', error);
  }
}