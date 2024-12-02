import { Page } from '../src/pages.js';
import { initializeCSRFToken } from '../src/csrf.js';

export class LoginPageTest extends Page {
    constructor() {
        super();
        this.template = `
            <form id="login_form" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" id="csrf_token">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <br>
                <button type="submit">Login</button>
            </form>
        `;
    }

    async render() {
        super.render();
        initializeCSRFToken();
        await this.populateUserInfo();
        this.attachFormListener();
    }

    async populateUserInfo() {
        try {
            const userInfo = await getCurrentUserInfo();
            document.getElementById('username').value = userInfo.username;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    attachFormListener() {
        const form = document.getElementById('login_form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const data = {
                username: formData.get('username'),
                password: formData.get('password'),
                csrfmiddlewaretoken: formData.get('csrfmiddlewaretoken')
            };

            try {
                const response = await fetch('/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': data.csrfmiddlewaretoken
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.href = '/home';
                } else {
                    const errorData = await response.json();
                    alert('Login failed: ' + errorData.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            }
        });
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