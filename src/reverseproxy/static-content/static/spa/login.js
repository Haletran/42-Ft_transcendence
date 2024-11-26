import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';
import { logoutUser } from '../src/logout.js';

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
                        data-link="/login_base">
                        Login
                    </button>
		            <button id="42_oauth" class="btn mb-3 btn-outline-light d-flex align-items-center" type="submit"
                        >
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
		logoutUser();
		super.render();
		document.getElementById('42_oauth').addEventListener('click', () => {
			window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-24552aea517bf1496668f819d1dabbc2c0eb6d12a3e9c5e75a16a6b41738819c&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Fapi%2Fcallback&response_type=code';
		});

	}
}