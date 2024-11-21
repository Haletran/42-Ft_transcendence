import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';

export class LoginPage extends Page {
	constructor() {
	  super();
	  this.template = `
        <div class="menu">
            <div class="d-flex flex-row justify-content-center align-items-center" style="min-height: 90vh">
                <div class="d-flex flex-column align-items-center">
                    <div class="d-flex flex-row align-items-center gap-1">
                        <p class="montserrat-bold fs-1 animate__animated">Ft_transcendence</p>
                    </div>
                    <button class="btn mb-3 btn-outline-light d-flex align-items-center" type="submit"
                        data-link="/home">
                        Login with
                        <img class="logo" src="/static/imgs/42.png" alt="google" width="40">
                    </button>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            Stay connected
                        </label>
                    </div>
                </div>
            </div>
        </div>
	  `;
	}
	
	render() {
		super.render(); // Call the parent render method
		//this.attachFormListener(); // Now attach the listener here
	  }
	  
	// attachFormListener() {
	// 	const form = document.getElementById('register_form');
	// 	form.addEventListener('submit', async (e) => {
	// 	  e.preventDefault(); // Prevent the default form submission
		  
	// 	  const email = document.getElementById('registerEmail').value;
	// 	  const password = document.getElementById('registerPassword').value;
	
	// 	  // Prepare the data to send
	// 	  const data = { email, password };
	
	// 	  try {
	// 		// get the CSRF Token
	// 		const csrfToken = getCSRFToken('csrftoken');

	// 		// Send data to the backend
	// 		const response = await fetch('/api/register/', {
	// 		  method: 'POST',
	// 		  headers: {
	// 			'Content-Type': 'application/json',
	// 			'X-CSRFToken': csrfToken,
	// 		  },
	// 		  credentials: 'include',
	// 		  body: JSON.stringify(data),
	// 		});
	
	// 		if (response.ok) {
	// 		  const result = await response.json();
	// 		  console.log('Registration successful:', result);
	// 		  // Optionally, redirect to login or home page
	// 		  // window.location.href = '/';
	// 		} else {
	// 		  const error = await response.json();
	// 		  console.error('Registration failed:', error);
	// 		  alert('Registration failed: ' + error.message);
	// 		}
	// 	  } catch (error) {
	// 		console.error('Error:', error);
	// 		alert('An error occurred: ' + error.message);
	// 	  }
	// 	});
	  }