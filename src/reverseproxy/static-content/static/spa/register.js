import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';
import { router } from '../app.js';
import { logoutUser } from '../src/logout.js';
import { startWebSocket } from './login_base.js';
import { isUserLoggedIn } from '../app.js';

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
				Your password must be at least 12 characters long.
				<br>It cannot contain your username.<br>
				It cannot be only numeric characters.<br>
			  </div>
			</div>

			<div class="mb-3">
				<br>
    			<label for="customProfilePicture" class="form-label">Upload your profile picture</label>
    			<input type="file" id="customProfilePicture" name="customProfilePicture" accept=".jpg, .jpeg, .png, .gif" class="form-control">
    		</div>

			<div class="mb-3 form-check">
			  <input type="checkbox" class="form-check-input" id="matchHistory" />
			  <label class="form-check-label" for="matchHistory">
			  	Do not keep track of my match history</label>
			</div>
			<div class="mb-3 form-check">
			  <input type="checkbox" class="form-check-input" id="displayFriends" />
			  <label class="form-check-label" for="displayFriends"
				>Do not display my profile informations to my friends</label
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
			    <p>Effective date: december 2025<br><br>
					Welcome to ft_transcendence. These terms and conditions govern your use of our Website, services, and any related content. By accessing or using ft_transcendence, you agree to comply with a be bound by these Terms.<br>
					To access the website, play the two games available, send friend requests and see your results history, you are required to create an account.<
					To do so, you need to agree to provide a username and an email (no emails will be sent), and optionally a profile picture. Other users will be able to send you friend request either using your username or your email.
					Additionally, all your game results might be collected by us to provide statistics and a record of the games you played. Please note that this data might be accessible to your friends.<br>
					<br><strong>These terms are construed in accordance with the General Data Protection Regulation (GDPR)</strong>, that guarantees that all data is processed by us in accordance with the principles edicted in the article 5.1-2:<br><br>
					"Lawfulness, fairness and transparency — Processing must be lawful, fair, and transparent to the data subject.<br>
    					Purpose limitation — You must process data for the legitimate purposes specified explicitly to the data subject when you collected it.<br>
    					Data minimization — You should collect and process only as much data as absolutely necessary for the purposes specified.<br>
    					Accuracy — You must keep personal data accurate and up to date.<br>
    					Storage limitation — You may only store personally identifying data for as long as necessary for the specified purpose.<br>
    					Integrity and confidentiality — Processing must be done in such a way as to ensure appropriate security, integrity, and confidentiality (e.g. by using encryption).<br>
    					Accountability — The data controller is responsible for being able to demonstrate GDPR compliance with all of these principles."<br>
						<br>
					If you wish to learn more about the GDPR, please follow this <a href="https://gdpr-info.eu/" target="_blank" id="gdpr-link">link.</a><br>
					<strong>At anytime, you will find those terms and condition, in addition to privacy settings to monitor our use of your data, under the Privacy section.<br>
					We will not share your data with any third-party, and if you wish to delete your match history, or delete your account, this data will be permanently erased from our databases.</strong><br>
				</p>
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

	async render() {
		const logBOOL = await isUserLoggedIn();
		if (logBOOL == true)
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
		});

		let matchHistoryBOOL = true;
		let friendsBOOL = true;
		let agreeBOOL = false;

		const matchHistory = document.getElementById('matchHistory');
		matchHistory.addEventListener('change', function () {
			if (this.checked) {
				matchHistoryBOOL = false;
			} else {
				matchHistoryBOOL = true;
			}
		});

		const displayFriends = document.getElementById('displayFriends');
		displayFriends.addEventListener('change', function () {
			if (this.checked) {
				friendsBOOL = false;
			} else {
				friendsBOOL = true;
			}
		});

		const agree = document.getElementById('conditions');
		agree.addEventListener('change', function () {
			if (this.checked) {
				agreeBOOL = true;
			} else {
				agreeBOOL = false;
			}
		});

		form.addEventListener('submit', async (e) => {
			e.preventDefault();

			let username = document.getElementById('registerUsername').value;
			let email = document.getElementById('registerEmail').value;
			const password = document.getElementById('registerPassword').value;

			// Prepare the data to send
			const formData = new FormData();
			formData.append('username', username);
			formData.append('email', email);
			formData.append('password', password);
			formData.append('matchHistory', matchHistoryBOOL);
			formData.append('friendsDisplay', friendsBOOL);

			if (agreeBOOL === false) {
				alert("Please agree to terms and conditions.");
				return;
			}
			username = username.trim();
			email = email.trim();
			if (username.search(' ') != -1 || email.search(' ') != -1) {
				alert("no space allowed in fields");
				return;
			}

			if (profileInput.files[0]) {
				const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
				if (!allowedTypes.includes(profileInput.files[0].type)) {
					alert('Only JPG, JPEG, PNG, and GIF files are allowed.');
					return;
				}
				formData.append('profile_picture', profileInput.files[0]);
			} else if (defaultFileBlob) {
				formData.append('profile_picture', defaultFileBlob)
			} else {
				alert('Default file is not ready yet! Please try again.');
				return;
			}

			try {
				const csrfToken = getCSRFToken('csrftoken');
				if (!csrfToken) {
					console.error('CSRF token is missing!');
				}

				// Send data to the backend
				const response = await fetch('/api/credentials/register/', {
					method: 'POST',
					headers: {
						'X-CSRFToken': csrfToken,
					},
					credentials: 'include',
					body: formData,
				});

				if (response.ok) {
					const result = await response.json();
					// startWebSocket();
					router.goTo('/home');
				} else {
					const error = await response.json();
					alert('Registration failed: ' + error.message);
				}
			} catch (error) {
				alert('An error occurred: ' + error.message);
			}
		});
	}
}