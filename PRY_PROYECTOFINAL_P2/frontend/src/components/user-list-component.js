/**
 * UserList - Componente de Lista de Usuarios
 * 
 * Web Component con Lit que muestra la lista de usuarios en formato tabla
 * 
 * Funcionalidades:
 * - Mostrar todos los usuarios (consumidos desde user-app)
 * - Eliminar usuarios (DELETE /users/:id)
 * - Emitir evento 'edit' para edición
 * - Confirmación antes de eliminar
 * 
 * Características de Lit:
 * - Propiedades reactivas
 * - Shadow DOM
 * - Directivas de renderizado (.map())
 * - Event listeners
 */
import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class UserList extends LitElement {

    // Propiedad reactiva: array de usuarios
    static properties = {
        usuarios: { type: Array },
        confirmUser: { type: Object },
        toastMsg: { type: String },
        toastType: { type: String }
    };

    static styles = [unsafeCSS(bootstrap), css`
        :host { display:block; }
    `];

    constructor() {
        super();
        this.usuarios = [];
        this.confirmUser = null;
        this.toastMsg = '';
        this.toastType = 'info';
    }

    // Usar Shadow DOM para aplicar estilos importados

    /**
     * Consumir API REST - DELETE /users/:id
     * Elimina un usuario del backend con confirmación previa
     */
    async eliminar(usuario) {
        this.confirmUser = usuario;
    }

    async confirmarEliminar() {
        if (!this.confirmUser) return;
        try {
            const response = await fetch(`http://localhost:3000/users/${this.confirmUser.id}`, { method: 'DELETE' });

            if (response.ok || response.status === 200) {
                this.dispatchEvent(new CustomEvent('deleted', { bubbles: true, composed: true }));
                this.toastMsg = 'Usuario eliminado correctamente';
                this.toastType = 'success';
            } else {
                const errorData = await response.json().catch(() => ({}));
                this.toastMsg = errorData.error || 'Error al eliminar el usuario';
                this.toastType = 'error';
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.toastMsg = 'No se pudo conectar con el servidor';
                this.toastType = 'error';
            }
        } finally {
            this.confirmUser = null;
            setTimeout(() => { this.toastMsg = ''; }, 5000);
        }
    }

    /**
     * Emitir evento 'edit' con los datos del usuario
     */
    editar(usuario) {
        this.dispatchEvent(new CustomEvent('edit', { 
            detail: usuario,  // Datos del usuario a editar
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Método render() - Template de la tabla de usuarios
     * Usa .map() para renderizar cada usuario
     */
    render() {
        // Mostrar mensaje si no hay usuarios
        if (!this.usuarios || this.usuarios.length === 0) {
            return html`
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-body text-center text-muted">
                        <h5 class="mb-2">Lista de usuarios</h5>
                        <p class="mb-0">No hay usuarios registrados. Crea uno usando el formulario.</p>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="card shadow-sm border-0">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">Lista de usuarios</h5>
                    <span class="badge bg-light text-secondary border">${this.usuarios.length} en total</span>
                </div>
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Directiva .map() para iterar sobre el array -->
                        ${this.usuarios.map(u => html`
                            <tr>
                                <td>${u.id}</td>
                                <td>${u.nombre}</td>
                                <td>${u.correo}</td>
                                <td>${u.rol}</td>
                                <td>
                                    <span class="badge ${u.estado === 'activo' ? 'bg-success' : 'bg-danger'}">${u.estado}</span>
                                </td>
                                <td class="text-end">
                                    <div class="d-inline-flex gap-2">
                                        <button 
                                            class="btn btn-outline-primary btn-sm"
                                            @click=${() => this.editar(u)}
                                            title="Editar usuario">
                                            Editar
                                        </button>
                                        <button 
                                            class="btn btn-outline-danger btn-sm"
                                            @click=${() => this.eliminar(u)}
                                            title="Eliminar usuario">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `)}
                    </tbody>
                </table>
                </div>
            </div>

            ${this.confirmUser ? html`
                <div class="modal fade show" style="display:block" tabindex="-1" aria-modal="true" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Eliminar usuario</h5>
                                <button type="button" class="btn-close" aria-label="Close" @click=${() => {this.confirmUser=null;}}></button>
                            </div>
                            <div class="modal-body">
                                ¿Seguro que deseas eliminar a <strong>${this.confirmUser.nombre}</strong>?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click=${() => {this.confirmUser=null;}}>Cancelar</button>
                                <button type="button" class="btn btn-danger" @click=${this.confirmarEliminar}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop fade show"></div>
            ` : ''}

            ${this.toastMsg ? html`
                <div class="toast align-items-center text-white ${this.toastType==='success' ? 'bg-success' : 'bg-danger'} border-0 show position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true" style="z-index:1600;">
                    <div class="d-flex">
                        <div class="toast-body">${this.toastMsg}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click=${() => {this.toastMsg='';}} aria-label="Close"></button>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

// Registrar el Web Component
customElements.define('user-list', UserList);
