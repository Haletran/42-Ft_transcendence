import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';

export class loginBasePage extends Page {
	constructor() {
		super();
		this.template = `
		<div
		  id="register_container"
		  class="d-flex justify-content-center align-items-center"
		  style="height: 85vh"
		>
		
		  <form
			id="login_form"
			class="p-4"
			style="
			  width: 400px;
			  border-radius: 10px;
			  background-color: transparent;
			  color: white;
			  border: 2px solid #393c49;
			"
		  >
			<div class="d-flex justify-content-between align-items-center mb-3">
			  <h3 class="text-center text-light fw-bold mb-0">Login</h3>
			  <button
				id="back_button"
				type="button"
				class="btn btn-light fw-bold opacity"
				data-link="/"
			  >
			  <i class="bi bi-x" data-link="/"></i>
			  </button>
			</div>

			<div class="mb-4 mt-3">
			  <label for="loginEmail" class="form-label">Email Address</label>
			  <input
				type="username"
				class="form-control text-bg-dark"
				id="loginEmail"
				aria-describedby="emailHelp"
				required
				placeholder="Enter your email"
			  />
			</div>

			<div class="mb-4">
			  <label for="loginPassword" class="form-label">Password</label>
			  <input
				type="password"
				class="form-control text-bg-dark"
				id="loginPassword"
				required
				placeholder="Enter your password"
			  />
			</div>

			<div class="d-flex justify-content-between flex-column gap-2">
			  <button
				id="login_button"
				type="submit"
				class="btn btn-outline-light full-width btn-custom"
			  >
				Login
			  </button>
			  <button id="42_oauth"
				class="btn btn-custom btn-42 d-flex align-items-center justify-content-center gap-1"
			  >
				Login with
				<img src="/static/imgs/42.png" alt="42" width="40">
			  </button>
			</div>

			<div class="d-flex justify-content-center p-2 gap-2">
			  <span class="text-muted">Don't have an account yet?</span>
			  <a href="#" data-link="register" class="text-white fw-semibold">Register</a>
			</div>
		  </form>
		</div>
	  `;
	}
	render() {
		super.render(); // Call the parent render method
		this.attachFormLoginListener(); // Now attach the listener here
		// document.getElementById('42_oauth').addEventListener('click', () => {
		// 	window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-24552aea517bf1496668f819d1dabbc2c0eb6d12a3e9c5e75a16a6b41738819c&redirect_uri=http%3A%2F%2F10.11.249.22%3A9000%2Fapi%2Fcallback&response_type=code';
		// });
		this.loading_42();
	}

	loading_42() {
		document.getElementById('42_oauth').onclick = async function () {
			document.querySelector('.loader').style.display = 'flex';
			document.getElementById('app').style.display = 'none';
			await new Promise(r => setTimeout(r, 200));
			window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-24552aea517bf1496668f819d1dabbc2c0eb6d12a3e9c5e75a16a6b41738819c&redirect_uri=http%3A%2F%2F10.11.249.22%3A9000%2Fapi%2Fcallback&response_type=code';
		};
	}

	attachFormLoginListener() {
		const form = document.getElementById('login_form');

		form.addEventListener('submit', async (e) => {
			document.querySelector('.loader').style.display = 'flex';
			document.getElementById('app').style.display = 'none';
			e.preventDefault(); // Prevent the default form submission

			const username = document.getElementById('loginUsername').value;
			const password = document.getElementById('loginPassword').value;

			// Prepare the data to send
			const data = { username, password };

			try {
				console.log('CSRF Token:', getCSRFToken('csrftoken'));
				const csrfToken = getCSRFToken('csrftoken');
				if (!csrfToken) {
					console.error('CSRF token is missing!');
				}

				const response = await fetch('/api/login/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': csrfToken,
					},
					credentials: 'include',
					body: JSON.stringify(data),
				});

				if (response.ok) {
					const result = await response.json();
					console.log('Login successful:', result);
					window.location.href = '/home';
				} else {
					const error = await response.json();
					console.error('Login failed:', error);
					alert('Login failed: ' + error.message);
				}
			} catch (error) {
				console.error('Error:', error);
				alert('An error occurred: ' + error.message);
			}
		});
	}
}