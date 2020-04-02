import {LitElement, html, css} from '/web_modules/lit-element.js';

// Import our other components
import '../my-theme.js';

// Import 3rd party webcomponents

class OmwExtras extends LitElement {
  static get properties() {
    return {
    };
  }

  static get styles() {
    return css`
    :host {
      display: block;
    }
    :host([hidden]) { display: none; }

    .flex-container {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-flex-wrap: nowrap;
      -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: start;
      justify-content: flex-start;
      -webkit-align-content: flex-start;
      -ms-flex-line-pack: start;
      align-content: flex-start;
      -webkit-align-items: flex-start;
      -ms-flex-align: start;
      align-items: flex-start;
    }

    .flex-item:nth-child(1) {
      font-family: Tangerine;
      -webkit-order: 0;
      -ms-flex-order: 0;
      order: 0;
      -webkit-flex: 0 1 auto;
      -ms-flex: 0 1 auto;
      flex: 0 1 auto;
      -webkit-align-self: stretch;
      -ms-flex-item-align: stretch;
      align-self: stretch;
    }

    .flex-item:nth-child(2) {
      -webkit-order: 0;
      -ms-flex-order: 0;
      order: 0;
      -webkit-flex: 1 1 auto;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      -webkit-align-self: stretch;
      -ms-flex-item-align: stretch;
      align-self: stretch;
    }
     `;
  }

  constructor() {
    super();
  }
  render() {
    return html`
    <div class="flex-container">
    <div class="flex-item"><h2>Extras</h2></div
    <div class="flex-item">
    <p>Extras are not available yet. We are working on extensions to the reporting system to facilitate easy migration of tasks from the Omw timesheet into other time tracking systems.  The first systems being reviewed are Workday and Azure Boards.</p>
    </div>
    `;
  }

}

customElements.define('omw-extras', OmwExtras);
