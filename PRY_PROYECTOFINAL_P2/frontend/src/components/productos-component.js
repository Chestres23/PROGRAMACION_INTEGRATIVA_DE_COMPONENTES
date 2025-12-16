import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

/**
 * Productos Component
 * Gestión CRUD de productos
 */
export class ProductosComponent extends LitElement {
    static properties = {
        productos: { type: Array },
        productoEditando: { type: Object },
        modoEdicion: { type: Boolean },
        productoAEliminarId: { type: Number },
        usuario: { type: Object }
    };

    static styles = [unsafeCSS(bootstrap), css`
        :host { display:block; }
        .product-img { height:200px; object-fit:cover; }
    `];

    constructor() {
        super();
        this.productos = [];
        this.productoEditando = null;
        this.modoEdicion = false;
        this.toastMsg = '';
        this.toastType = 'info';
        this.productoAEliminarId = null;
        this.usuario = null;
        this.cargarProductos();
    }

    // Usar Shadow DOM para aplicar estilos importados

    cargarProductos() {
        fetch('http://localhost:3000/productos')
            .then(res => res.json())
            .then(data => {
                this.productos = data;
            })
            .catch(err => console.error('Error al cargar productos:', err));
    }

    nuevoProducto() {
        this.productoEditando = {
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            categoria: 'Electrónica',
            imagen_url: 'https://via.placeholder.com/200',
            estado: 'activo'
        };
        this.modoEdicion = true;
    }

    editarProducto(producto) {
        this.productoEditando = { ...producto };
        this.modoEdicion = true;
    }

    cerrarFormulario() {
        this.modoEdicion = false;
        this.productoEditando = null;
    }

    guardarProducto(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const producto = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio: parseFloat(formData.get('precio')),
            stock: parseInt(formData.get('stock')),
            categoria: formData.get('categoria'),
            imagen_url: formData.get('imagen_url'),
            estado: formData.get('estado')
        };

        const url = this.productoEditando?.id 
            ? `http://localhost:3000/productos/${this.productoEditando.id}`
            : 'http://localhost:3000/productos';
        
        const method = this.productoEditando?.id ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        })
        .then(res => res.json())
        .then(() => {
            this.toastMsg = this.productoEditando?.id ? 'Producto actualizado' : 'Producto creado';
            this.toastType = 'success';
            this.cerrarFormulario();
            this.cargarProductos();
            setTimeout(() => { this.toastMsg = ''; }, 5000);
        })
        .catch(err => {
            console.error('Error:', err);
            this.toastMsg = 'Error al guardar producto';
            this.toastType = 'error';
            setTimeout(() => { this.toastMsg = ''; }, 5000);
        });
    }

    eliminarProducto(id) {

        fetch(`http://localhost:3000/productos/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                this.toastMsg = 'Producto eliminado';
                this.toastType = 'success';
                this.cargarProductos();
                setTimeout(() => { this.toastMsg = ''; }, 5000);
            })
            .catch(err => {
                console.error('Error:', err);
                this.toastMsg = 'Error al eliminar producto';
                this.toastType = 'error';
                setTimeout(() => { this.toastMsg = ''; }, 5000);
            });
    }

    confirmarEliminacion(id) {
        this.productoAEliminarId = id;
        this.requestUpdate();
    }

    cancelarEliminacion() {
        this.productoAEliminarId = null;
        this.requestUpdate();
    }

    eliminarProductoConfirmado() {
        const id = this.productoAEliminarId;
        if (!id) return;
        fetch(`http://localhost:3000/productos/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                this.toastMsg = 'Producto eliminado';
                this.toastType = 'success';
                this.cargarProductos();
                this.productoAEliminarId = null;
                setTimeout(() => { this.toastMsg = ''; }, 5000);
            })
            .catch(err => {
                console.error('Error:', err);
                this.toastMsg = 'Error al eliminar producto';
                this.toastType = 'error';
                setTimeout(() => { this.toastMsg = ''; }, 2500);
            });
    }

    render() {
        return html`
            <div class="container py-3">
                <h2 class="text-primary text-center mb-3"> Productos</h2>

                <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                    <div class="text-muted">Total: <strong>${this.productos.length}</strong> productos</div>
                    ${this.usuario && this.usuario.rol === 'Administrador' ? html`
                        <button class="btn btn-primary" @click="${this.nuevoProducto}">Nuevo Producto</button>
                    ` : ''}
                </div>

                <div class="row g-4">
                    ${this.productos.map(producto => html`
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="card h-100 shadow-sm border-0">
                                <img src="${producto.imagen_url}" alt="${producto.nombre}" class="card-img-top product-img" />
                                <div class="card-body">
                                    <h5 class="card-title">${producto.nombre}</h5>
                                    <p class="card-text text-muted">${producto.descripcion}</p>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="fw-bold text-success">$${producto.precio}</span>
                                        <span class="badge ${producto.estado === 'activo' ? 'bg-success' : 'bg-danger'}">${producto.estado}</span>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span> Stock: ${producto.stock}</span>
                                        <span class="text-muted">${producto.categoria || 'General'}</span>
                                    </div>
                                    ${this.usuario && this.usuario.rol === 'Administrador' ? html`
                                        <div class="d-flex gap-2">
                                            <button class="btn btn-outline-primary btn-sm" @click="${() => this.editarProducto(producto)}">Editar</button>
                                            <button class="btn btn-outline-danger btn-sm" @click="${() => this.confirmarEliminacion(producto.id)}">Eliminar</button>
                                        </div>
                                    ` : html`
                                        <div class="alert alert-info py-2 mb-0">
                                            Para comprar, visita nuestro local
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `)}
                </div>

                ${this.modoEdicion ? html`
                    <div class="modal fade show" style="display:block" tabindex="-1" aria-modal="true" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">${this.productoEditando?.id ? ' Editar Producto' : 'Nuevo Producto'}</h5>
                                    <button type="button" class="btn-close" @click="${this.cerrarFormulario}"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit="${this.guardarProducto}">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre *</label>
                                            <input type="text" name="nombre" class="form-control" required .value="${this.productoEditando?.nombre || ''}" />
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Descripción</label>
                                            <textarea name="descripcion" class="form-control">${this.productoEditando?.descripcion || ''}</textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Precio *</label>
                                            <input type="number" name="precio" step="0.01" class="form-control" required .value="${this.productoEditando?.precio || ''}" />
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Stock *</label>
                                            <input type="number" name="stock" class="form-control" required .value="${this.productoEditando?.stock || ''}" />
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Categoría</label>
                                            <select name="categoria" class="form-select" .value="${this.productoEditando?.categoria || 'Electrónica'}">
                                                <option value="Electrónica">Electrónica</option>
                                                <option value="Accesorios">Accesorios</option>
                                                <option value="Audio">Audio</option>
                                                <option value="Computadoras">Computadoras</option>
                                                <option value="Gaming">Gaming</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">URL de Imagen</label>
                                            <input type="url" name="imagen_url" class="form-control" .value="${this.productoEditando?.imagen_url || 'https://via.placeholder.com/200'}" />
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Estado</label>
                                            <select name="estado" class="form-select" .value="${this.productoEditando?.estado || 'activo'}">
                                                <option value="activo">Activo</option>
                                                <option value="inactivo">Inactivo</option>
                                            </select>
                                        </div>
                                        <div class="modal-footer px-0">
                                            <button type="button" class="btn btn-light" @click="${this.cerrarFormulario}">Cancelar</button>
                                            <button type="submit" class="btn btn-primary">Guardar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-backdrop fade show"></div>
                ` : ''}
            </div>
                ${this.toastMsg ? html`
                    <div class="toast align-items-center text-white ${this.toastType==='success' ? 'bg-success' : 'bg-danger'} border-0 show position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true" style="z-index:1600;">
                        <div class="d-flex">
                            <div class="toast-body">${this.toastMsg}</div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" @click=${() => {this.toastMsg='';}} aria-label="Close"></button>
                        </div>
                    </div>
                ` : ''}

                ${this.productoAEliminarId ? html`
                    <div class="modal fade show" style="display:block" tabindex="-1" aria-modal="true" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Confirmar eliminación</h5>
                                    <button type="button" class="btn-close" @click="${this.cancelarEliminacion}"></button>
                                </div>
                                <div class="modal-body">¿Seguro que deseas eliminar este producto?</div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-light" @click="${this.cancelarEliminacion}">Cancelar</button>
                                    <button type="button" class="btn btn-danger" @click="${this.eliminarProductoConfirmado}">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-backdrop fade show"></div>
                ` : ''}
        `;
    }
}

customElements.define('productos-component', ProductosComponent);
