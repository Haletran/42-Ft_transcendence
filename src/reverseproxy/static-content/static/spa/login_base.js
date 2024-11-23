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
		  <div class="blob"></div>
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
			<button
			  id="back_button"
			  type="button"
			  class="btn btn-light fw-bold opacity"
              data-link="/"
              >
			  Back
			</button>
			<h3 class="text-center text-light fw-bold">Login</h3>
			<div class="mb-3">
			  <label for="loginEmail" class="form-label"
				>Email address</label
			  >
			  <input
				type="email"
				class="form-control text-bg-dark"
				id="loginEmail"
				aria-describedby="emailHelp"
			  />
			</div>
			<div class="mb-3">
			  <label for="loginPassword" class="form-label">Password</label>
			  <input
				type="password"
				class="form-control text-bg-dark"
				id="loginPassword"
			  />
			</div>
			<div class="mb-3 form-check">
			  <input type="checkbox" class="form-check-input" id="stayConnected" />
			  <label class="form-check-label" for="stayConnected"
				>Stay Connected</label
			  >
			</div>
			<div class="d-flex justify-content-between">
                <a href="#" class="text-white">Forgot password?</a>
                <a href="#" data-link=register class="text-white">Create an account</a>
            </div>
             <div class="d-flex justify-content-between flex-column gap-2">
                <button id="register_button" 
                type="submit" 
                class="btn btn-outline-light full-width"
                >Login</button>
             </div>
		  </form>
		</div>
	  `;
    }
	render()
	{
		super.render(); // Call the parent render method
		this.attachFormLoginListener(); // Now attach the listener here
	}
	
	attachFormLoginListener() {
		const form = document.getElementById('login_form');

		form.addEventListener('submit', async (e) => {
		  e.preventDefault(); // Prevent the default form submission
		  
		  const email = document.getElementById('loginEmail').value;
		  const password = document.getElementById('loginPassword').value;
	
		  // Prepare the data to send
		  const data = { email, password };

		  try {

			// get CSRF token
			console.log('CSRF Token:', getCSRFToken('csrftoken'));
			const csrfToken = getCSRFToken('csrftoken');
			if (!csrfToken) {
				console.error('CSRF token is missing!');
			}

			// Send data to the backend
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
			  alert('YOU ARE LOGGED IN MWAH!');
			  // Optionally, redirect to home page or another page
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