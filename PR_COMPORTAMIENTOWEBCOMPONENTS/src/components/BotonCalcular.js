import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class BotonCalcular extends LitElement {
  static properties = {
    disabled: { type: Boolean }
  };

  static styles = [
    unsafeCSS(bootstrap),
    css`
      :host {
        display: block;
        margin: 1.5rem 0;
      }
    `
  ];

  constructor() {
    super();
    this.disabled = false;
  }

  _handleClick() {
    this.dispatchEvent(new CustomEvent('calcular-click', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <button 
        class="btn btn-primary btn-lg w-100 shadow"
        ?disabled="${this.disabled}"
        @click="${this._handleClick}"
      >
        <i class="bi bi-lightning-charge-fill"></i> Calcular Operación Seleccionada
      </button>
    `;
  }
}

customElements.define('boton-calcular', BotonCalcular);
