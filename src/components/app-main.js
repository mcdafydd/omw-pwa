import {LitElement, html} from '/web_modules/lit-element.js';
import {outlet} from '/web_modules/lit-element-router.js';

class Main extends outlet(LitElement) {
  render() {
    return html`
      <slot></slot>
    `;
  }
}

customElements.define('app-main', Main);
