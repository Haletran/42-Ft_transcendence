import { checkUserAuthentification, isUserLoggedIn } from "../app.js";

export class Router {

	constructor(routes) {
		this.routes = routes;
		this.authPath = null;
		window.addEventListener('popstate', () => {
			this.navigate(window.location.pathname);
		});
	}

	async initialize() {
		const npath = window.location.pathname;
		this.authPath = await checkUserAuthentification(npath);
		this.navigate(this.authPath);
	}
	async navigate(path = this.authPath || window.location.pathname) {

		const route = this.routes[path] || this.notFoundPage;
		const page = new route();
		document.getElementById('app').innerHTML = page.template;
		page.render();
	}

	goTo(path) {
		window.history.pushState({}, '', path);
		this.navigate(path);
	}
}
