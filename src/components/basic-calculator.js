    import { LitElement, html } from "lit";

    class BasicCalculator extends LitElement {
    
    /// Definición de propiedades reactivas
    static properties = {
        display: { type: String },  // Texto mostrado en la pantalla
        firstNumber: { type: Number }, // Primer número ingresado
        operator: { type: String }, // Operador seleccionado
        waitingSecond: { type: Boolean } // Esperando el segundo número
    };

    constructor() {
        super();
        this.display = "0";
        this.firstNumber = null;
        this.operator = null;
        this.waitingSecond = false;
    }

    render() {
        return html`
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
        <div class="container p-3 rounded-4 shadow" style="max-width:360px; background:#1b1b1b;">

            <div class="bg-black text-light text-end fs-2 p-2 rounded mb-3">
            ${this.display}
            </div>

            ${this.renderRow([
            { label: "AC", cls: "btn-danger", action: () => this.clearAll(), col: 6 },
            { label: "÷", cls: "btn-warning", action: () => this.setOperator("/") },
            { label: "×", cls: "btn-warning", action: () => this.setOperator("*") }
            ])}

            ${this.renderRow([
            { label: "7", action: () => this.appendNumber(7) },
            { label: "8", action: () => this.appendNumber(8) },
            { label: "9", action: () => this.appendNumber(9) },
            { label: "−", cls: "btn-warning", action: () => this.setOperator("-") }
            ])}

            ${this.renderRow([
            { label: "4", action: () => this.appendNumber(4) },
            { label: "5", action: () => this.appendNumber(5) },
            { label: "6", action: () => this.appendNumber(6) },
            { label: "+", cls: "btn-warning", action: () => this.setOperator("+") }
            ])}

            ${this.renderRow([
            { label: "1", action: () => this.appendNumber(1) },
            { label: "2", action: () => this.appendNumber(2) },
            { label: "3", action: () => this.appendNumber(3) },
            { label: ".", cls: "btn-secondary", action: () => this.appendDecimal() }
            ])}

            ${this.renderRow([
            { label: "0", col: 6, action: () => this.appendNumber(0) },
            { label: "=", cls: "btn-success", col: 6, action: () => this.calculate() }
            ])}

        </div>
        `;
    }

    /** ---------- UI HELPERS ---------- **/

    // Renderiza una fila de botones dada una lista de configuraciones de botones 
    renderRow(buttons) {
        return html`
        <div class="row g-2 mb-2">
            ${buttons.map(btn => html`
            <div class="col-${btn.col || 3}">
                <button
                class="btn ${btn.cls || "btn-light"} w-100 fs-5"
                @click=${btn.action}
                >
                ${btn.label}
                </button>
            </div>
            `)}
        </div>
        `;
    }

    /** ---------- LOGIC ---------- **/

    // Agrega un número al display
    appendNumber(num) {
        this.display = this.waitingSecond
        ? String(num)
        : this.display === "0" ? String(num) : this.display + num;

        this.waitingSecond = false;
    }

    // Agrega un punto decimal al display
    appendDecimal() {
        if (this.waitingSecond) {
        this.display = "0.";
        this.waitingSecond = false;
        return;
        }
        if (!this.display.includes(".")) {
        this.display += ".";
        }
    }

    // Limpia todos los valores y resetea la calculadora
    clearAll() {
        this.display = "0";
        this.firstNumber = null;
        this.operator = null;
        this.waitingSecond = false;
    }

    // Establece el operador y prepara para el segundo número
    setOperator(op) {
        if (this.operator && !this.waitingSecond) {
        this.calculate();
        }

        this.firstNumber = parseFloat(this.display);
        this.operator = op;
        this.waitingSecond = true;
    }

    // Realiza el cálculo basado en el operador y los números ingresados
    calculate() {
        if (!this.operator) return;

        const second = parseFloat(this.display);
        let result = this.firstNumber;

        switch (this.operator) {
        case "+": result += second; break;
        case "-": result -= second; break;
        case "*": result *= second; break;
        case "/": result = second === 0 ? "Error" : result / second; break;
        }

        this.display = String(result);
        this.firstNumber = result;
        this.operator = null;
        this.waitingSecond = false;
    }
    }

    customElements.define("basic-calculator", BasicCalculator);
