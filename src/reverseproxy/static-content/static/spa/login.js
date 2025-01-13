import { Page } from '../src/pages.js';
import { getCSRFToken } from '../src/csrf.js';
import { logoutUser } from '../src/logout.js';
import { isUserLoggedIn, router } from '../app.js';
import { setACookie } from '../js/utils.js';

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

    async render() {
        try {
            const loggedIn = await isUserLoggedIn();
            if (loggedIn != false) {
                router.goTo('/home');
                return;
            }
        } catch (error) {
            logoutUser();
        }
        setACookie('game_running', 'false', 1);
        super.render();
    }
}