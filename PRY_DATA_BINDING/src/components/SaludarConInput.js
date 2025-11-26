import { LitElement, html } from 'lit';

export class SaludarConInput extends LitElement {

    // Declaramos la propiedad reactiva
    static properties = { 
        nombre: { type: String } 
    };

    constructor() {
        super();
        this.nombre = 'CHRISTIAN VASCONEZ';
    }

    actualizarNombre(e) {
        this.nombre = e.target.value;
    }


    render() {
        return html`
        <input @input=${this.actualizarNombre} value="${this.nombre}"/>
        <p>Tu nombre es: ${this.nombre}</p>

        <img src="${this.nombre}" alt="Imagen dinámica"/>


        `;
    }
    }

customElements.define('saludar-con-input', SaludarConInput);
