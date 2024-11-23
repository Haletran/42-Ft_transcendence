import { Router } from './src/router.js';
import { HomePage} from './spa/home.js';
import { RegisterPage } from './spa/register.js';
import { LoginPage } from './spa/login.js';
import { Games } from './spa/games.js';
import { Monopoly } from './spa/monopoly.js';
import { Pong } from './spa/pong.js';
import { Profile } from './spa/profile.js';
import { Chat } from './spa/chat.js';
import { Settings } from './spa/settings.js';
import { initializeCSRFToken } from './src/csrf.js';
import { fetchUserInfo } from './src/fetchUser.js';
import { loginBasePage } from './spa/login_base.js';
import { logoutUser } from './src/logout.js';
 
const routes = {
  '/': LoginPage,
  '/register': RegisterPage,
  '/home' : HomePage,
  '/games' : Games,
  '/pong' : Pong,
  '/profile' : Profile,
  '/settings' : Settings,
  '/chat' : Chat,
  '/monopoly' : Monopoly,
  '/login_base' : loginBasePage,
  '/logout' : logoutUser,
};

const router = new Router(routes);

document.addEventListener('DOMContentLoaded', () => {
  initializeCSRFToken();
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      history.pushState(null, null, e.target.getAttribute('data-link'));
      router.navigate();
    }
  });
  
	    // Add a specific event listener for the logo
	const logo = document.querySelector('.navbar-brand[data-link]');
	if (logo) {
	  logo.addEventListener('click', (e) => {
		e.preventDefault();
		history.pushState(null, null, logo.getAttribute('data-link'));
		router.navigate();
	  });
	}

  window.addEventListener('popstate', router.navigate.bind(router));
  router.navigate();
});