import { getCSRFToken } from './csrf.js';

export function logoutUser() {

    // get CSRF token
    console.log('CSRF Token:', getCSRFToken('csrftoken'));
    const csrfToken = getCSRFToken('csrftoken');
    if (!csrfToken) {
        console.error('CSRF token is missing!');
    }

    fetch('/api/credentials/logout/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    })
        .then((response) => {
            if (response.ok) {
                console.log('Successfully logged out');
            } else {
                console.error('Logout failed');
            }
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
}