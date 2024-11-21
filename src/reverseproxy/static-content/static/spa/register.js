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
			  <label for="registerEmail" class="form-label"
				>Email address</label
			  >
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
				<label for="profilePicture" class="form-label">Choose a profile picture</label>
				<div id="profilePictures" class="d-flex justify-content-around gap-2">
				  <button type="button" class="profile-pic-btn">
					<img src="https://cdn.intra.42.fr/users/65ca7a946948378f5cf99fb253ea4907/bapasqui.jpg" alt="Profile Pic 1" class="profile-pic" data-pic="pic1.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				  <button type="button" class="profile-pic-btn">	
					<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.asterix.com%2Fillus%2Fasterix-de-a-a-z%2Fles-personnages%2Fperso%2Fg09b.gif&f=1&nofb=1&ipt=cfac469a6be48f3e2605046abda8e951dca4d7df0fe992f3671dbb2a8f138bef&ipo=images" alt="Profile Pic 2" class="profile-pic" data-pic="pic2.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				  <button type="button" class="profile-pic-btn">
					<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2Fa%2FAGF-l7--byG5GmricLArCBG8Z22vUh_aBty7iBuE_g%3Ds900-c-k-c0xffffffff-no-rj-mo&f=1&nofb=1&ipt=1a23ae84ed1fc659ca24019a82eb57172bb67fd39011b10a447dd4267ce972f5&ipo=images" alt="Profile Pic 3" class="profile-pic" data-pic="pic3.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				  <button type="button" class="profile-pic-btn">
					<img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.anniversaire-celebrite.com%2Fupload%2F250x333%2Fgaston-lagaffe-250.jpg&f=1&nofb=1&ipt=53a428ca710bb37ea8805c2cb05bb36d77f0f755da02d93de43d40fa78b0eeb2&ipo=images" alt="Profile Pic 4" class="profile-pic" data-pic="pic4.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				  <button type="button" class="profile-pic-btn">
					<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fa0%2F30%2F4f%2Fa0304f8b33cf2c7a891dcc970133d58a.jpg&f=1&nofb=1&ipt=0f6532af6f67a73c91a735320257aba21c7aed6e50a5c957d79e3da29ec1a188&ipo=images" alt="Profile Pic 5" class="profile-pic" data-pic="pic5.jpg" style="width: 60px; cursor: pointer; border-radius: 50%;" />
				  </button>
				</div>
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

		form.addEventListener('submit', async (e) => {
		  e.preventDefault(); // Prevent the default form submission
		  
		  const email = document.getElementById('registerEmail').value;
		  const password = document.getElementById('registerPassword').value;
			console.log(imageURL);
		  // add profile picture
		 // console.log(profilePics);
		  

		  
		  // Prepare the data to send
		  const data = {
		  	email: email,
		  	password: password,
			profile_picture: imageURL,
		  };
		  
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
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
			  },
			  credentials: 'include',
			  body: JSON.stringify(data),
			});
	
			if (response.ok) {
			  const result = await response.json();
			  console.log('Registration successful:', result);
			  // Optionally, redirect to login or home page
			  window.location.href = '/';
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