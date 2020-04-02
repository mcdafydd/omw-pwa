// LitElement and html are the basic required imports
import {LitElement, html, css} from '/web_modules/lit-element.js';
import {navigator} from '/web_modules/lit-element-router.js';
import db from '../db.js';
import {Entry} from '../model.js';

// Import our other components
import '../my-theme.js';
import './full-calendar.js';

// Import 3rd party webcomponents
import '/web_modules/@material/mwc-button.js';
import '/web_modules/@material/mwc-dialog.js';
import '/web_modules/@material/mwc-icon-button.js';
import '/web_modules/@material/mwc-menu.js';
import '/web_modules/@material/mwc-textfield.js';

class OmwTrack extends navigator(LitElement) {
  static get properties() {
    return {
      snackbarMsgColor: { type: String },
      snackbarMsg: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        color: var(--omw-theme-text-color, black);
        background: var(--omw-theme-background-color, white);
        font-family: var(--omw-theme-font-family, Roboto);
        --mdc-text-field-filled-border-radius: 0 0 0 0;
      }
      :host([hidden]) { display: none; }
     `;
  }

  constructor() {
    super();
    this.db = db;
    this.snackbarMsg = 'Failed to add task to timesheet. Retry in 5 seconds.';
  }

  render() {
    return html`
      <div class="user-input">
        <mwc-textfield type="text" pattern="" autofocus id="text-input" label="Enter command"
          icon="chevron_right" @keyup="${this.handleInput}" minlength="1" maxlength="255"
          required helperPersistent helper="<LEFT SHIFT>+<RIGHT SHIFT> to focus">
        </mwc-textfield><mwc-button icon="event" raised @click="${this.handleHide}"></mwc-button>
      </div>
      <div>
        <div class="calendar">
          <full-calendar></full-calendar>
        </div>
      <mwc-dialog>
        <div id="helpText">${this.getHelpText()}</div>
        <mwc-button
            slot="primaryAction"
            dialogAction="close">
          Close
        </mwc-button>
      </mwc-dialog>
      </div>
    </div>
    `;
  }

  firstUpdated() {
    // FIXME: use haunted state
/*    this.db.settings.where('key').equals('primaryTimesheetId').toArray()
    .then(items => {
      if (items.length === 1) {
        this.primaryTimesheetId = items[0].value;
      } else {
        this.primaryTimesheetId = '';
      }
    });*/

    window.addEventListener('hotkey', () => {
      const focusEl = this.shadowRoot.querySelector('mwc-textfield');
      focusEl.focus();
    });
  }

  addHello(start, end) {
    let primaryTimesheetId = '';
    this.db.settings.get('primaryTimesheetId')
    .then(item => {
      if (item !== undefined) {
        primaryTimesheetId = item.value;
      }
    });

    const notes = { notes: 'Auto-created' };
    const entry = new Entry(
      start,
      end,
      'hello',
      notes,
      primaryTimesheetId
    );
    return this.db.entries.add(entry);
  }

  /*const textfield = document.querySelector('#my-textfield');
  textfield.validityTransform = (newValue, nativeValidity) => {
    if (!nativeValidity.valid) {
      if (nativeValidity.patternMismatch) {
        const hasDog = newValue.includes('dog');
        // changes to make to the nativeValidity
        return {
          valid: hasDog,
          patternMismatch: !hasDog;
        };
      } else {
        // no changes
        return {};
      }
    } else {
      const isValid = someExpensiveOperation(newValue);
      // changes to make to the native validity
      return {
        valid: isValid,
        // or whatever type of ValidityState prop you would like to set (if any)
        customError: !isValid,
      };
    }
  }*/

  // handleCommand process user input and hide window after handling command without error
  // FIXME: validate field better and add default
  async handleCommand(el, input) {
    const argv = input.split(/\s/);
    const cmd = argv.shift();
    let dialog;
    switch(cmd) {
      case 'a':
        if (argv.length > 0) {
          this.omwAdd(argv.join(' '));
        }
        else {
          this.sendAlert('Add command requires task description', 'red');
        }
        break;
      case 'h':
        this.omwAdd('hello');
        break;
      case 'r': {
        const event = new CustomEvent('my-getEvents', {
          bubbles: true,
          composed: true,
          detail: {
            message: 'update calendar'
          }
        });
        this.dispatchEvent(event);
        const calEl = this.shadowRoot.querySelector('.calendar');
        calEl.hidden = false;
        break;
      }
      case 's':
        this.omwStretch();
        break;
      case 'b':
        this.omwAdd('break **');
        break;
      case 'i':
        this.omwAdd('ignore ***');
        break;
      case '?':
        dialog = this.shadowRoot.querySelector('mwc-dialog');
        dialog.open = !dialog.open;
        break;
      case 'u':
        this.navigate('/usage');
        break;
      default:
        this.sendAlert('Invalid command - try again or ? for help', 'red');
    }
  }

  // handleInput process user input, ensure the text entered is valid
  handleInput(e) {
    if (e.key === 'Enter') {
      // Cancel the default action, if needed
      e.preventDefault();
      const el = this.shadowRoot.querySelector('#text-input');
      // FIXME: this wouldn't match tasks like 'a
      const cmd = el.value.match(/^(?![hrsebiu?].)(a )?(?<cmd>[a-zA-Z0-9,._+:@%/\-\t ]+(\*\*\*?)*)/);
      const otherCmd = el.value.match(/^[hrsebiu?][\s]*$/);
      if (cmd !== null) {
        this.handleCommand(el, `a ${cmd.groups.cmd}`);
      } else if (otherCmd !== null) {
        this.handleCommand(el, otherCmd[0]);
      } else {
        this.sendAlert('Invalid command - try again or ? for help', 'red');
      }
      // clear textarea for next command
      el.value = '';
    }
  }

  handleHide() {
    const el = this.shadowRoot.querySelector('.calendar');
    el.hidden = !el.hidden;
  }

  async omwAdd(task) {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const ts = new Date();
    let newStart = ts.setMinutes(ts.getMinutes() - 15);
    // get today's entries and make sure there's a hello to start the day
    this.db.entries
    .where("end")
    .between(startOfDay, ts, true, true)
    .sortBy('start')
    .then((entries) => {
      if (entries.length === 0) {
        // add a 15-minute 'hello' to start the day
        let start = new Date(ts.setMinutes(ts.getMinutes() - 30));
        if (start < startOfDay) {
          start = startOfDay;
        }
        const end = start.setMinutes(start.getMinutes() + 15);
        try {
          newStart = end;
          this.addHello(start, end);
        } catch(err) {
            const errMsg = 'Failed to auto-create hello task';
            this.sendAlert(errMsg, 'red');
            throw new Error(`${errMsg}: ${err.stack || err}`)
        }
      } else if (entries[0].task !== 'hello') {
        // this should only happen if IndexedDB is lost after hello was added
        // since there's a possibility we may not know the current task start time,
        // use the default 'start of day' value
        this.db.settings.get('startOfDay')
        .then(item => {
          let end = ts;
          if (item !== undefined) {
            if (item.value < ts) {
              end = new Date(item.value);
            }
          }
          let start = new Date(end.setMinutes(end.getMinutes() - 15));
          if (start < startOfDay) {
            start = startOfDay;
          }
          try {
            newStart = start;
            this.addHello(start, end);
          } catch(err) {
              const errMsg = 'Failed to auto-create hello task';
              this.sendAlert(errMsg, 'red');
              throw new Error(`${errMsg}: ${err.stack || err}`)
          }
        });
/*        this.db.settings.where('key').equals('startOfDay').toArray()
        .then(items => {
          let end = ts;
          if (items.length === 1) {
            if (items[0].value < ts) {
              end = new Date(items[0].value);
            }
          }
          let start = new Date(end.setMinutes(end.getMinutes() - 15));
          if (start < startOfDay) {
            start = startOfDay;
          }
          try {
            newStart = start;
            this.addHello(start, end);
          } catch(err) {
              const errMsg = 'Failed to auto-create hello task';
              this.sendAlert(errMsg, 'red');
              throw new Error(`${errMsg}: ${err.stack || err}`)
          }
        });*/
      }
      try {
        let primaryTimesheetId = '';
        this.db.settings.get('primaryTimesheetId')
        .then(item => {
          if (item !== undefined) {
            primaryTimesheetId = item.value;
          }
        });

        const notes = { notes: '' };
        const entry = new Entry(
          newStart,
          ts,
          task,
          notes,
          primaryTimesheetId
        );
        return this.db.entries.add(entry);
      }
      catch(err) {
        const errMsg = 'Failed to add task to timesheet';
        this.sendAlert(errMsg, 'red');
        throw new Error(`${errMsg}: ${err.stack || err}`)
      }
    }).catch((err) => {
      console.error(err);
      this.sendAlert(err, 'red');
      return false;
    });
  }

  omwStretch() {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const ts = new Date();

    this.db.entries
    .where("end")
    .between(startOfDay, ts, false, true)
    .last()
    .then(item => {
      if (item !== undefined) {
        return this.omwAdd(item.task);
      }
      throw new Error('No tasks today to stretch');
    })
    .catch(err => {
      console.error('Failed to add task to timesheet: ' + (err.stack || err));
      this.sendAlert(err, 'red');
      return false;
    });
  }

  sendAlert(message, color) {
    const event = new CustomEvent('alert-user', {
      bubbles: true,
      composed: true,
      detail: {
        message,
        color
      }
    });
    this.dispatchEvent(event);
  }

  getHelpText() {
    return html`
	<ul>
          <li value="cmdDefault"><em>a bunch of task text</em> - the default command will add all the entered text as the end of the current task</li>
          <li value="cmdAdd">a (add) &lt;task&gt; - add &lt;task&gt; entry with current time (use at end of task, not beginning)</li>
          <li value="cmdAddBreak">b (break) - shortcut to command <em>a break **</em></li>
          <li value="cmdAddIgnore">i (ignore) - shortcut to command <em>a ignore ***</em></li>
          <li value="cmdReport">r (report) - display calendar and update events')</li>
          <li value="cmdStretch">s (stretch) - stretch last task to current time')</li>
          <li value="cmdUsage">u (usage) - Omw usage assistance</li>
          <li value="cmdToggle">? (help) - show this help text display</li>
  </ul>`
  }

}

// Register your element to custom elements registry, pass it a tag name and your class definition
// The element name must always contain at least one dash
customElements.define('omw-track', OmwTrack);
