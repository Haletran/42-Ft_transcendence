import { Router } from './src/router.js';
import { HomePage } from './spa/home.js';
import { RegisterPage } from './spa/register.js';
import { LoginPage } from './spa/login.js';
import { Monopoly } from './spa/monopoly.js';
import { Credit } from './spa/credits.js';
import { Pong } from './spa/pong.js';
import { Profile } from './spa/profile.js';
import { Settings } from './spa/settings.js';
import { Friends } from './spa/friends.js';
import { initializeCSRFToken } from './src/csrf.js';
import { loginBasePage } from './spa/login_base.js';
// import { logoutUser } from './src/logout.js';
import { Privacy } from './spa/privacy.js'
import { test } from './spa/404.js'

const routes = {
  '/': LoginPage, // accessible without auth, should log out
  '/register': RegisterPage, // accessible without auth, should log out
  '/home': HomePage,
  '/pong': Pong,
  '/profile': Profile,
  '/settings': Settings,
  '/monopoly': Monopoly,
  '/login_base': loginBasePage, // accessible without auth, should log out
  '/friends': Friends,
  '/privacy': Privacy,
  '/credits': Credit,
  '/404': test
};

export const router = new Router(routes);

document.addEventListener('DOMContentLoaded', () => {
  initializeCSRFToken();

  document.body.addEventListener('click', (e) => {
    const linkel = e.target.closest('[data-link]');
    if (linkel) {
      e.preventDefault();

      const path = linkel.getAttribute('data-link');
      if (path === '/profile' || path === '/settings' || path === '/friends' || path === '/privacy') {
        const footer = document.querySelector('footer');
        if (footer) {
          footer.classList.add('fixed-bottom');
        }
      } else {
        const footer = document.querySelector('footer');
        if (footer) {
          footer.classList.remove('fixed-bottom');
        }
      }
      router.goTo(path);
    }
  });

  const logo = document.querySelector('.navbar-brand[data-link]');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, null, logo.getAttribute('data-link'));
      router.navigate();
    });
  }
  (async () => {
    await router.initialize();
    if (!routes[window.location.pathname]) {
      router.goTo('/404');
    }
  })()
});

export async function checkUserAuthentification(path) {
  try {
    const isLogged = await isUserLoggedIn();
    const PublicPaths = ['/login_base', '/', '/register', '/404'];

    if (isLogged || PublicPaths.includes(path)) {
      return path;
    } else {
      return '/login_base';

    }
  } catch (error) {
    console.error('Error checking user authentication:', error);
    return '/login_base';
  }
}

export async function isUserLoggedIn() {
  try {
    const response = await fetch('/api/credentials/user-info', { method: 'GET', credentials: 'include' });
    if (response.ok) {
      const userData = await response.json();
      return userData != null;
    } else if (response.status === 401) {
      throw new Error('User not logged in');
    }
  } catch (error) {
    return false;
  }
  return false;
}

export async function get42() {
  try {
    const response = await fetch('/api/credentials/get42-info', { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      return data.url;
    }
  } catch (error) {
    console.error('Error fetching 42 info:', error);
  }
  return false;
}