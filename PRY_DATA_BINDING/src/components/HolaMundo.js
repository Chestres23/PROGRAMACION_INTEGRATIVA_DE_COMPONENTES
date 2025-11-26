import { LitElement, html } from "lit";

export class HolaMundo extends LitElement {

    nombre = "Christian";
    apellido = "Vasconez";

    nombre_completo = this.nombre + " " + this.apellido; // Concatenación tradicional
    nombrescompleto = `${this.nombre} ${this.apellido}`; // Template Strings
    


    render() {
        return html`
        <p>Hola ${this.nombrescompleto} </p>
        `;
    }
}

customElements.define("hola-mundo", HolaMundo);
