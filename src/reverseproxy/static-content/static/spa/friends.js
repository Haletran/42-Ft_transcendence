import { fetchMinInfo2 } from '../src/fetchUser.js';
import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';
import { logoutUser } from '../src/logout.js';
import { router, isUserLoggedIn } from '../app.js';
import { fetchFriendHistory, fetchFriendStatistics } from '../src/scoreTable.js';
import { isFriendOnline, isUserOnline } from './home.js';
import { unload } from '../js/utils.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';


export class Friends extends Page {
    constructor() {
        super();
        this.template = `
            <div class="header">
        <nav class="navbar bg-dark border-body" data-bs-theme="dark">
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
                        <a class="dropdown-item" href="/friends" data-link="/friends" >Friends</a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/privacy" data-link="/privacy" >Privacy</a>
                    </li>
                    <li>
                        <a class="dropdown-item fw-bold text-danger" href="/" data-link="/" id="logout-butt"><i class="bi bi-box-arrow-left"></i> Logout</a>
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
                        class="list-group-item list-group-item-action active-menu">Friends</a>
                    <a id="choose_param" href="/privacy" data-link="/privacy"
                        class="list-group-item list-group-item-action">Privacy</a>
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
            <div class="d-flex flex-column mt-4 gap-2">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <h2 class="title">My Friends</h2>
                            <div id="friends-list" class="row row-cols-2 g-2 mt-2"></div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
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
                                        <ul id="incoming-invitations-list" class="list-group mt-3 max-width-inherit">
                                        </ul>
                                    </div>
                                    <!-- Outgoing Requests Tab -->
                                    <div class="tab-pane fade" id="outgoing" role="tabpanel" aria-labelledby="outgoing-tab">
                                        <ul id="pending-invitations-list" class="list-group mt-3 max-width-inherit">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div aria-live="polite" aria-atomic="true" class="position-relative">
                <div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>
            </div>
        </div>
        </div>
    </div>
 `;
    }
    async render() {
        const loggedIn = isUserLoggedIn();
        if (loggedIn == false) {
            router.goTo('/login_base');
            return;
        }
        unload();
        fetchMinInfo();
        isUserOnline();
        super.render();

        subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });

        try {
            const currentUserData = await getCurrentUserInfo();
            if (!currentUserData) {
                throw new Error('Failed to fetch user info');
            }
            const currentUserId = currentUserData.id;
            const currentUserEmail = currentUserData.email;
            const currentUserName = currentUserData.username;
            fetchMinInfo2();

            const logoutButton = document.getElementById('logout-butt');
            if (logoutButton) {
                logoutButton.addEventListener('click', function (event) {
                    logoutUser();
                });
            }

            const addFriendForm = document.getElementById('add-friend-form');
            if (!addFriendForm) {
                throw new Error('Add friend form not found');
            }
            addFriendForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const usernameOrEmail = document.getElementById('friend-username').value;

                // Function to display a toast message
                const showToast = (message, type = 'info') => {
                    const toastContainer = document.getElementById('toast-container');
                    const toastId = `toast-${Date.now()}`;
                    const toastHTML = `
                        <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="10000">
                            <div class="d-flex">
                                <div class="toast-body">${message}</div>
                                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                        </div>
                    `;
                    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

                    const toastElement = document.getElementById(toastId);
                    const toast = new bootstrap.Toast(toastElement);
                    toast.show();

                    toastElement.addEventListener('hidden.bs.toast', () => {
                        toastElement.remove();
                    });
                };


                if (usernameOrEmail === currentUserEmail || usernameOrEmail === currentUserName) {
                    showToast('You cannot add yourself as a friend.', 'danger');
                    return;
                }

                try {
                    const emailsResponse = await fetch('/api/friends/fetch_emails/', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const emailsData = await emailsResponse.json();
                    if (emailsResponse.ok) {
                        const emailExists = emailsData.emails?.includes(usernameOrEmail);
                        const userExists = emailsData.usernames?.includes(usernameOrEmail);
                        let userEmail = null;
                        let userName = null;
                        let userId = null;

                        if (emailExists) {
                            const index = emailsData.emails.indexOf(usernameOrEmail);
                            userEmail = usernameOrEmail;
                            userName = emailsData.usernames[index];
                            userId = emailsData.id[index];
                        } else if (userExists) {
                            const index = emailsData.usernames.indexOf(usernameOrEmail);
                            userName = usernameOrEmail;
                            userEmail = emailsData.emails[index];
                            userId = emailsData.id[index];
                        } else {
                            showToast(`Email or Username ${usernameOrEmail} not found.`, 'danger');
                            throw new Error('Email or Username not found.');
                        }

                        const csrfToken = getCSRFToken('csrftoken');
                        if (!csrfToken) {
                            throw new Error('CSRF token is missing!');
                        }
                        let addFriendResponse;
                        try {
                            addFriendResponse = await fetch('/api/friends/add/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken': csrfToken,
                                },
                                body: JSON.stringify({
                                    id_friend1: currentUserId,
                                    email_friend1: currentUserEmail,
                                    name_friend1: currentUserName,
                                    id_friend2: userId,
                                    email_friend2: userEmail,
                                    name_friend2: userName,
                                    sender: currentUserId,
                                    receiver: userId,
                                    status: "pending"
                                })


                            });
                            if (!addFriendResponse.ok) {
                                showToast('You cannot add this friend', 'danger');
                                return;
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }

                        const addFriendData = await addFriendResponse.json();
                        if (addFriendResponse.ok) {
                            showToast('Friend invitation sent successfully!', 'success');
                            router.goTo('/friends');
                        } else {
                            showToast(addFriendData.error || 'Failed to add friend.', 'danger');
                        }
                    } else {
                        showToast(emailsData.error || 'Failed to fetch emails.', 'danger');
                    }
                } catch (error) {
                    console.log(error);
                    showToast('An error occurred. Please try again.', 'danger');
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

async function fetchPendingConfirmations(currentUserId) {
    try {
        const response = await fetch(`/api/friends/get_pending_confirmations/?user_id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                content: 'include',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pending confirmations');
        }

        const data = await response.json();
        const confirmationList = document.getElementById('pending-invitations-list');
        confirmationList.innerHTML = '';

        if (data.pending_confirmations.length === 0) {
            confirmationList.innerHTML = `
            <div class="d-flex flex-column justify-content-center align-items-center" style="font-size: 1.2rem;">
                <i class="bi bi-person-dash-fill text-gray-400" style="font-size: 2rem;"></i>
                No outgoing requests.
                <p class="text-muted" style="font-size: 1rem;">You haven't sent any friend requests.</p>
            </div>`;
        } else {
            data.pending_confirmations.forEach(confirmation => {

                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center max-width-inherit';
                listItem.innerHTML = `<p class="mt-3" >Pending confirmation to: <strong>${confirmation.receiver_username}</strong></p>`;
                const btnContainer = document.createElement('div');
                btnContainer.className = 'btn-container';

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
        const response = await fetch(`/api/friends/get_incoming_invitations/?user_id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch incoming invitations');
        }

        const data = await response.json();
        const confirmationList = document.getElementById('incoming-invitations-list');
        confirmationList.innerHTML = '';

        if (data.pending_confirmations.length === 0) {
            confirmationList.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center" style="font-size: 1.2rem;">
                    <i class="bi bi-person-plus-fill text-gray-400 " style="font-size: 2rem;"></i>
                    No incoming requests.
                    <p class="text-muted" style="font-size: 1rem;">You don't have any pending friend requests.</p>
                </div>
            `;
        } else {
            data.pending_confirmations.forEach(confirmation => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center max-width-inherit';
                listItem.innerHTML = `<p class="mt-3" >Friend request from <strong>${confirmation.sender_username}</strong></p>`;

                const btnContainer = document.createElement('div');
                btnContainer.className = 'btn-container';

                const acceptButton = document.createElement('button');
                acceptButton.className = 'btn btn-outline-light';
                acceptButton.innerHTML = '<i class="bi bi-check2"></i> Accept';
                acceptButton.onclick = () => {
                    handleInvitationResponse(confirmation.id, 'accepted', currentUserId);
                    router.goTo('/friends');
                }

                const denyButton = document.createElement('button');
                denyButton.className = 'btn btn-outline-light';
                denyButton.innerHTML = '<i class="bi bi-x"></i> Reject';
                denyButton.onclick = () => {
                    handleInvitationResponse(confirmation.id, 'rejected', currentUserId);
                    router.goTo('/friends');
                }

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
        const url = `/api/friends/respond_invitation/?id=${invitationId}`;
        const csrfToken = getCSRFToken('csrftoken');
        if (!csrfToken) {
            throw new Error('CSRF token is missing!');
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                choice: accept,
            }),
        });
        if (!response.ok) {
            const errorMessage = `Failed to respond to invitation: ${response.statusText} (Status: ${response.status})`;
            throw new Error(errorMessage);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        getIncomingInvitations(currentUserId);

    } catch (error) {
        console.error('Error responding to invitation:', error);
    }
}

async function fetchAcceptedFriendships(currentUserId) {
    try {
        const csrfToken = getCSRFToken('csrftoken');
        if (!csrfToken) {
            throw new Error('CSRF token is missing!');
        }
        const response = await fetch(`/api/friends/get_accepted_friendships/?user_id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch accepted friendships');
        }

        const data = await response.json();
        const friendshipList = document.getElementById('friends-list');
        friendshipList.innerHTML = '';

        if (data.accepted_friendships.length === 0) {
            friendshipList.className = 'text-muted';
            friendshipList.textContent = 'No friends yet.';
            friendshipList.innerHTML = `
                <div class="d-flex flex-column justify-content-start">
                    <p class="text-muted">When you add friends, they'll appear here. Start connecting with others!</p>
                </div>
            `;
        } else {
            data.accepted_friendships.forEach(async (friendship) => {
                const listItem = document.createElement('div');
                const friendData = await getCurrentFriendInfo(friendship.friend_username);
                const onlineStatus = await isFriendOnline(friendship.friend_username);
                listItem.className = 'col-sm-6';
                listItem.innerHTML = `
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center gap-3">
                            <img src="${friendData.profile_picture}" alt="friend_profile_picture" class="cover-fit rounded-circle" width="50" height="50">
                            <div class="d-flex flex-column g-1">
                              <h5 class="card-title" id="friendUser">${friendData.username}
                              ${onlineStatus === 1 ? '<span class="online-dot bg-success"></span>' : ''}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;
                if (friendData.display_friends === true) {
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
                    document.body.appendChild(profileBox);
                    const friendName = listItem.querySelector('#friendUser');
                    friendName.addEventListener('mouseover', async (e) => {
                        profileBox.style.display = 'block';
                        profileBox.style.opacity = '1';
                        profileBox.style.pointerEvents = 'auto';
                        profileBox.textContent = '';

                        const rect = friendName.getBoundingClientRect();
                        profileBox.style.top = `${rect.bottom + 5}px`;
                        profileBox.style.left = `${rect.left}px`;

                        try {
                            const friendinfo = await getCurrentFriendInfo(friendship.friend_username);
                            const profileSection = document.createElement('div');
                            profileSection.style.marginBottom = '10px';
                            profileSection.innerHTML = `
                            <strong>Profile Info:</strong><br>
                            ${friendinfo.username || 'N/A'}<br>
                            ${friendinfo.email || 'N/A'}<br>
                        `;
                            profileBox.appendChild(profileSection);

                            const statinfo = await fetchFriendStatistics(friendship.friend_username);
                            const statSection = document.createElement('div');
                            statSection.style.marginBottom = '10px';
                            statSection.innerHTML = statinfo;
                            profileBox.appendChild(statSection);


                            const matchhistory = await fetchFriendHistory(friendship.friend_username);
                            const matchSection = document.createElement('div');
                            matchSection.style.marginBottom = '10px';
                            matchSection.innerHTML = matchhistory;
                            profileBox.appendChild(matchSection);

                        }
                        catch (error) {
                            console.error(error);
                            profileBox.textContent = 'Failed to load profile info';
                        }
                    });
                    friendName.addEventListener('mouseout', () => {
                        profileBox.style.opacity = '0';
                        profileBox.style.pointerEvents = 'none';
                    });
                }
                friendshipList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error fetching accepted friendships:', error);
    }
}

export async function getCurrentFriendInfo(username) {
    const response = await fetch(`/api/credentials/userid-info/?user=${username}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Failed to get current user info');
    }

    return await response.json();
}