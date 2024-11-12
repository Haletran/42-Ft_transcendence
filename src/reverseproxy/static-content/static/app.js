import { Router } from './src/router.js';
import { HomePage} from './spa/home.js';
import { RegisterPage } from './spa/register.js';
import { LoginPage } from './spa/login.js';
import { Games } from './spa/games.js';
import { Pong } from './spa/pong.js';

const routes = {
  '/': HomePage,
  '/register': RegisterPage,
  '/login' : LoginPage,
  '/games' : Games,
  '/pong' : Pong,
};

const router = new Router(routes);

document.addEventListener('DOMContentLoaded', () => {
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