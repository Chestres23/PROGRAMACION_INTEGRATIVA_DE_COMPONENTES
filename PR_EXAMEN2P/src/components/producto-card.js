import { LitElement, html, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

class ProductoCard extends LitElement {
    static styles = [unsafeCSS(bootstrap)];

    static properties = {
        productos: { type: Array, state: true },
        nuevoProducto: { type: Object, state: true },
        nombre: { type: String },
        precio: { type: Number },
        cantidad: { type: Number, state: true }
    };

    constructor() {
        super();
        this.productos = [];
        this.nuevoProducto = { nombre: '', precio: '' };
        this.nombre = '';
        this.precio = 0;
        this.cantidad = 1;
    }

    // Actualizar valores del formulario
    actualizarNombre(e) {
        // Permitir solo letras y espacios
        const valor = e.target.value.replace(/[0-9]/g, '');
        this.nuevoProducto = { ...this.nuevoProducto, nombre: valor };
    }

    actualizarPrecio(e) {
        this.nuevoProducto = { ...this.nuevoProducto, precio: e.target.value };
    }

    // Agregar nuevo producto
    agregarProducto() {
        const { nombre, precio } = this.nuevoProducto;
        
        if (!nombre.trim() || !precio.trim()) {
            alert('Por favor completa todos los campos');
            return;
        }

        const precioNum = parseFloat(precio);
        if (isNaN(precioNum) || precioNum < 0) {
            alert('El precio debe ser un número válido y positivo');
            return;
        }

        const nuevoId = Math.max(...this.productos.map(p => p.id || 0), 0) + 1;
        const producto = {
            id: nuevoId,
            nombre: nombre.trim(),
            precio: precioNum,
            cantidad: 1
        };

        this.productos = [...this.productos, producto];
        this.nuevoProducto = { nombre: '', precio: '' };
    }

    // Aumentar cantidad de un producto
    aumentarCantidad(id) {
        this.productos = this.productos.map(p => 
            p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
    }

    // Disminuir cantidad de un producto
    disminuirCantidad(id) {
        this.productos = this.productos.map(p => 
            p.id === id && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p
        );
    }

    // Calcular total de un producto
    calcularTotal(precio, cantidad) {
        return (precio * cantidad).toFixed(2);
    }

    // Permitir agregar con Enter
    manejarTecla(e) {
        if (e.key === 'Enter') {
            this.agregarProducto();
        }
    }

    // Método render para mostrar el componente
    render() {
        return html`
            <div class="container py-4">
                <h1 class="text-center mb-4">Carrito de Productos</h1>

                <!-- Formulario para agregar producto -->
                <div class="row mb-4">
                    <div class="col-12 col-md-8 offset-md-2">
                        <div class="p-3 bg-white rounded">
                            <h5 class="mb-3">Agregar Producto</h5>
                            <div class="row g-2">
                                <div class="col-12 col-sm-6">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        placeholder="Nombre"
                                        .value=${this.nuevoProducto.nombre}
                                        @input=${this.actualizarNombre}
                                        @keyup=${this.manejarTecla}
                                    >
                                </div>
                                <div class="col-12 col-sm-4">
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        placeholder="Precio"
                                        step="0.01"
                                        min="0"
                                        .value=${this.nuevoProducto.precio}
                                        @input=${this.actualizarPrecio}
                                        @keyup=${this.manejarTecla}
                                    >
                                </div>
                                <div class="col-12 col-sm-2">
                                    <button 
                                        @click=${() => this.agregarProducto()}
                                        class="btn btn-primary w-100"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lista de productos -->
                <div class="row g-3">
                    ${this.productos.map(producto => html`
                        <div class="col-12 col-sm-6 col-lg-4">
                            <div class="bg-white p-3 rounded">
                                <h5>${producto.nombre}</h5>
                                <p class="mb-2">Precio: $${producto.precio.toFixed(2)}</p>
                                <div class="d-flex gap-2 align-items-center mb-2">
                                    <button @click=${() => this.disminuirCantidad(producto.id)} class="btn btn-sm btn-outline-primary">−</button>
                                    <span class="flex-grow-1 text-center">${producto.cantidad}</span>
                                    <button @click=${() => this.aumentarCantidad(producto.id)} class="btn btn-sm btn-outline-primary">+</button>
                                </div>
                                <p class="mb-0"><strong>Total: $${this.calcularTotal(producto.precio, producto.cantidad)}</strong></p>
                            </div>
                        </div>
                    `)}
                </div>

                ${this.productos.length === 0 ? html`
                    <div class="text-center py-4">
                        <p>No hay productos</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('producto-card', ProductoCard);
