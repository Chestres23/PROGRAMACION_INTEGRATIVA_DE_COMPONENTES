// Importar el componente principal
import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

// Importar todos los componentes
import './components/login-component.js';
import './components/register-component.js';
import './components/navbar-component.js';
import './components/home-component.js';
import './components/contacto-component.js';
import './components/productos-component.js';
import './components/user-app-component.js';
import './components/user-form-component.js';
import './components/user-list-component.js';
import './components/footer-component.js';

/**
 * AppMain - Componente Principal de la Aplicación
 * Controla autenticación y navegación entre vistas
 */
class AppMain extends LitElement {
	static properties = {
		usuario: { type: Object },
		vistaActual: { type: String },
		showLogin: { type: Boolean },
		showRegister: { type: Boolean }
	};

	static styles = [unsafeCSS(bootstrap), css`
		:host {
			display: block;
			min-height: 100vh;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		}

		.content {
			background: #f5f5f5;
			min-height: calc(100vh - 80px);
		}

		/* Asegura que modales y backdrop se posicionen sobre el resto */
		.modal { display:block; }
		.modal-backdrop { position:fixed; inset:0; z-index:1050; }
	`];

	constructor() {
		super();
		this.usuario = null;
		this.vistaActual = 'home';
		this.showLogin = false;
		this.showRegister = false;
		this.verificarSesion();
	}

	/**
	 * Verifica si hay una sesión activa en localStorage
	 */
	verificarSesion() {
		const usuarioGuardado = localStorage.getItem('usuario');
		if (usuarioGuardado) {
			this.usuario = JSON.parse(usuarioGuardado);
		}
	}

	/**
	 * Maneja el login exitoso
	 */
	handleLoginExitoso(e) {
		this.usuario = e.detail;
		this.vistaActual = 'home';
		this.showLogin = false;
	}

	/**
	 * Maneja el logout
	 */
	handleLogout() {
		this.usuario = null;
		this.vistaActual = 'home';
	}

	handleOpenLogin() {
		this.showLogin = true;
	}

	handleCloseLogin() {
		this.showLogin = false;
	}

	handleOpenRegister() {
		this.showRegister = true;
	}

	handleCloseRegister() {
		this.showRegister = false;
	}
	/**
	 * Cambia la vista actual
	 */
	handleCambiarVista(e) {
		this.vistaActual = e.detail.vista;
	}

	/**
	 * Renderiza la vista actual según la navegación
	 */
	renderVista() {
		switch(this.vistaActual) {
			case 'home':
				return html`<home-component .usuario="${this.usuario}" @abrir-login="${this.handleOpenLogin}" @abrir-registro="${this.handleOpenRegister}"></home-component>`;
            
			case 'productos':
				return html`<productos-component .usuario="${this.usuario}"></productos-component>`;
            
			case 'usuarios':
				return html`<user-app></user-app>`;
            
			case 'contacto':
				return html`<contacto-component></contacto-component>`;
            
			default:
				return html`<home-component .usuario="${this.usuario}"></home-component>`;
		}
	}

    // Método render() de Lit
	render() {
		return html`
			<navbar-component
				.usuario="${this.usuario}"
				.vistaActual="${this.vistaActual}"
				@cambiar-vista="${this.handleCambiarVista}"
				@logout="${this.handleLogout}"
				@abrir-login="${this.handleOpenLogin}"
				@abrir-registro="${this.handleOpenRegister}"
			></navbar-component>
            
			<div class="content">
				${this.renderVista()}
			</div>

			<footer-component></footer-component>

			${this.showLogin ? html`
				<div class="modal fade show" style="display:block" tabindex="-1" aria-modal="true" role="dialog">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content border-0 shadow">
							<div class="modal-body p-0">
								<login-component 
									@login-exitoso="${this.handleLoginExitoso}"
									@cerrar-login="${this.handleCloseLogin}"
								></login-component>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-backdrop fade show"></div>
			` : ''}

			${this.showRegister ? html`
				<div class="modal fade show" style="display:block" tabindex="-1" aria-modal="true" role="dialog">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content border-0 shadow">
							<div class="modal-body p-0">
								<register-component 
									@login-exitoso="${this.handleLoginExitoso}"
									@cerrar-registro="${this.handleCloseRegister}"
								></register-component>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-backdrop fade show"></div>
			` : ''}
		`;
	}
}

customElements.define('app-main', AppMain);
console.log('Aplicación de Gestión de Usuarios iniciada');