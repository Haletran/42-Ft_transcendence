import { router } from '../app.js';

export async function fetchProfileInfo() {
    try {
        const response = await fetch('/api/credentials/user-info/', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('username').innerText = userData.username;
            document.getElementById('email').innerText = userData.email;
            updateProfilePicture(userData.profile_picture);
        }
        else {
            console.log(response.status);
            console.log('User not logged in');
            hideProfilePicture();
        }
        //else
        //    console.error("Fail in user info:", response.status);
    }
    catch (error) {
        console.error("User not logged in:", error);
        // here to check 42 login
        router.goTo('/');
    }
}

export function updateProfilePicture(profilePictureUrl) {
    const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
    console.log(profilePictureUrl);
    profilePic.src = profilePictureUrl;
    if (document.querySelector('img[alt="profile_picture_main"]'))
        document.querySelector('img[alt="profile_picture_main"]').src = profilePictureUrl;
}

function hideProfilePicture() {
    const profilePicElement = document.querySelector('img[alt="logo_profile_picture"]');
    profilePicElement.style.display = 'none';
}

function updateProfileMail(Mail) {
    console.log(Mail);
    const profileMail = document.querySelector('input[type="email"]');
    profileMail.value = Mail;
}

function updateProfileUsername(Username) {
    console.log(Username);
    const profileUsername = document.querySelector('input[type="username"]');
    profileUsername.value = Username;
}

export async function getProfileName() {
    try {
        const response = await fetch('er-info/', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const userData = await response.json();
            return userData.email;
        } else {
            console.log(response.status);
            console.log('User not logged in');
            return null;
        }
    } catch (error) {
        console.error("User not logged in:", error);
        return null;
    }
}

export async function fetchSettingsInfo() {
    try {
        const response = await fetch('/api/credentials/user-info/', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const userData = await response.json();
            updateProfileUsername(userData.username);
            updateProfilePicture(userData.profile_picture);
            updateProfileMail(userData.email);
        }
        else /*if (response.status === 401)*/ {
            console.log(response.status);
            console.log('User not logged in');
            router.goTo('/');
        }
        //else
        //    console.error("Fail in user info:", response.status);
    }
    catch (error) {
        console.error("User not logged in:", error);
        router.goTo('/');
    }
}

export async function fetchMinInfo() {
    try {
        const response = await fetch('/api/credentials/user-info/', {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const userData = await response.json();
            console.log('fetchMinInfo', userData.profile_picture);
            updateProfilePicture(userData.profile_picture);
        }
        else {
            console.log(response.status);
            console.log('User not logged in');
            router.goTo('/');
        }
    } catch (error) {
        console.error("User not logged in:", error);
        router.goTo('/');
    }
}

export async function fetchMonopInfo() {
    try {
        const response = await fetch('er-info/', {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const userData = await response.json();
            console.log('fetchMinInfo', userData.profile_picture);
            updateProfilePicture(userData.profile_picture);
            document.getElementById("username").textContent = userData.username;
        }
        else {
            console.log(response.status);
            console.log('User not logged in');
            router.goTo('/');
        }
    } catch (error) {
        console.error("User not logged in:", error);
        router.goTo('/');
    }
}

export async function getUserInfos() {
    try {
        const response = await fetch('/api/credentials/user-info/', {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const userData = await response.json();
        }
        else {
            console.log(response.status);
            console.log('User not logged in');
            router.goTo('/');
        }
    } catch (error) {
        console.error("User not logged in:", error);
        router.goTo('/');
    }
}