export class Router {
	constructor(routes) {
	  this.routes = routes;
  
	  // Navigate to the initial path
	  this.navigate();
  
	  // Add event listener for navigation
	  window.addEventListener('popstate', () => {
		this.navigate(); // This will handle back/forward navigation
	  });
	}
  
	navigate(path = window.location.pathname) {
	  console.log('Navigating to:', path);
	  const route = this.routes[path] || this.notFoundPage; // Handle 404 page if route not found
	  console.log('Route found:', route.name);
  
	  const page = new route(); // Create an instance of the route page
	  document.getElementById('app').innerHTML = page.template; // Render the template to the app container
	  page.render(); // Optionally call a render method if needed for further initialization
	}
  
	goTo(path) {
	  window.history.pushState({}, '', path); // Update the URL without reloading
	  this.navigate(path); // Navigate to the new path
	}
  }
  