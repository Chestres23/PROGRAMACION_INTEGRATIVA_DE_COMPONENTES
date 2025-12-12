import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class SelectorOperacion extends LitElement {
  static properties = {
    operacion: { type: String }
  };

  static styles = [
    unsafeCSS(bootstrap),
    css`
      :host {
        display: block;
      }
    `
  ];

  constructor() {
    super();
    this.operacion = 'suma';
  }

  _handleChange(e) {
    this.operacion = e.target.value;
    
    // Emitir evento personalizado
    this.dispatchEvent(new CustomEvent('operacion-change', {
      detail: { operacion: this.operacion },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="mb-4">
        <label class="form-label fw-bold text-primary">
          <i class="bi bi-calculator-fill"></i> Seleccione la operación
        </label>
        <select 
          class="form-select form-select-lg"
          @change="${this._handleChange}"
          .value="${this.operacion}"
        >
          <option value="suma">➕ Suma (+)</option>
          <option value="resta">➖ Resta (-)</option>
          <option value="multiplicacion">✖️ Multiplicación (×)</option>
          <option value="division">➗ División (÷)</option>
        </select>
      </div>
    `;
  }
}

customElements.define('selector-operacion', SelectorOperacion);
