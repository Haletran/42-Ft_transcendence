export class Page {
  constructor() {
    this.template = '';
  }

  render() {
    document.getElementById('app').innerHTML = this.template;
  }
}

