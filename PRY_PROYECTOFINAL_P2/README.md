# 🛒 ChesStore - Sistema de Gestión

Proyecto Final: Sistema completo de gestión con Web Components (Lit) + API REST + MySQL

## 📋 Descripción

**ChesStore** es un sistema completo de gestión empresarial que implementa:

* **Frontend**: Web Components modernos con Lit Framework
* **Backend**: API REST robusta con Node.js + Express
* **Base de Datos**: MySQL con tablas de usuarios y productos
* **Autenticación**: Sistema de login seguro con bcrypt
* **Gestión de Productos**: CRUD completo de inventario
* **Roles de Usuario**: Administrador, Usuario e Invitado
* **UI Moderna**: Bootstrap 5 con diseño responsive

## 🛠️ Tecnologías Utilizadas

### Frontend

* **Lit** v3.2.1 – Framework para Web Components
* **Vite** v6.0.7 – Build tool y desarrollo
* **Bootstrap** v5.3.3 – Framework CSS moderno
* **Shadow DOM** – Encapsulación de estilos
* **Custom Events** – Comunicación entre componentes
* **LocalStorage** – Persistencia de sesión y preferencias

### Backend

* **Node.js** v18+ – Entorno de ejecución
* **Express** v5.2.1 – Framework web
* **MySQL2** v3.15.3 – Driver MySQL
* **bcryptjs** v2.4.3 – Hash de contraseñas
* **CORS** v2.8.5 – Manejo de peticiones cross-origin

### Base de Datos

* **MySQL** v5.7+ – Base de datos relacional
* **Tablas**: usuarios, productos (con AUTO_INCREMENT inteligente)

## 📁 Estructura del Proyecto

```
PRY_PROYECTOFINAL_P2/
├── backend/
│   ├── db.js                    # Configuración MySQL
│   ├── server.js                # Servidor Express + CORS
│   ├── package.json             # Dependencias backend
│   └── routes/
│       ├── users.js             # CRUD de usuarios
│       ├── auth.js              # Login/autenticación
│       └── productos.js         # CRUD de productos
├── frontend/
│   ├── index.html               # Página principal
│   ├── package.json             # Dependencias frontend
│   └── src/
│       ├── main.js              # App principal + routing
│       └── components/
│           ├── user-app-component.js      # Gestión usuarios
│           ├── user-form-component.js     # Formulario usuarios
│           ├── user-list-component.js     # Lista usuarios
│           ├── login-component.js         # Login modal
│           ├── register-component.js      # Registro modal
│           ├── productos-component.js     # Gestión productos
│           ├── navbar-component.js        # Navegación + tema
│           ├── home-component.js          # Página inicio
│           ├── contacto-component.js      # Página contacto
│           └── footer-component.js        # Footer
└── database/
    └── gestion_usuarios.sql     # Script SQL completo
```

## 🚀 Instalación y Configuración

### 1. Requisitos Previos

* **Node.js** v18 o superior
* **MySQL** v5.7+ o **UniServer**
* **npm** v9+ (incluido con Node.js)
* Navegador moderno (Chrome, Firefox, Edge)

### 2. Configurar la Base de Datos

#### ⭐ Opción A: UniServer Zero XV con phpMyAdmin (Windows)

1. Inicia UniServer (Apache y MySQL)
2. Abre phpMyAdmin: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Usuario: `root` – Contraseña: `admin`
4. Ir a la pestaña **SQL**
5. Ejecutar:

   ```sql
   CREATE DATABASE gestion_usuarios;
   ```
6. Seleccionar la base `gestion_usuarios`
7. Pestaña **Importar**
8. Importar `database/gestion_usuarios.sql`
9. Ejecutar

#### Opción B: PowerShell (Windows)

```powershell
Get-Content database/gestion_usuarios.sql | mysql -u root -p
```

O importar manualmente:

```sql
CREATE DATABASE gestion_usuarios;
USE gestion_usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL
);
```

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Editar el archivo **backend/db.js**:

```javascript
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin',
  database: 'gestion_usuarios',
  port: 3306
});
```

Ejecutar el servidor:

```bash
node server.js
```

### 4. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en: **[http://localhost:5173](http://localhost:5173)**

## 🔐 Autenticación

| Método | Ruta              | Descripción        |
| ------ | ----------------- | ------------------ |
| POST   | `/auth/login`     | Autenticar usuario |
| POST   | `/auth/verificar` | Verificar sesión   |

## 👤 Usuarios (CRUD)

| Método | Ruta         | Descripción        |
| ------ | ------------ | ------------------ |
| GET    | `/users`     | Listar usuarios    |
| GET    | `/users/:id` | Obtener usuario    |
| POST   | `/users`     | Crear usuario      |
| PUT    | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario   |

## 📦 Productos (CRUD)

| Método | Ruta             | Descripción         |
| ------ | ---------------- | ------------------- |
| GET    | `/productos`     | Listar productos    |
| GET    | `/productos/:id` | Obtener producto    |
| POST   | `/productos`     | Crear producto      |
| PUT    | `/productos/:id` | Actualizar producto |
| DELETE | `/productos/:id` | Eliminar producto   |

## 📮 Ejemplos de Peticiones

### Login

```json
{
  "correo": "admin@chesstore.com",
  "password": "admin123"
}
```

### Crear Usuario

```json
{
  "nombre": "Carlos López",
  "correo": "carlos@example.com",
  "password": "carlos123",
  "rol": "Usuario",
  "estado": "activo"
}
```

### Crear Producto

```json
{
  "nombre": "Laptop HP",
  "descripcion": "Laptop HP 15.6\" Intel Core i5",
  "precio": 599.99,
  "stock": 15,
  "categoria": "Computadoras",
  "imagen_url": "https://via.placeholder.com/200"
}
```

## 📦 Build para Producción

### Backend

```bash
node server.js
```

### Frontend

```bash
npm run build
```

## 👨‍💻 Autor

Proyecto Final – Desarrollo Web con Web Components y API REST

## 📄 Licencia

ISC

## 📚 Documentación

* [https://lit.dev/](https://lit.dev/)
* [https://expressjs.com/](https://expressjs.com/)
* [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
* [https://developer.mozilla.org/docs/Web/Web_Components](https://developer.mozilla.org/docs/Web/Web_Components)
