import { Page } from '../src/pages.js';

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
              data-link="/"
              >
			  Back
			</button>
			<h3 class="text-center text-light fw-bold">Login</h3>
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
			</div>
			<div class="mb-3">
			  <label for="registerPassword" class="form-label">Password</label>
			  <input
				type="password"
				class="form-control text-bg-dark"
				id="registerPassword"
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
    render() {
      super.render(); // Call the parent render method
  }
    }