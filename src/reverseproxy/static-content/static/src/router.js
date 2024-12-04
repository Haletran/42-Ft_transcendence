import { checkUserAuthentification, isUserLoggedIn } from "../app.js";
export class Router {

	constructor(routes) {
	  this.routes = routes;
	  // Navigate to the initial path
	  checkUserAuthentification(window.location.pathname)
	  //this.navigate();
	  // Add event listener for navigation
	  window.addEventListener('popstate', () => {
		this.navigate(); // This will handle back/forward navigation
	  });
	}
  
	navigate(path = window.location.pathname) {
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
  