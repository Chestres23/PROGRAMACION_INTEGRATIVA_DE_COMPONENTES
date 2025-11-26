import { LitElement, html } from 'lit';

export class SumaDosNumeros extends LitElement {

    static properties = {
        numero1: { type: Number },
        numero2: { type: Number },
        resultado: { type: Number },
        error: { type: String }
    };

    constructor() {
        super();
        this.numero1 = 0;
        this.numero2 = 0;
        this.resultado = 0;
        this.error = '';
    }


    actualizarNumeros() {
        const input1 = this.shadowRoot.getElementById('num1');
        const input2 = this.shadowRoot.getElementById('num2');

        const valor1 = input1.value;
        const valor2 = input2.value;

        if (isNaN(valor1) || isNaN(valor2)) {
        this.error = "Solo se permiten números";
        return;
        }

        this.error = '';

        this.numero1 = Number(valor1);
        this.numero2 = Number(valor2);

        this.resultado = this.numero1 + this.numero2;
    }

    render() {
        return html`
        <h2>Suma de dos números</h2>

        <input 
            id="num1"
        
            @input=${this.actualizarNumeros}
            placeholder="Número 1"
        >

        <br><br> + <br><br>

        <input 
            id="num2"
            
            @input=${this.actualizarNumeros}
            placeholder="Número 2"
        >

        <br><br>

        ${this.error 
            ? html`<p style="color:red">${this.error}</p>`
            : html`<p>Resultado: <strong>${this.resultado}</strong></p>`
        }
        `;
    }
    }

customElements.define('suma-dos-numeros', SumaDosNumeros);
