// LitElement and html are the basic required imports
import {LitElement, html, css} from '/web_modules/lit-element.js';

// Import our other components
import '../my-theme.js';

// Import 3rd party webcomponents

class OmwUsage extends LitElement {
  static get properties() {
    return {
    };
  }

  static get styles() {
    return css`
    :host([hidden]) { display: none; }
    :host { display: block; }

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
      font-family: Roboto;
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
      font-family: Roboto;
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

  render() {
    return html`
      <div class="flex-container">
    <div class="flex-item"><h2>Usage</h2></div>
    <div class="flex-item"><h3>Quick start</h3></div>
    <div class="flex-item">
    <ol>
      <li>Click the clock icon or type <strong>&lt;LEFT SHIFT+RIGHT SHIFT&gt;</strong> on your keyboard to get to the command screen</li>
      <li>Type <strong>a finished xyz&lt;ENTER&gt;</strong> (a is the <em>add</em> command)</li>
      <li>Continue quickly adding tasks you just completed throughout the day before moving to the next task</li>
      <li>(Optional) Adjust task times by clicking and deleting, dragging, or resizing</li>
      <li>(Optional) Install the PWA app to make it easier to switch to this app and use the shift hotkey</li>
      <li>(Optional) Install the (forthcoming) Chrome extension <em>omw-hotkeys</em> to setup a global hotkey to activate Omw from anywhere</li>
    </ol>
    </div>
    <div class="flex-item"><h3>More info</h3></div>
    <div class="flex-item">
  <p>At the end of each task, adding a task description as described above will add the current time and text to your timesheet.  If the calendar is visible, the task should appear immediately.<br /></p>

  <p>If you forget to add a task or two, you can still use the <strong>add</strong> command later in the day and summarize the last few things you did, perhaps even mentioning the general amount of time in the task description.  Such a command might resemble <strong>a 30m on project A</strong>, <strong>a 1h on project B</strong></p><p>When you review the items in your reporting calendar, they'll all be clumped up visually, but will still have the necessary information to migrate them to an external time tracking system.  At this point, you can either use the tasks as is, or drag and drop / resize events to display the actual time spent.</p>

  <p>Having trouble getting events to appear on the calendar?  Do they all disappear after a browser reload?  According to Google's Best Practices for IndexedDB, some browsers don't allow storing IndexedDB data while in private browsing mode.  I do not test all browsers at the moment, so if you run into this problem, the solution for now is to browse without private mode. I will try to add a banner or some warning to the user soon if this may be happening.</p>
</div>
</div>
    `;
  }

}

customElements.define('omw-usage', OmwUsage);
