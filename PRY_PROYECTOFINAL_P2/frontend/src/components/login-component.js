import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

/**
 * Componente de Login
 * Permite autenticación con email y password
 */
export class LoginComponent extends LitElement {
    static properties = {
        error: { type: String }
    };

    static styles = [
        unsafeCSS(bootstrap),
        css`
          :host { display: block; }
        `
    ];

    constructor() {
        super();
        this.error = '';
    }

    // Usar Shadow DOM para que se apliquen los estilos importados

    handleSubmit(e) {
        e.preventDefault();
        this.error = '';

        const correo = this.shadowRoot.querySelector('#correo').value;
        const password = this.shadowRoot.querySelector('#password').value;

        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.error = data.error;
            } else {
                // Guardar sesión en localStorage
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                // Disparar evento para cambiar vista
                this.dispatchEvent(new CustomEvent('login-exitoso', {
                    bubbles: true,
                    composed: true,
                    detail: data.usuario
                }));
            }
        })
        .catch(err => {
            console.error('Error en login:', err);
            this.error = 'Error de conexión con el servidor';
        });
    }

    render() {
        return html`
            <div class="card shadow-lg rounded-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div class="fw-bold">Iniciar Sesión</div>
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        aria-label="Cerrar"
                        @click="${() => this.dispatchEvent(new CustomEvent('cerrar-login',{bubbles:true,composed:true}))}">✖</button>
                </div>
                <div class="card-body">
                    ${this.error ? html`<div class="alert alert-danger py-2">❌ ${this.error}</div>` : ''}

                    <form @submit="${this.handleSubmit}" novalidate>
                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo Electrónico</label>
                            <input type="email" id="correo" class="form-control" placeholder="ejemplo@tienda.com" required />
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" id="password" class="form-control" placeholder="••••••••" required />
                        </div>

                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                            <button type="button" class="btn btn-light" @click="${() => this.dispatchEvent(new CustomEvent('cerrar-login',{bubbles:true,composed:true}))}">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('login-component', LoginComponent);
