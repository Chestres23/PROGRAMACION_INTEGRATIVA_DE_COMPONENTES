class ConversorTemperatura extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        // Leer atributo formato o usar por defecto C-F
        const formatoInicial = this.getAttribute("formato") || "C-F";

        shadow.innerHTML = `
        <link rel="stylesheet" href="./public/vendor/bootstrap/css/bootstrap.min.css">

        <div class="card p-3">
            <label>Valor:</label>
            <input type="number" class="form-control mb-2" id="txt_valor">

            <label>Conversión:</label>
            <select class="form-select mb-2" id="select_formato">
                <option value="C-F">Celsius a Fahrenheit</option>
                <option value="F-C">Fahrenheit a Celsius</option>
            </select>

            <button class="btn btn-primary" id="btn_convertir">Convertir</button>

            <div class="mt-3" id="resultado"></div>
        </div>
        `;

        const txtValor = shadow.getElementById("txt_valor");
        const selectFormato = shadow.getElementById("select_formato");
        const btnConvertir = shadow.getElementById("btn_convertir");
        const resultado = shadow.getElementById("resultado");

        // Ajusta el select según el atributo personalizado
        selectFormato.value = formatoInicial;

        btnConvertir.addEventListener("click", () => {
            const valor = parseFloat(txtValor.value);
            const tipo = selectFormato.value;

            if (isNaN(valor)) {
                resultado.innerHTML = `<div class="alert alert-warning">Ingrese un número válido.</div>`;
                return;
            }

            let res = ""; // Variable para el resultado

            if (tipo === "C-F") {
                const f = (valor * 9/5) + 32;
                res = valor + " °C = " + f.toFixed(2) + " °F";
            } else {
                const c = (valor - 32) * 5/9;
                res = valor + " °F = " + c.toFixed(2) + " °C";
            }

            resultado.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        ${res}
                    </div>
                </div>
            `;
        });
    }
}

customElements.define("conversor-temperatura", ConversorTemperatura);
