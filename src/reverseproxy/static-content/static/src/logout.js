import { getCSRFToken } from './csrf.js';
import { closeWebSocket } from '../spa/login_base.js';
import { router } from '../app.js';
import { deleteACookie } from '../js/utils.js';

export function logoutUser() {

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
                deleteACookie('game_running');
                deleteACookie('credits');
                localStorage.clear();
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