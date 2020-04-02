import {LitElement, html, css} from '/web_modules/lit-element.js';

// Import our other components
import '../my-theme.js';

// Import 3rd party webcomponents

class OmwWhatsNew extends LitElement {
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
    <div class="flex-item"><h2>What's New?</h2></div>
    <div class="flex-item">
      <p>Nothing at this time.</p>
    </div>
    <div class="flex-item"><h2>Coming soon and under review (in no specific order):</h2></div>
    <div class="flex-item">
      <ul>
        <li>Dark mode toggle button in the drawer will actually change to a dark mode theme</li>
        <li>Support for multiple timesheets</li>
        <li>Keyboard shortcuts while inside app</li>
        <li>Web Share Target support so the command-line version of omw can send entries to the PWA timesheets</li>
        <li>Time entry editing</li>
        <li>Export/Import timesheet data</li>
        <li>Assistant integration</li>
        <li>Sychronize your timesheet between multiple devices</li>
      </ul>
    </div>
    `;
  }

}

customElements.define('omw-whatsnew', OmwWhatsNew);
