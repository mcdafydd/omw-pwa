// LitElement and html are the basic required imports
import {LitElement, html, css} from '/web_modules/lit-element.js';
import download from '/web_modules/downloadjs.js';

// Import our other components
import db from '../db.js';
import '../my-theme.js';
import './omw-console.js';

// Import 3rd party webcomponents
import '/web_modules/dark-mode-toggle.js';
import '/web_modules/@material/mwc-button.js';
import '/web_modules/@material/mwc-snackbar.js';

class OmwSettings extends LitElement {
  static get properties() {
    return {
      db: { type: Object },
      downloaded: { type: Boolean },
      reader: { type: Object },
      snackbarMsg: { type: String },
      uploaded: { type: Boolean }
    };
  }

  static get styles() {
    return css`
    :host([hidden]) { display: none; }
    :host {
      display: block;
      --dark-mode-toggle-icon-size: 24px;
    }
    div.column {
      float: left;
      margin: 12px;
    }
    table {
      text-align: left;
    }
    #dropzone {
      width: 600px;
      height: 20px;
      border: 2px dotted #bbb;
      border-radius: 10px;
      padding: 35px;
      color: #bbb;
      text-align: center;
    }
     `;
  }

  constructor() {
    super();
    this.db = db;
    this.downloaded = false;
    this.snackbarMsg = '';
    this.uploaded = false;

    this.console = this.shadowRoot.querySelector('omw-console');
  }

  render() {
    return html`
      <div>
        <span>Toggle dark mode:<dark-mode-toggle @colorschemechange="${this.toggleDarkMode}"></dark-mode-toggle></span>
        <p>Use the buttons below to save your Omw timesheet to a file, or to import an Omw TOML timesheet file from either a backup or from the CLI tool.</p>
        <div class="column"><p>
          <mwc-button raised @click=${this.exportTimesheet} id="downloadBtn" label="export"></mwc-button>
            Last export at: <span id="downloaded_at" ?hidden="${!this.downloaded}"></span>
          <mwc-button raised @click=${this.importTimesheet} id="uploadBtn" label="import"><input type="file" id="fileUpload" name="omw_timesheet" accept=".json" hidden></mwc-button>
            Last import at: <span id="uploaded_at" ?hidden="${!this.uploaded}"></span>
          </p>
        </div>
        <div class="column">
          <h3>Database Info</h3>
          <table border="1">
            <thead></thead>
            <tbody></tbody>
          </table>
        </div>
        <omw-console></omw-console>
        <mwc-snackbar id="snackbar" labelText="${this.snackbarMsg}">
          <mwc-button slot="action">RETRY</mwc-button>
          <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
        </mwc-snackbar>
      </div>
    `;
  }

  async exportTimesheet() {
    const el = this.shadowRoot.querySelector('omw-console');
    try {
      const progressCallback = (totalRows, completedRows) => {
        el.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
      };
      const blob = await db.export({prettyJson: true, progressCallback});
      download(blob, "omwdb-export.json", "application/json");
      const d = new Date();
      const dl = this.shadowRoot.querySelector('downloaded_at');
      dl.innerHTML = d;
      this.uploaded = true;
    } catch (err) {
      el.error(`Export timesheet failed: ${err}`);
    }
  }

  async importTimesheet() {
    const el = this.shadowRoot.querySelector('omw-console');
    const ul = this.shadowRoot.querySelector('#fileUpload');
    ul.click();
    if (ul.files.length > 0) {
      try {
        const progressCallback = (totalRows, completedRows) => {
          el.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
        };
        await this.db.import(ul.value, progressCallback);
        const d = new Date();
        const ulat = this.shadowRoot.querySelector('uploaded_at');
        ulat.innerHTML = d;
        const event = new CustomEvent('my-getEvents', {
          bubbles: true,
          composed: true,
          detail: {
            message: 'update calendar'
          }
        });
        this.dispatchEvent(event);
        this.uploaded = true;
      } catch (err) {
        el.error(`Import timesheet failed: ${err}`);
      }
    }
  }

  async showContent() {
    const tbody = this.shadowRoot.getElementsByTagName('tbody')[0];

    const tables = await Promise.all(this.db.tables.map (async table => ({
      name: table.name,
      count: await table.count(),
      primKey: table.schema.primKey.src
    })));
    tbody.innerHTML = `
      <tr>
        <th>Database Name</th>
        <td colspan="2">${this.db.name}</th>
      </tr>
      ${tables.map(({name, count, primKey}) => `
        <tr>
          <th>Table: "${name}"</th>
          <td>Primary Key: ${primKey}</td>
          <td>Row count: ${count}</td>
        </tr>`)}
    `;
  }

  toggleDarkMode(e) {
    console.dir(e);
//    body.classList.toggle('dark', toggle.mode === 'dark');
    return;
  }
}

customElements.define('omw-settings', OmwSettings);
