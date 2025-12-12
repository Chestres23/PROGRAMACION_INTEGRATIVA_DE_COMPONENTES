import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class InputNumero extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    error: { type: String }
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
    this.label = '';
    this.value = '';
    this.error = '';
  }

  _handleInput(e) {
    const valor = e.target.value;
    this.value = valor;

    // Validación
    if (valor && isNaN(valor)) {
      this.error = 'Por favor, ingrese solo números';
    } else {
      this.error = '';
    }

    // Emitir evento personalizado usando input para actualización en tiempo real
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value: valor, isValid: !isNaN(valor) && valor !== '' },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const isValid = this.value && !this.error;
    const isInvalid = this.value && this.error;
    
    return html`
      <div class="mb-3">
        <label class="form-label">
          <i class="bi bi-123"></i>
          ${this.label}
        </label>
        <div class="input-group">
          <input 
            type="text" 
            class="form-control ${isValid ? 'is-valid' : ''} ${isInvalid ? 'is-invalid' : ''}"
            .value="${this.value}"
            @input="${this._handleInput}"
            placeholder="Ingrese un número"
          >
          ${isValid ? html`<span class="input-group-text success-icon"><i class="bi bi-check-circle-fill"></i></span>` : ''}
        </div>
        ${this.error ? html`
          <div class="error-message">
            <i class="bi bi-exclamation-triangle-fill"></i>
            ${this.error}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('input-numero', InputNumero);
