/**
 * UserForm - Componente de Formulario de Usuario
 * 
 * Web Component con Lit que maneja la creación y edición de usuarios
 * 
 * Funcionalidades:
 * - Crear nuevos usuarios (POST /users)
 * - Editar usuarios existentes (PUT /users/:id)
 * - Validación de formularios HTML5
 * - Emitir eventos personalizados
 * 
 * Características de Lit:
 * - Propiedades reactivas
 * - Shadow DOM
 * - Estilos CSS encapsulados
 * - Event binding
 */
import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class UserForm extends LitElement {

    // Propiedad reactiva: usuario en modo edición (null = modo creación)
    static properties = {
        usuario: { type: Object },
        errorMsg: { type: String },
        successMsg: { type: String }
    };

    static styles = [unsafeCSS(bootstrap), css`
        :host { display:block; }
    `];

    constructor() {
        super();
        this.usuario = null;
        this.errorMsg = '';
        this.successMsg = '';
    }

    // Usar Shadow DOM para aplicar estilos importados

    /**
     * Lifecycle de Lit: updated()
     * Se ejecuta después de que las propiedades cambian
     * Aquí llenamos el formulario cuando recibimos un usuario para editar
     */
    updated(changedProperties) {
        if (changedProperties.has('usuario') && this.usuario) {
            this.fillForm();
        }
    }

    /**
     * Llenar el formulario con datos del usuario en modo edición
     */
    fillForm() {
        if (this.usuario) {
            const form = this.shadowRoot.querySelector('form');
            form.nombre.value = this.usuario.nombre || '';
            form.correo.value = this.usuario.correo || '';
            form.rol.value = this.usuario.rol || '';
            form.estado.value = this.usuario.estado || 'activo';
        }
    }

    /**
     * Consumir API REST - POST /users o PUT /users/:id
     * Maneja la creación y actualización de usuarios
     */
    async submit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Validación adicional de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.correo)) {
            this.errorMsg = 'Por favor ingresa un correo electrónico válido';
            this.successMsg = '';
            return;
        }

        // Validación de nombre: no permitir números
        if (/\d/.test(data.nombre)) {
            this.errorMsg = 'El nombre no debe contener números';
            this.successMsg = '';
            return;
        }

        // Password opcional en edición; por defecto asigna Abcd1234 en creación
        const passwordTrimmed = (data.password || '').trim();
        if (this.usuario && passwordTrimmed === '') {
            delete data.password;
        } else {
            data.password = passwordTrimmed || 'Abcd1234';
        }

        // Determinar método y URL según el modo (crear/editar)
        const method = this.usuario ? 'PUT' : 'POST';
        const url = this.usuario
            ? `http://localhost:3000/users/${this.usuario.id}`
            : 'http://localhost:3000/users';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // Verificar si la respuesta es exitosa (status 200-299)
            if (response.ok || response.status === 201) {
                // Emitir evento personalizado 'saved' con composed y bubbles
                // para que atraviese el Shadow DOM
                this.dispatchEvent(new CustomEvent('saved', {
                    bubbles: true,    // El evento burbujea hacia arriba
                    composed: true    // Atraviesa el Shadow DOM
                }));
                e.target.reset();
                this.usuario = null;
                this.errorMsg = '';
                this.successMsg = 'Usuario guardado correctamente';
            } else {
                // Intentar obtener el mensaje de error del servidor
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || 'Error al guardar el usuario';
                this.errorMsg = errorMessage;
                this.successMsg = '';
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            // Solo mostrar alert si realmente hay un error de red
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté en http://localhost:3000';
                this.successMsg = '';
            }
        }
    }

    /**
     * Cancelar la edición y emitir evento 'cancel'
     */
    cancelEdit() {
        this.usuario = null;
        const form = this.shadowRoot.querySelector('form');
        form.reset();
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Método render() - Template del formulario
     * Renderizado condicional según modo (crear/editar)
     */
    render() {
        return html`
            <form class="card shadow-sm border-0" @submit=${this.submit}>
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">${this.usuario ? 'Editar usuario' : 'Crear nuevo usuario'}</h5>
                    ${this.usuario ? html`<span class="badge bg-light text-secondary border">ID ${this.usuario.id}</span>` : ''}
                </div>
                ${this.errorMsg ? html`<div class="alert alert-danger py-2"> ${this.errorMsg}</div>` : ''}
                ${this.successMsg ? html`<div class="alert alert-success py-2">${this.successMsg}</div>` : ''}
                
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre Completo: *</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" placeholder="Ej: Juan Pérez" maxlength="100" pattern="^[^0-9]*$" title="No debe contener números" required>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña:</label>
                    <input 
                        type="password" 
                        class="form-control" 
                        name="password" 
                        id="password" 
                        placeholder="Abcd1234" 
                        .value="${this.usuario ? '' : 'Abcd1234'}" 
                        title="Déjala vacía para no cambiarla al editar">
                    <small class="text-muted">Por defecto se usará "Abcd1234" si dejas este campo vacío al crear.</small>
                </div>

                <div class="mb-3">
                    <label for="correo" class="form-label">Correo Electrónico: *</label>
                    <input type="email" class="form-control" name="correo" id="correo" placeholder="ejemplo@correo.com" maxlength="100" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Ingresa un correo válido (ejemplo@dominio.com)" required>
                </div>

                <div class="mb-3">
                    <label for="rol" class="form-label">Rol: *</label>
                    <select class="form-select" name="rol" id="rol" required>
                        <option value="">-- Seleccione un rol --</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Usuario">Usuario</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="estado" class="form-label">Estado: *</label>
                    <select class="form-select" name="estado" id="estado" required>
                        <option value="activo"> Activo</option>
                        <option value="inactivo"> Inactivo</option>
                    </select>
                </div>

                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary">
                        ${this.usuario ? 'Actualizar' : 'Crear usuario'}
                    </button>
                    ${this.usuario ? html`
                        <button type="button" class="btn btn-outline-secondary" @click=${this.cancelEdit}>
                            Cancelar
                        </button>
                    ` : ''}
                </div>
                </div>
            </form>
        `;
    }
}

// Registrar el Web Component
customElements.define('user-form', UserForm);
