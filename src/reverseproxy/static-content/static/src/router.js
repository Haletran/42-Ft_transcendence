import { checkUserAuthentification, isUserLoggedIn } from "../app.js";
export class Router {

	constructor(routes) {
	  console.log('In router constructor');
	  this.routes = routes;
	  // Navigate to the initial path
	  //checkUserAuthentification(window.location.pathname)
	  this.authPath = null;
	  // Add event listener for navigation
	  window.addEventListener('popstate', () => {
		console.log('back and forth');
		this.navigate(window.location.pathname); // back/forward arrows
	  });
	}
  
	async initialize() {
		const npath = window.location.pathname;
		this.authPath = await checkUserAuthentification(npath);
		this.navigate(this.authPath);
	}
	async navigate(path = this.authPath || window.location.pathname) {

	  console.log('In navigate -> Navigating to:', path);
	  const route = this.routes[path] || this.notFoundPage;
	  console.log('In navigate -> Route found:', route.name);
  
	  const page = new route();
	  document.getElementById('app').innerHTML = page.template;
	  page.render();
	}
  
	goTo(path) {
	  console.log('In go to');
	  window.history.pushState({}, '', path);
	  this.navigate(path);
	}
  }
  