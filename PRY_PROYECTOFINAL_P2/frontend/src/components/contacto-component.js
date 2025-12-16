import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

/**
 * Contacto Component
 * Página de contacto
 */
export class ContactoComponent extends LitElement {
    static styles = [unsafeCSS(bootstrap), css`
        :host { display:block; }
        .icon-badge { width:3rem; height:3rem; }
    `];

    handleSubmit(e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Te contactaremos pronto. 📧');
        e.target.reset();
    }

    render() {
        return html`
            <section class="py-5 bg-light">
                <div class="container">
                    <div class="text-center mb-4">
                        <p class="text-uppercase text-primary fw-semibold mb-1">Contacto</p>
                        <h2 class="fw-bold">Estamos para ayudarte</h2>
                        <p class="text-muted">Escríbenos y te responderemos en menos de 24 horas.</p>
                    </div>

                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="card h-100 shadow-sm border-0">
                                <div class="card-body text-center">
                                    <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center icon-badge mb-3">
                                        <span class="fs-4 text-primary">📧</span>
                                    </div>
                                    <h5 class="fw-semibold">Correo</h5>
                                    <p class="text-muted mb-0">soporte@chesstore.com</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card h-100 shadow-sm border-0">
                                <div class="card-body text-center">
                                    <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center icon-badge mb-3">
                                        <span class="fs-4 text-success">📱</span>
                                    </div>
                                    <h5 class="fw-semibold">Teléfono</h5>
                                    <p class="text-muted mb-0">+593 99 123 4567</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card h-100 shadow-sm border-0">
                                <div class="card-body text-center">
                                    <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center icon-badge mb-3">
                                        <span class="fs-4 text-info">📍</span>
                                    </div>
                                    <h5 class="fw-semibold">Ubicación</h5>
                                    <p class="text-muted mb-0">Quito, Ecuador</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('contacto-component', ContactoComponent);
