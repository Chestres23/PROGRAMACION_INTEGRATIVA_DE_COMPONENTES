import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

/**
 * Home Component
 * Página de bienvenida
 */
export class HomeComponent extends LitElement {
    static properties = {
        usuario: { type: Object }
    };

    static styles = [
        unsafeCSS(bootstrap),
        css`:host{display:block;}`
    ];

    render() {
        const usuarioLogueado = this.usuario !== null && this.usuario !== undefined;

        if (usuarioLogueado) {
            return html`
                <div class="container py-5">
                    <div class="p-5 mb-4 bg-success text-white rounded-3 text-center">
                        <h1 class="display-5 fw-bold"> ¡Bienvenido, ${this.usuario.nombre}!</h1>
                        <p class="lead">Gracias por ser parte de ChesStore. Explora nuestros productos y servicios.</p>
                    </div>

                    <div class="row g-4">
                        <div class="col-md-6 col-lg-4">
                            <div class="card shadow-sm">
                                <div class="card-body text-center">
                                    <h3 class="card-title">📦 Productos</h3>
                                    <p class="card-text">Descubre nuestro catálogo completo de productos tecnológicos.</p>
                                    <p class="text-muted">¡Variedad y calidad garantizadas!</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 col-lg-4">
                            <div class="card shadow-sm">
                                <div class="card-body text-center">
                                    <h3 class="card-title">🏪 Tienda Física</h3>
                                    <p class="card-text">Visita nuestra tienda en Quito para comprar directamente.</p>
                                    <p class="text-muted">Atención personalizada y asesoramiento experto.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 col-lg-4">
                            <div class="card shadow-sm">
                                <div class="card-body text-center">
                                    <h3 class="card-title">💬 Contacto</h3>
                                    <p class="card-text">¿Preguntas o consultas?</p>
                                    <p class="text-muted">Nos encantaría escucharte.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 p-4 bg-info bg-opacity-10 rounded-3 border border-info">
                        <h4>ℹ️ Sobre ChesStore</h4>
                        <p>En ChesStore nos especializamos en ofrecer los mejores productos tecnológicos con la más alta calidad. Nuestro equipo está comprometido en brindarte la mejor experiencia de compra.</p>
                    </div>
                </div>
            `;
        } else {
            return html`
                <div class="container py-5">
                    <div class="p-5 mb-4 bg-primary text-white rounded-3 text-center">
                        <h1 class="display-5 fw-bold">👋 ¡Bienvenido a ChesStore!</h1>
                        <p class="lead">Para disfrutar la experiencia completa, inicia sesión o regístrate.</p>
                        <div class="mt-3 d-flex justify-content-center gap-2 flex-wrap">
                            <button class="btn btn-light" @click="${() => this.dispatchEvent(new CustomEvent('abrir-login',{bubbles:true,composed:true}))}" >Ingresar</button>
                            <button class="btn btn-warning" @click="${() => this.dispatchEvent(new CustomEvent('abrir-registro',{bubbles:true,composed:true}))}" >Registrarse</button>
                        </div>
                    </div>

                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <h4 class="card-title">ℹ️ Información de la Tienda</h4>
                                    <p class="card-text">ChesStore es tu destino para los mejores productos tecnológicos de calidad premium.</p>
                                    <p class="card-text">Contamos con una amplia variedad de equipos, accesorios y soluciones tecnológicas.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card shadow-sm border-warning">
                                <div class="card-body bg-warning bg-opacity-10">
                                    <h4 class="card-title">🏪 Compra en Nuestro Local</h4>
                                    <p class="card-text">Los productos se venden <strong>físicamente en nuestro local</strong>.</p>
                                    <p class="card-text">Para comprar, visítanos en persona y disfruta de atención personalizada.</p>
                                    <p class="text-muted">📍 Quito, Ecuador</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

customElements.define('home-component', HomeComponent);
