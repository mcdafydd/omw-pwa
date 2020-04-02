// LitElement and html are the basic required imports
import {LitElement, html, css, customElement, property} from '../../web_modules/lit-element.js';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */

 // Import 3rd party webcomponents
import '/web_modules/@material/mwc-textarea.js';

@customElement('omw-console')
export class OmwConsole extends LitElement {

  @property()
  text = '';

  static get styles() {
    return css`
      :host {
        display: block;
        color: var(--omw-theme-text-color, black);
        background: var(--omw-theme-background-color, white);
        font-family: var(--omw-theme-font-family, Roboto);
      }
      :host([hidden]) { display: none; }
     `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
       <mwc-textarea disabled outlined fullwidth placeholder="Omw logs">${this.text}</mwc-textarea>
    `;
  }

  firstUpdated() {
    let color;
    window.addEventListener('my-console-log', ((e : CustomEvent) => {
      e.preventDefault();
      this.log(e.detail.message);
    }) as EventListener);

    window.addEventListener('my-console-error', ((e : CustomEvent) => {
      e.preventDefault();
      this.error(e.detail.message);
    }) as EventListener);
  }

  log(txt: string, type?: string) {
    if (type) this.text += type + " ";
    this.text += txt + "\n";
  }

  error(txt: string) {
    this.log(txt, "ERROR!");
  }
}

