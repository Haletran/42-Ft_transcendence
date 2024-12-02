import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';

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
			<button
			  id="back_button"
			  type="button"
			  class="btn btn-light fw-bold opacity"
			  data-link="/login_base"
			>
			  Back
			</button>
			<h3 class="text-center text-light fw-bold">Register</h3>
			<div class="mb-3">
			  <label for="registerUsername" class="form-label">Username</label>
			  <input
			  	type="username"
				class="form-control text-bg-dark"
				id="registerUsername"
			  />
			</div>
			<div class="mb-3">
			  <label for="registerEmail" class="form-label">Email address</label>
			  <input
				type="email"
				class="form-control text-bg-dark"
				id="registerEmail"
				aria-describedby="emailHelp"
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
			  />
			  <div id="passwordHelpBlock" class="form-text text-white">
				Your password must be 8-20 characters long.
			  </div>
			</div>

			<div class="mb-3">
				<label for="profilePicture" class="form-label">Choose a profile picture...</label>
				<div id="profilePictures" class="d-flex justify-content-around gap-2">
				  <button type="button" class="profile-pic-btn">	
					<img src="/static/imgs/asterix.gif" alt="Profile Pic 2" class="profile-pic" data-pic="pic2.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				  <button type="button" class="profile-pic-btn">
					<img src="/static/imgs/spirou.jpeg" alt="Profile Pic 3" class="profile-pic" data-pic="pic3.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				  <button type="button" class="profile-pic-btn">
					<img src="/static/imgs/gaston.jpg" class="profile-pic" data-pic="pic4.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				  <button type="button" class="profile-pic-btn">
					<img src="/static/imgs/haddock.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				</div>
				<br>
    			<label for="customProfilePicture" class="form-label">or upload your own</label>
    			<input type="file" id="customProfilePicture" name="customProfilePicture" accept="image/*" class="form-control">
    		</div>

			<div class="mb-3 form-check">
			  <input type="checkbox" class="form-check-input" id="stayConnected" />
			  <label class="form-check-label" for="stayConnected"
				>Stay Connected</label
			  >
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
		super.render(); // Call the parent render method
		this.attachFormListener(); // Now attach the listener here
	}

	attachFormListener() {
		const form = document.getElementById('register_form');
		let imageURL = '';

		const profilePics = document.getElementById('profilePictures');
		profilePics.addEventListener('click', (event) => {
			const clicked = event.target.closest('img');
			if (clicked) {
				imageURL = clicked.src;
				console.log('Selected Image URL', imageURL);
			}
		});

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

			if (imageURL) {
				formData.append('profile_picture', imageURL);
				console.log(imageURL);
			}
			else if (profileInput.files[0]) {
				formData.append('profile_picture', profileInput.files[0]);
				console.log('UPLOADDDDDD');
				console.log(profileInput.files[0]);
			}
			//   if (imageURL) {
			//   	data = {
			// 		username: username,
			//   		email: email,
			//   		password: password,
			// 		profile_picture: imageURL,
			//   	};
			//   }
			//   else if (profileInput.files[0]) {
			//   	data = {
			// 		username: username,
			//   		email: email,
			//   		password: password,
			// 		profile_picture: profileInput.files[0],
			//   	};
			//   }

			//{ email, password, pic };

			try {

				// get CSRF token
				console.log('CSRF Token:', getCSRFToken('csrftoken'));
				const csrfToken = getCSRFToken('csrftoken');
				if (!csrfToken) {
					console.error('CSRF token is missing!');
				}

				// Send data to the backend

				const response = await fetch('/api/register/', {
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
					// Optionally, redirect to login or home page
					window.location.href = '/home';
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