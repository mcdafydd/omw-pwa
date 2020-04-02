// LitElement and html are the basic required imports
import {LitElement, html, css} from '/web_modules/lit-element.js';
import {navigator,router} from '/web_modules/lit-element-router.js';

// Import our other components
import '../my-theme.js';
import db from '../db.js';
import './app-main.js';
import './omw-about.js';
import './omw-usage.js';
import './omw-settings.js';
import './omw-track.js';

// Import 3rd party webcomponents
import '/web_modules/@material/mwc-button.js';
import '/web_modules/@material/mwc-dialog.js';
import '/web_modules/@material/mwc-drawer.js';
import '/web_modules/@material/mwc-icon.js';
import '/web_modules/@material/mwc-icon-button.js';
import '/web_modules/@material/mwc-list.js';
import '/web_modules/@material/mwc-list/mwc-list-item.js';
import '/web_modules/@material/mwc-snackbar.js';
import '/web_modules/@material/mwc-textfield.js';
import '/web_modules/@material/mwc-top-app-bar-fixed.js';

class OmwApp extends navigator(router(LitElement)) {
  static get properties() {
    return {
      capturedInstallEvent: { type: Object },
      hideInstall: { type: Boolean },
      lShiftDown: { type: Boolean },
      params: { type: Object },
      query: { type: Object },
      route: { type: String },
      rShiftDown: { type: Boolean },
    };
  }

  static get routes() {
    return [{
      name: 'home',
      pattern: '',
      data: { title: 'Omw' }
    }, {
      name: 'settings',
      pattern: 'settings'
    }, {
      name: 'extras',
      pattern: 'extras'
    }, {
      name: 'usage',
      pattern: 'usage'
    }, {
      name: 'about',
      pattern: 'about'
    }, {
      name: 'whatsnew',
      pattern: 'whatsnew'
    }, {
      name: 'not-found',
      pattern: '*'
    }];
  }

  static get styles() {
    return css`
    :host {
      display: block;
      font-family: var(--omw-font-family);
    }

    :host([hidden]) { display: none; };
    `
  }

  constructor() {
    super();
    this.capturedInstallEvent = {};
    this.hideInstall = true;
    this.lShiftDown = false;
    this.params = {};
    this.query = {};
    this.route = 'home';
    this.rShiftDown = false;

    this.db = db;
    // Support changes being made in another browser window
    // Make sure that all calendars are updated
    // Implement here to work around
    // https://github.com/dfahlander/Dexie.js/issues/847
    this.db.on('changes', () => {
      const event = new CustomEvent('my-getEvents', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'update calendar'
        }
      });
      window.dispatchEvent(event);
    });
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    this.data = data;
  }

  // The render callback renders your element's template. This should be a pure function,
  // it should always return the same template given the same properties. It should not perform
  // any side effects such as setting properties or manipulating the DOM. See the updated
  // or first-updated examples if you need side effects.
  render() {
    // Return the template using the html template tag. This will allow lit-html to
    // interpret the dynamic parts of your template.
    return html`

      <main>
      <mwc-drawer hasHeader type="modal" @MDCTopAppBar:nav="${this.handleDrawer}">
      <span slot="title">omw</span>
      <span slot="subtitle">Stay in flow...</span>
      <hr />
      <div><nav>
      <mwc-list activatable>
        <mwc-list-item data-href="/" graphic="icon" @request-selected="${this.handleDrawerNav}">
          <mwc-icon slot="graphic">timer</mwc-icon>
          <span>Home</span>
        </mwc-list-item>
        <mwc-list-item data-href="/settings" graphic="icon" @request-selected="${this.handleDrawerNav}">
          <mwc-icon slot="graphic">settings</mwc-icon>
          <span>Settings</span>
        </mwc-list-item>
\        <mwc-list-item data-href="/extras" graphic="icon" @request-selected="${this.handleDrawerNav}">
          <mwc-icon slot="graphic">star</mwc-icon>
          <span>Extras</span>
        </mwc-list-item>
        <mwc-list-item data-href="/usage" graphic="icon" @request-selected="${this.handleDrawerNav}">
          <mwc-icon slot="graphic">help</mwc-icon>
          <span>Usage</span>
        </mwc-list-item>
        <mwc-list-item data-href="/about" graphic="icon" @request-selected="${this.handleDrawerNav}">
          <mwc-icon slot="graphic">info</mwc-icon>
          <span>About</span>
        </mwc-list-item>
        <mwc-list-item data-href="/whatsnew" graphic="icon" @request-selected="${this.handleDrawerNav}">
        <mwc-icon slot="graphic">thumb_up_alt</mwc-icon>
          <span>What's New</span>
        </mwc-list-item>
      </mwc-list>
      </nav></div>
      <!-- <div class="mdc-drawer-scrim"></div> -->
      <div slot="appContent" class="mdc-drawer-app-content">
      <mwc-top-app-bar-fixed>
        <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
        <div slot="title">
          <span><i class="omw-logo"></i>omw</span>
        </div>

        <mwc-icon-button data-href="/" @click="${this.handleNav}" icon="timer" slot="actionItems"></mwc-icon-button>
        <mwc-icon-button data-href="/settings" @click="${this.handleNav}" icon="settings" slot="actionItems"></mwc-icon-button>
        <mwc-icon-button ?hidden="${this.hideInstall}" id="installButton" @click="${this.handleInstall}" class="installButton" icon="get_app" slot="actionItems"></mwc-icon-button>
        <div>
          <app-main active-route=${this.route}>
            <omw-track route="home"></omw-track>
            <omw-settings route="settings"></omw-settings>
            <omw-usage route="usage"></omw-usage>
            <omw-about route="about"></omw-about>
            <omw-extras route="extras"></omw-extras>
            <omw-whatsnew route="whatsnew"></omw-whatsnew>
            <h1 route='not-found'>Not Found</h1>
          </app-main>
        </div>
      </mwc-top-app-bar-fixed>
      </div>
    </mwc-drawer>
    <mwc-snackbar id="alertUser" labelText="${this.snackbarMsg}" style="--mdc-snackbar-action-color: ${this.snackbarMsgColor}">
      <mwc-button slot="action">RETRY</mwc-button>
      <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
    </mwc-snackbar>
  </main>
    `;
  }

  // handleDrawer opens/closes the drawer when menu icon is clicked
  handleDrawer() {
    const drawer = this.shadowRoot.querySelector('mwc-drawer');
    const menu = this.shadowRoot.querySelector('mwc-list');
    drawer.open = !drawer.open;
    menu.open = !menu.open;
  }

  // handleDrawerNav handles drawer item clicks
  handleDrawerNav(e) {
    e.preventDefault();
    this.navigate(e.path[0].dataset.href);
  }

  handleInstall() {
    this.capturedInstallEvent.prompt();
    this.capturedInstallEvent.userChoice.then((choice) => {
      console.log('INSTALL CHOICE =', choice);
      // "accepted" or "dismissed"
    });
  }

  // handleNav handles clicks in the top app bar
  handleNav(e) {
    e.preventDefault();
    if(e.target.dataset.href === "/report") {
      const event = new CustomEvent('my-getEvents', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'update calendar'
        }
      });
      this.dispatchEvent(event);
    }
    this.navigate(e.target.dataset.href);
  }

  firstUpdated() {
    const EXTENSION_ID = 'YOUR_EXTENSION_ID_HERE';

    /* need extension detection method
    chrome.runtime.sendMessage(EXTENSION_ID, 'version', response => {
      if (!response) {
        console.log('Did not find omw-hotkeys extension');
        return;
      }
      console.log('Extension version: ', response.version);
    })*/

    window.addEventListener('hotkey', () => {
      this.navigate('/');
    });

    document.addEventListener('keydown', this.handleHotKeyDown);
    document.addEventListener('keyup', this.handleHotKeyUp);

    window.addEventListener('appinstalled', (e) => {
      e.preventDefault();
      this.hideInstall = true;
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.hideInstall = false;
      this.capturedInstallEvent = e;
      this.showInstallPromotion();
    });

    window.addEventListener('alert-user', (e) => {
      e.preventDefault();
      let color = 'black';
      if (Object.prototype.hasOwnProperty.call(e.detail, 'color')) {
        color = e.detail.color;
      }
      this.updateOutput(e.detail.message, color);
    });
  }

  handleHotKeyDown(event) {
    if (event.which === 16) {
      if (event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT){
        this.lShiftDown = true;
      } else if (event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT){
        this.rShiftDown = true;
      }
    }
    if (this.lShiftDown && this.rShiftDown) {
      const hotkeyEvent = new CustomEvent('hotkey', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'focus'
        }
      });
      this.dispatchEvent(hotkeyEvent);
    }
  }

  handleHotKeyUp(event) {
    if (event.which === 16) {
      if (event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT){
        this.lShiftDown = false;
      } else if (event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT){
        this.rShiftDown = false;
      }
    }
  }

  showInstallPromotion() {
    console.log("SHOW INSTALL");
  }

  updated() {
    const drawer = this.shadowRoot.querySelector('mwc-drawer');
    const menu = this.shadowRoot.querySelector('mwc-list');
    if (drawer.open) {
      drawer.open = !drawer.open;
      menu.open = !menu.open;
    }
  }

  updateOutput(data, color) {
    this.snackbarMsgColor = color;
    this.snackbarMsg = data;
    this.updateComplete.then(() => {
      const snackbarEl = this.shadowRoot.querySelector('#alertUser');
      snackbarEl.open();
    });
  }
}

customElements.define('omw-app', OmwApp);
