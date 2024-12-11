import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';
import { router } from '../app.js';
import { logoutUser } from '../src/logout.js';
import { startWebSocket } from './login_base.js';

export class RegisterPage extends Page {
	constructor() {
		super();
		this.template = `
		<div
		  id="register_container"
		  class="d-flex justify-content-center align-items-center"
		  style="height: 85vh"
		>
		  <div class="blob"></div>
		  <form
			id="register_form"
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
			  <h3 class="text-center text-light fw-bold mb-0">Register</h3>
			  <button
				id="back_button"
				type="button"
				class="btn btn-light fw-bold opacity"
				data-link="/login_base"
			  >
			  <i class="bi bi-x" data-link="/login_base"></i>
			  </button>
			</div>
			<div class="mb-3">
			  <label for="registerUsername" class="form-label">Username</label>
			  <input
			  	type="username"
				class="form-control text-bg-dark"
				id="registerUsername"
				placeholder="Enter a username"
			  />
			</div>
			<div class="mb-3">
			  <label for="registerEmail" class="form-label">Email address</label>
			  <input
				type="email"
				class="form-control text-bg-dark"
				id="registerEmail"
				aria-describedby="emailHelp"
				placeholder="Enter your email"
			  />
			  <div id="emailHelp" class="form-text text-white">
				We'll never share your email with anyone else.
			  </div>
			</div>
			<div class="mb-3">
			  <label for="registerPassword" class="form-label">Password</label>
			  <input
				type="password"
				class="form-control text-bg-dark"
				id="registerPassword"
				placeholder="Enter a password"
			  />
			  <div id="passwordHelpBlock" class="form-text text-white">
				Your password must be 8-20 characters long.
			  </div>
			</div>

			<div class="mb-3">
				<br>
    			<label for="customProfilePicture" class="form-label">Upload your profile picture</label>
    			<input type="file" id="customProfilePicture" name="customProfilePicture" accept="image/*" class="form-control">
    		</div>

			<div class="mb-3 form-check">
			  <input type="checkbox" class="form-check-input" id="matchHistory" />
			  <label class="form-check-label" for="stayConnected"
				>Allow match history</label
			  >
			</div>
			<div class="mb-3 form-check">
			  <input type="checkbox" class="form-check-input" id="displayFriends" />
			  <label class="form-check-label" for="stayConnected"
				>Allow friends to see your profile</label
			  >
			</div>
			<div class="mb-3 form-check">
			  <input type="checkbox" class="form-check-input" id="conditions" />
			  <label class="terms-check-label" for="conditions"
				>I have read and agree to the <a href="#" id="terms-link">terms and conditions</a></label
			  >
			</div>
			<div id="terms-modal" class="terms-modal">
			  <div>
			    <h2>Terms and Conditions</h2>
			    <p>Your terms and conditions go here...</p>
			    <button id="close-modal" type="button">Close</button>
			  </div>
			</div>
             <div class="d-flex justify-content-between flex-column gap-2">
                <button id="register_button" 
                type="submit" 
                class="btn btn-outline-light full-width"
                >Register</button>
             </div>
		  </form>
		</div>
	  `;
	}

	render() {
		logoutUser();
		
		super.render();

		this.attachFormListener();
	}
	
	attachFormListener() {
		const form = document.getElementById('register_form');

		const termLinks = document.getElementById("terms-link");
		const termModals = document.getElementById("terms-modal");
		const closeModalButton = document.getElementById("close-modal");

		termLinks.addEventListener('click', function (event) {
			event.preventDefault();
			termModals.classList.add('visible');
			});

		closeModalButton.addEventListener('click', function (event) {
			termModals.classList.remove('visible');
		});

		const defaultPic = '/static/imgs/gaston.jpg';
		let defaultFileBlob = null;

		fetch(defaultPic)
			.then(response => response.blob())
			.then(blob => {
				defaultFileBlob = new File([blob], 'default-profile.jpg', { type: blob.type });
			})
			.catch(error => console.error('Error fetching default file:', error));

		const profileInput = document.getElementById('customProfilePicture');
		profileInput.addEventListener('change', () => {
			imageURL = null;
			console.log("Uploaded file:", profileInput.files[0]);
		});

		form.addEventListener('submit', async (e) => {
			e.preventDefault(); // Prevent the default form submission

			const username = document.getElementById('registerUsername').value;
			console.log(username);
			const email = document.getElementById('registerEmail').value;
			const password = document.getElementById('registerPassword').value;



			// Prepare the data to send
			const formData = new FormData();
			formData.append('username', username);
			formData.append('email', email);
			formData.append('password', password);

			if (profileInput.files[0]) {
				formData.append('profile_picture', profileInput.files[0]);
				console.log(profileInput.files[0]);
			} else if (defaultFileBlob) {
				formData.append('profile_picture', defaultFileBlob)
			} else {
				console.error('Default file is not ready yet!');
				alert('Default file is not ready yet! Please try again.');
				return;
			}

			try {

				// get CSRF token
				console.log('CSRF Token:', getCSRFToken('csrftoken'));
				const csrfToken = getCSRFToken('csrftoken');
				if (!csrfToken) {
					console.error('CSRF token is missing!');
				}

				// Send data to the backend

				const response = await fetch('/api/credentials/register/', {
					method: 'POST',
					headers: {
						//'Content-Type': 'application/json',
						'X-CSRFToken': csrfToken,
					},
					credentials: 'include',
					//body: JSON.stringify(data),
					body: formData,
				});

				if (response.ok) {
					const result = await response.json();
					console.log('Registration successful:', result);
					startWebSocket();
					// Optionally, redirect to login or home page
					router.goTo('/home');
				} else {
					const error = await response.json();
					console.error('Registration failed:', error);
					alert('Registration failed: ' + error.message);
				}
			} catch (error) {
				console.error('Error:', error);
				alert('An error occurred: ' + error.message);
			}
		});
	}
}