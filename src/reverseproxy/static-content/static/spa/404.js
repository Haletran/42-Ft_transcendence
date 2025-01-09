import { Page } from '../src/pages.js';

export class test extends Page {
    constructor() {
        super();
        this.template = `
            <div class="app">
            <div class="container d-flex flex-column justify-content-center align-items-center gap-3"
            style="min-height: 90vh">
                <div class="text-center">
                <h1 class="display-1 fw-bold text-primary">404</h1>
                <p class="fs-3 text-muted"> <span class="text-danger">Oops!</span> Page not found.</p>
                <p class="lead">
                    The page you’re looking for doesn’t exist.
                </p>
                <a href="/" class="btn btn-primary">Go Home</a>
                </div>
            </div>
        </div>
        `;
    }
    async render() {
        super.render();
        console.log('404');
    }
}