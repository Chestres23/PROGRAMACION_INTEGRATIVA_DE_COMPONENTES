import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

/**
 * Navbar Component
 * Muestra opciones según el rol del usuario
 */
export class NavbarComponent extends LitElement {
    static properties = {
        usuario: { type: Object },
        vistaActual: { type: String },
        showLogoutModal: { type: Boolean },
        isNavOpen: { type: Boolean }
    };

    static styles = [
        unsafeCSS(bootstrap),
        css`:host{display:block;}`
    ];
    constructor() {
        super();
        this.usuario = null;
        this.vistaActual = 'home';
        this.isNavOpen = false;
    }

    cambiarVista(vista) {
        this.vistaActual = vista;
        this.dispatchEvent(new CustomEvent('cambiar-vista', {
            bubbles: true,
            composed: true,
            detail: { vista }
        }));
        this.showLogoutModal = false;
    }

    cerrarSesion() {
        this.showLogoutModal = true;
    }

    confirmarLogout() {
        localStorage.removeItem('usuario');
        this.showLogoutModal = false;
        this.dispatchEvent(new CustomEvent('logout', {
            bubbles: true,
            composed: true
        }));
    }

    cancelarLogout() {
        this.showLogoutModal = false;
    }

    getRolIcon(rol) {
        switch(rol) {
            case 'Administrador': return '';
            case 'Usuario': return '';
            case 'Invitado': return '';
            default: return '';
        }
    }

    render() {
        const usuario = this.usuario || { nombre: 'Invitado', rol: 'Invitado' };
        const { nombre, rol } = usuario;

        return html`
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#" @click="${() => this.cambiarVista('home')}">🛒 ChesStore</a>
                    <button class="navbar-toggler" type="button" aria-controls="navbarMain" aria-expanded="${this.isNavOpen ? 'true' : 'false'}" aria-label="Toggle navigation" @click="${() => { this.isNavOpen = !this.isNavOpen; }}">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-collapse collapse ${this.isNavOpen ? 'show' : ''}" id="navbarMain">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link ${this.vistaActual === 'home' ? 'active' : ''}" href="#" @click="${() => this.cambiarVista('home')}">Home</a>
                            </li>

                        <!-- Opciones para Usuario y Administrador -->
                        ${rol !== 'Invitado' ? html`
                            <li class="nav-item" ?hidden="${rol === 'Invitado'}">
                                <a class="nav-link ${this.vistaActual === 'productos' ? 'active' : ''}" href="#" @click="${() => this.cambiarVista('productos')}">Productos</a>
                            </li>
                        ` : ''}

                        <!-- Opciones solo para Administrador -->
                        ${rol === 'Administrador' ? html`
                            <li class="nav-item" ?hidden="${rol !== 'Administrador'}">
                                <a class="nav-link ${this.vistaActual === 'usuarios' ? 'active' : ''}" href="#" @click="${() => this.cambiarVista('usuarios')}">Usuarios</a>
                            </li>
                        ` : ''}

                        <!-- Contacto para todos -->
                            <li class="nav-item">
                                <a class="nav-link ${this.vistaActual === 'contacto' ? 'active' : ''}" href="#" @click="${() => this.cambiarVista('contacto')}"> Contacto</a>
                            </li>
                        </ul>

                        ${rol === 'Invitado' ? html`
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-light" @click="${() => this.dispatchEvent(new CustomEvent('abrir-login', {bubbles:true, composed:true}))}">Ingresar</button>
                                <button class="btn btn-outline-light" @click="${() => this.dispatchEvent(new CustomEvent('abrir-registro', {bubbles:true, composed:true}))}">Registrarse</button>
                            </div>
                        ` : html`
                            <div class="d-flex align-items-center gap-2 text-white">
                                <span class="badge bg-light text-primary">${this.getRolIcon(rol)} ${rol}:</span>
                                <span class="fw-semibold">${nombre}</span>
                                <button class="btn btn-danger btn-sm" @click="${this.cerrarSesion}">Salir</button>
                            </div>
                        `}
                    </div>
                </div>
            </nav>

            ${this.showLogoutModal ? html`
                <div class="modal fade show" style="display:block" tabindex="-1" aria-modal="true" role="dialog">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Cerrar sesión</h5>
                                <button type="button" class="btn-close" aria-label="Close" @click="${this.cancelarLogout}"></button>
                            </div>
                            <div class="modal-body">
                                ¿Seguro que deseas cerrar sesión?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="${this.cancelarLogout}">Cancelar</button>
                                <button type="button" class="btn btn-primary" @click="${this.confirmarLogout}">Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop fade show"></div>
            ` : ''}
        `;
    }
}

customElements.define('navbar-component', NavbarComponent);
