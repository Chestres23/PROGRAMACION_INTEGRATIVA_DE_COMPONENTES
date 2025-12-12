import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';
import './InputNumero.js';
import './SelectorOperacion.js';
import './BotonCalcular.js';
import './ResultadoDisplay.js';

export class CalculadoraApp extends LitElement {
  static properties = {
    numero1: { type: String },
    numero2: { type: String },
    resultado: { type: String },
    mensaje: { type: String },
    isValid1: { type: Boolean },
    isValid2: { type: Boolean },
    operacionActual: { type: String },
    operacionSeleccionada: { type: String },
    progreso: { type: Number }
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
    this.numero1 = '';
    this.numero2 = '';
    this.resultado = '0';
    this.mensaje = '';
    this.isValid1 = false;
    this.isValid2 = false;
    this.operacionActual = '';
    this.operacionSeleccionada = 'suma';
    this.progreso = 0;
    this.timeouts = [];
  }

  _handleInput1(e) {
    this.numero1 = e.detail.value;
    this.isValid1 = e.detail.isValid;
    this._calcularOperacionSeleccionada();
    this._iniciarCalculoAutomatico();
  }

  _handleInput2(e) {
    this.numero2 = e.detail.value;
    this.isValid2 = e.detail.isValid;
    this._calcularOperacionSeleccionada();
    this._iniciarCalculoAutomatico();
  }

  _handleOperacionChange(e) {
    this.operacionSeleccionada = e.detail.operacion;
    this._calcularOperacionSeleccionada();
  }

  _calcularOperacionSeleccionada() {
    // Calcular inmediatamente según la operación seleccionada
    if (!this.isValid1 || !this.isValid2 || !this.numero1 || !this.numero2) {
      return;
    }

    const num1 = parseFloat(this.numero1);
    const num2 = parseFloat(this.numero2);

    let result = 0;
    let simbolo = '';

    switch(this.operacionSeleccionada) {
      case 'suma':
        result = num1 + num2;
        simbolo = '+';
        break;
      case 'resta':
        result = num1 - num2;
        simbolo = '-';
        break;
      case 'multiplicacion':
        result = num1 * num2;
        simbolo = '×';
        break;
      case 'division':
        if (num2 === 0) {
          this.resultado = 'Error';
          this.mensaje = '⚠️ No se puede dividir entre cero';
          return;
        }
        result = num1 / num2;
        simbolo = '÷';
        break;
    }

    this.resultado = result.toFixed(2);
    this.mensaje = `📊 Resultado: ${num1} ${simbolo} ${num2} = ${this.resultado}`;
  }

  _iniciarCalculoAutomatico() {
    // Limpiar timeouts anteriores
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];

    // Validar que ambos números sean válidos
    if (!this.isValid1 || !this.isValid2 || !this.numero1 || !this.numero2) {
      this.resultado = '0';
      this.mensaje = 'Ingrese ambos números para iniciar el cálculo automático';
      this.operacionActual = '';
      this.progreso = 0;
      return;
    }

    const num1 = parseFloat(this.numero1);
    const num2 = parseFloat(this.numero2);

    this.mensaje = '¡Iniciando cálculos automáticos!';
    this.progreso = 0;

    // Suma en 5 segundos
    const timeout1 = setTimeout(() => {
      this.operacionActual = 'suma';
      this.operacionSeleccionada = 'suma';
      this.resultado = (num1 + num2).toFixed(2);
      this.mensaje = `✓ Suma completada: ${num1} + ${num2} = ${this.resultado}`;
      this.progreso = 25;
    }, 5000);

    // Resta en 10 segundos
    const timeout2 = setTimeout(() => {
      this.operacionActual = 'resta';
      this.operacionSeleccionada = 'resta';
      this.resultado = (num1 - num2).toFixed(2);
      this.mensaje = `✓ Resta completada: ${num1} - ${num2} = ${this.resultado}`;
      this.progreso = 50;
    }, 10000);

    // Multiplicación en 15 segundos
    const timeout3 = setTimeout(() => {
      this.operacionActual = 'multiplicacion';
      this.operacionSeleccionada = 'multiplicacion';
      this.resultado = (num1 * num2).toFixed(2);
      this.mensaje = `✓ Multiplicación completada: ${num1} × ${num2} = ${this.resultado}`;
      this.progreso = 75;
    }, 15000);

    // División en 20 segundos
    const timeout4 = setTimeout(() => {
      this.operacionActual = 'division';
      this.operacionSeleccionada = 'division';
      if (num2 === 0) {
        this.resultado = 'Error';
        this.mensaje = '✗ No se puede dividir entre cero';
      } else {
        this.resultado = (num1 / num2).toFixed(2);
        this.mensaje = `✓ División completada: ${num1} ÷ ${num2} = ${this.resultado}`;
      }
      this.progreso = 100;
    }, 20000);

    // Guardar todos los timeouts
    this.timeouts.push(timeout1, timeout2, timeout3, timeout4);
  }

  _handleCalcularClick() {
    // Calcular operación seleccionada inmediatamente
    if (!this.isValid1 || !this.isValid2 || !this.numero1 || !this.numero2) {
      this.mensaje = 'Por favor ingrese ambos números válidos';
      return;
    }

    const num1 = parseFloat(this.numero1);
    const num2 = parseFloat(this.numero2);

    let result = 0;
    let operacionTexto = '';

    switch(this.operacionSeleccionada) {
      case 'suma':
        result = num1 + num2;
        operacionTexto = `${num1} + ${num2}`;
        break;
      case 'resta':
        result = num1 - num2;
        operacionTexto = `${num1} - ${num2}`;
        break;
      case 'multiplicacion':
        result = num1 * num2;
        operacionTexto = `${num1} × ${num2}`;
        break;
      case 'division':
        if (num2 === 0) {
          this.resultado = 'Error';
          this.mensaje = 'No se puede dividir entre cero';
          return;
        }
        result = num1 / num2;
        operacionTexto = `${num1} ÷ ${num2}`;
        break;
    }

    this.resultado = result.toFixed(2);
    this.mensaje = `Cálculo manual: ${operacionTexto} = ${this.resultado}`;
  }

  render() {
    return html`
      <div class="card shadow-lg border-0">
        <div class="card-header bg-gradient bg-primary text-white text-center py-4">
          <h2 class="mb-0">
            <i class="bi bi-calculator-fill"></i> Calculadora Interactiva
          </h2>
          <p class="mb-0 mt-2">Con cálculo automático secuencial y manual</p>
        </div>

        <div class="card-body p-4">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <input-numero 
                label="Primer número"
                @input-change="${this._handleInput1}"
              ></input-numero>
            </div>
            
            <div class="col-md-6">
              <input-numero 
                label="Segundo número"
                @input-change="${this._handleInput2}"
              ></input-numero>
            </div>
          </div>

          <selector-operacion
            .operacion="${this.operacionSeleccionada}"
            @operacion-change="${this._handleOperacionChange}"
          ></selector-operacion>

          <div class="alert alert-info shadow-sm">
            <div class="d-flex align-items-center justify-content-between flex-wrap">
              <div class="mb-2 mb-md-0">
                <i class="bi bi-info-circle-fill"></i>
                <strong class="ms-2">Operaciones automáticas (setTimeout):</strong>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-success ${this.operacionActual === 'suma' ? 'fs-6 shadow' : ''}">
                  ➕ Suma (5s)
                </span>
                <span class="badge bg-warning text-dark ${this.operacionActual === 'resta' ? 'fs-6 shadow' : ''}">
                  ➖ Resta (10s)
                </span>
                <span class="badge bg-info ${this.operacionActual === 'multiplicacion' ? 'fs-6 shadow' : ''}">
                  ✖️ Multiplicación (15s)
                </span>
                <span class="badge bg-danger ${this.operacionActual === 'division' ? 'fs-6 shadow' : ''}">
                  ➗ División (20s)
                </span>
              </div>
            </div>
            
            ${this.progreso > 0 ? html`
              <div class="progress mt-3 shadow-sm" style="height: 25px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                     role="progressbar" 
                     style="width: ${this.progreso}%"
                     aria-valuenow="${this.progreso}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                  <strong>${this.progreso}%</strong>
                </div>
              </div>
            ` : ''}
          </div>
          
          <boton-calcular
            ?disabled="${!this.isValid1 || !this.isValid2}"
            @calcular-click="${this._handleCalcularClick}"
          ></boton-calcular>
          
          <resultado-display
            resultado="${this.resultado}"
            mensaje="${this.mensaje}"
          ></resultado-display>
        </div>
      </div>
    `;
  }
}

customElements.define('calculadora-app', CalculadoraApp);
