import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class ResultadoDisplay extends LitElement {
  static properties = {
    resultado: { type: String },
    mensaje: { type: String }
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
    this.resultado = '0';
    this.mensaje = '';
  }

  render() {
    const isError = this.resultado === 'Error';
    
    return html`
      <div class="resultado-container mt-4">
        <div class="resultado-header">
          <i class="bi bi-calculator-fill"></i>
          El resultado es:
        </div>
        <div class="resultado-valor ${isError ? 'text-danger' : ''}">
          ${isError ? html`<i class="bi bi-x-circle-fill"></i> ` : ''}
          ${this.resultado}
        </div>
        ${this.mensaje ? html`
          <div class="mensaje-info ${isError ? 'error' : ''}">
            <i class="bi ${isError ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'}"></i>
            ${this.mensaje}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('resultado-display', ResultadoDisplay);
