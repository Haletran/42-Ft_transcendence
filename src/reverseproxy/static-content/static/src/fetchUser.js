export async function fetchUserInfo() {
    try {
        const response = await fetch ('/api/user-info/', {
            method: 'GET',
            credentials: 'include',
        });

    if (response.ok) {
        const userData = await response.json();
        updateProfilePicture(userData.profile_picture);
    }
    else /*if (response.status === 401)*/ {
        console.log(response.status);
        console.log('User not logged in');
        hideProfilePicture();
    }
    //else
    //    console.error("Fail in user info:", response.status);
    }
    catch (error) {
        console.error("Fail in user info scnd:", error);
    }
}

function updateProfilePicture(profilePictureUrl) {
    const profilePic = document.querySelector('img[alt ="logo_profile_picture"]');
    console.log(profilePictureUrl);
    profilePic.src = profilePictureUrl;
}

function hideProfilePicture() {
    const profilePicElement = document.querySelector('img[alt="logo_profile_picture"]');
    profilePicElement.style.display = 'none';
  }