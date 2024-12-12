import { getCSRFToken } from './csrf.js';
import { closeWebSocket } from '../spa/login_base.js';
import { router } from '../app.js';

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
                closeWebSocket();
                console.log('Successfully logged out');
            } else {
                console.error('Logout failed');
            }
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
}

export async function deleteAccount() {

    try {

        const csrfToken = getCSRFToken('csrftoken');
        if (!csrfToken) {
            console.error('CSRF token is missing!');
        }

        const response = await fetch('/api/credentials/delete_account/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Account deleted:', result);
            router.goTo('/');
        } else {
            const error = await response.json();
            console.error('Account not deleted', error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    }

}