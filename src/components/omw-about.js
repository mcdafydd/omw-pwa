// LitElement and html are the basic required imports
import {LitElement, html, css} from '/web_modules/lit-element.js';

// Import our other components
import '../my-theme.js';

// Import 3rd party webcomponents

class OmwAbout extends LitElement {
  static get properties() {
    return {
    };
  }

  static get styles() {
    return css`
    :host {
      display: block;
      font-family: Roboto;
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

    .flex-item:nth-child(3) {
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

    .flex-item:nth-child(4) {
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

    .flex-item:nth-child(5) {
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

    .icon {
      display: inline-block;
      width: 1em;
      height: 1em;
      stroke-width: 0;
      stroke: currentColor;
      fill: currentColor;
    }
     `;
  }

  render() {
    return html`
    <div class="flex-container">
      <div class="flex-item"><h2>About</h2></div>
      <div class="flex-item">
      <p>Out Of My Way (omw) is a minimalist time tracker with the primary goal of helping you stay in flow while accurately tracking time at work. A secondary goal of omw is to help create an army of good people who can use their talents for the world to do things better than track time.  It is stateless, with no running per-task clock in the background, and works by simply adding new entries to your timesheet with a description of the task you just completed, a unique task ID, and the current timestamp.</p>

      <p>You can find suggestions for getting the most out of omw on the <a href="/help">Help</a> page.</p>
      </div>
      <div class="flex-item"><h3>Design</h3></div>
      <div class="flex-item">
      <p>Omw is a progressive web app that leverages many of the wonderful ideas and work from Google's web platform and Chrome developer teams.  Learn more on the <a href="https://web.dev" target="_blank" rel="noopener noreferrer">web.dev</a> site. While optimized and tested primarily for usage on a desktop, these techniques should help Omw stay fast and accessible to a wide range of devices.</p>

      <p>The application uses <a href="https://lit-element.polymer-project.org/" target="_blank" rel="noopener noreferrer">LitElement</a> and <a href="https://mwc-demos.glitch.me/demos/" target="_blank" rel="noopener noreferrer">Material Web Components</a>, <a href="https://fullcalendar.io/" target="_blank" rel="noopener noreferrer">FullCalendar</a> for reporting, and <a href="https://dexie.org/" target="_blank" rel="noopener noreferrer">Dexie.js</a>.

      All of your timesheet data remains in your local browser storage using IndexedDB. It's possible that future version of things like the omw-hotkeys extension may look at the chrome.storage.sync API for timesheet synchronization between devices, but that's still on the roadmap.</p>
      </div>

      <div class="flex-item">
      <p>The software is open source and built with <svg class="icon icon-heart"><use xlink:href="#icon-heart"></use></svg>.  You can find the source code on Github at <a href="https://github.com/mcdafydd/omw-pwa" target="_blank" rel="noopener noreferrer">https://github.com/mcdafydd/omw-pwa</a>. A command-line only version of Omw is <a href="https://github.com/mcdafydd/omw" target="_blank" rel="noopener noreferrer">available as well</a>.</p>

      <p>Omw was inspired by <a href="https://github.com/larose/utt"  rel="noopener noreferrer">the Ultimate Time Tracker</a>.</p>
      </div>
    </div>
    <!-- icomoon / fontawesome icon pack -->
    <svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
    <symbol id="icon-heart" viewBox="0 0 28 28">
    <title>heart</title>
    <path d="M14 26c-0.25 0-0.5-0.094-0.688-0.281l-9.75-9.406c-0.125-0.109-3.563-3.25-3.563-7 0-4.578 2.797-7.313 7.469-7.313 2.734 0 5.297 2.156 6.531 3.375 1.234-1.219 3.797-3.375 6.531-3.375 4.672 0 7.469 2.734 7.469 7.313 0 3.75-3.437 6.891-3.578 7.031l-9.734 9.375c-0.187 0.187-0.438 0.281-0.688 0.281z"></path>
    </symbol>
    </defs>
    </svg>
    `;
  }
}

customElements.define('omw-about', OmwAbout);
