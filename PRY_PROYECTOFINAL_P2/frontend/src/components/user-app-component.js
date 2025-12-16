/**
 * UserApp - Componente Principal de la Aplicación
 * 
 * Web Component creado con Lit que actúa como contenedor principal
 * y controlador central de la aplicación de gestión de usuarios.
 * 
 * Responsabilidades:
 * - Consumir API REST para obtener usuarios (GET /users)
 * - Gestionar el estado global de la aplicación
 * - Coordinar la comunicación entre componentes hijos
 * - Manejar estados de carga y errores
 * 
 * Características de Lit implementadas:
 * - Propiedades reactivas con @property
 * - Shadow DOM para encapsulación
 * - Estilos CSS encapsulados
 * - Eventos personalizados
 */
import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';
import './user-form-component.js';
import './user-list-component.js';

export class UserApp extends LitElement {

    // Propiedades reactivas de Lit - Cualquier cambio re-renderiza el componente
    static properties = {
        usuarios: { type: Array },           // Lista de usuarios desde el API
        usuarioSeleccionado: { type: Object }, // Usuario en modo edición
        loading: { type: Boolean },          // Estado de carga
        error: { type: String }              // Mensajes de error
    };

    // Estilos CSS encapsulados con Shadow DOM
    // Los estilos solo afectan a este componente
    static styles = [unsafeCSS(bootstrap), css`
        :host { display:block; }
    `];

    constructor() {
        super();
        // Inicializar propiedades reactivas
        this.usuarios = [];
        this.usuarioSeleccionado = null;
        this.loading = true;
        this.error = null;
        // Cargar usuarios al iniciar el componente
        this.loadUsers();
    }

    /**
     * Consumir API REST - GET /users
     * Obtiene todos los usuarios desde el backend
     */
    async loadUsers() {
        this.loading = true;
        this.error = null;
        
        try {
            const res = await fetch('http://localhost:3000/users');
            
            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }
            
            // Actualizar propiedad reactiva - Lit re-renderizará automáticamente
            this.usuarios = await res.json();
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            this.error = 'No se pudo conectar con el servidor. Asegúrese de que el backend esté ejecutándose en http://localhost:3000';
        } finally {
            this.loading = false;
        }
    }

    /**
     * Manejador de evento personalizado 'edit'
     * Recibe el usuario a editar desde user-list-component
     */
    handleEdit(e) {
        this.usuarioSeleccionado = e.detail;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Manejador de evento personalizado 'saved'
     * Se dispara cuando se crea o actualiza un usuario
     */
    handleSaved() {
        this.usuarioSeleccionado = null;
        this.loadUsers(); // Recargar lista actualizada
    }

    /**
     * Manejador de evento personalizado 'cancel'
     * Cancela la edición de un usuario
     */
    handleCancel() {
        this.usuarioSeleccionado = null;
    }

    /**
     * Método render() de Lit
     * Retorna un template literal con html`` tagged template
     * El renderizado es reactivo - se actualiza cuando cambian las propiedades
     */
    render() {
        return html`
            <section class="py-4">
                <div class="container">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <div>
                            <p class="text-uppercase text-primary fw-semibold mb-1">Panel</p>
                            <h2 class="fw-bold mb-0">Gestión de usuarios</h2>
                        </div>
                        <span class="badge bg-light text-secondary border">Total: ${this.usuarios?.length || 0}</span>
                    </div>

                    ${this.error ? html`
                        <div class="alert alert-danger" role="alert">
                            ${this.error}
                        </div>
                    ` : ''}

                    ${this.loading ? html`
                        <div class="d-flex justify-content-center py-5 text-muted">Cargando usuarios...</div>
                    ` : html`
                        <div class="row g-3">
                            <div class="col-12 col-lg-4">
                                <user-form 
                                    .usuario=${this.usuarioSeleccionado}
                                    @saved=${this.handleSaved}
                                    @cancel=${this.handleCancel}>
                                </user-form>
                            </div>
                            <div class="col-12 col-lg-8">
                                <user-list 
                                    .usuarios=${this.usuarios}
                                    @edit=${this.handleEdit}
                                    @deleted=${this.loadUsers}>
                                </user-list>
                            </div>
                        </div>
                    `}
                </div>
            </section>
        `;
    }
}

// Registrar el Web Component personalizado en el DOM
customElements.define('user-app', UserApp);
