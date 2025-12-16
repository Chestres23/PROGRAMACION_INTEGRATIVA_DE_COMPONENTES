import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class FooterComponent extends LitElement {
  static styles = [
    unsafeCSS(bootstrap),
    css`
      :host { display:block; }
      .footer { background:#0d6efd; color:#fff; }
      a { color: #ffd966; text-decoration: none; }
    `
  ];

  render() {
    const year = new Date().getFullYear();
    return html`
      <footer class="footer mt-auto py-3">
        <div class="container d-flex justify-content-center align-items-center">
          <span>ChesStore &middot; ${year}</span>
        </div>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);