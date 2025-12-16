import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class RegisterComponent extends LitElement {
  static properties = {
    error: { type: String },
    success: { type: String }
  };

  static styles = [
    unsafeCSS(bootstrap),
    css`:host{display:block;}`
  ];

  constructor() {
    super();
    this.error = '';
    this.success = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.error = '';
    this.success = '';
    const form = e.target;
    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim().toLowerCase();
    const password = form.password.value;

    if (!nombre || !correo || !password) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
    if (/\d/.test(nombre)) {
      this.error = 'El nombre no debe contener números';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      this.error = 'Ingresa un correo válido';
      return;
    }

    try {
      const resp = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password, rol: 'Usuario', estado: 'activo' })
      });
      const data = await resp.json();
      if (!resp.ok) {
        this.error = data.error || 'Error al registrar usuario';
        return;
      }
      // Auto login tras registrar
      const loginResp = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });
      const loginData = await loginResp.json();
      if (!loginResp.ok || loginData.error) {
        this.success = 'Usuario registrado. Inicia sesión para continuar.';
        return;
      }
      localStorage.setItem('usuario', JSON.stringify(loginData.usuario));
      this.dispatchEvent(new CustomEvent('login-exitoso', { bubbles: true, composed: true, detail: loginData.usuario }));
    } catch (err) {
      console.error('Error registro:', err);
      this.error = 'Error de conexión con el servidor';
    }
  }

  render() {
    return html`
      <div class="card shadow-lg rounded-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div class="fw-bold"> Registrarse</div>
          <button type="button" class="btn btn-sm btn-outline-secondary" aria-label="Cerrar" @click="${() => this.dispatchEvent(new CustomEvent('cerrar-registro',{bubbles:true,composed:true}))}">✖</button>
        </div>
        <div class="card-body">
          ${this.error ? html`<div class="alert alert-danger py-2"> ${this.error}</div>` : ''}
          ${this.success ? html`<div class="alert alert-success py-2"> ${this.success}</div>` : ''}
          <form @submit="${this.handleSubmit}" novalidate>
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre Completo</label>
              <input type="text" id="nombre" name="nombre" class="form-control" placeholder="Ej: Juan Pérez" required minlength="3" pattern="^[^0-9]+$" title="No se permiten números" />
            </div>
            <div class="mb-3">
              <label for="correo" class="form-label">Correo Electrónico</label>
              <input type="email" id="correo" name="correo" class="form-control" placeholder="ejemplo@correo.com" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required minlength="6" />
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">Crear Cuenta</button>
              <button
                type="button"
                class="btn btn-light"
                @click="${() => this.dispatchEvent(new CustomEvent('cerrar-registro',{bubbles:true,composed:true}))}">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define('register-component', RegisterComponent);