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
                    <div class="d-flex flex-column align-items-center">
                    <p class="montserrat-bold fs-1 mb-0">Ft_transcendence</p>
                    <p class="montserrat-bold-400 text-secondary" >Fullstack Gaming website</p>
                    </div>
                    <button class="btn btn-light" type="button" data-link="/login_base" style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 1em;">Play Now</button>
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