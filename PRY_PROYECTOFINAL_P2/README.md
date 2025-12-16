# � ChesStore - Sistema de Gestión

Proyecto Final: Sistema completo de gestión con Web Components (Lit) + API REST + MySQL

## 📋 Descripción

**ChesStore** es un sistema completo de gestión empresarial que implementa:
- **Frontend**: Web Components modernos con Lit Framework
- **Backend**: API REST robusta con Node.js + Express
- **Base de Datos**: MySQL con tablas de usuarios y productos
- **Autenticación**: Sistema de login seguro con bcrypt
- **Gestión de Productos**: CRUD completo de inventario
- **Roles de Usuario**: Administrador, Usuario e Invitado
- **UI Moderna**: Bootstrap 5 con diseño responsive

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Lit** v3.2.1 - Framework para Web Components
- **Vite** v6.0.7 - Build tool y desarrollo
- **Bootstrap** v5.3.3 - Framework CSS moderno
- **Shadow DOM** - Encapsulación de estilos
- **Custom Events** - Comunicación entre componentes
- **LocalStorage** - Persistencia de sesión y preferencias

### Backend
- **Node.js** v18+ - Entorno de ejecución
- **Express** v5.2.1 - Framework web
- **MySQL2** v3.15.3 - Driver MySQL
- **bcryptjs** v2.4.3 - Hash de contraseñas
- **CORS** v2.8.5 - Manejo de peticiones cross-origin 

### Base de Datos
- **MySQL** v5.7+ - Base de datos relacional
- **Tablas**: usuarios, productos (con AUTO_INCREMENT inteligente)

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
- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **MySQL** v5.7+ o **UniServer** ([Ver guía](UNISERVER_SETUP.md))
- **npm** v9+ (viene con Node.js)
- Navegador moderno (Chrome, Firefox, Edge)

### 2. Configurar la Base de Datos

#### ⭐ Opción A: UniServer Zero XV con phpMyAdmin (Recomendado - Windows)
1. Inicia UniServer (Start Apache y Start MySQL)
2. Abre phpMyAdmin: http://localhost/phpmyadmin
3. Usuario: `root`, Contraseña: `admin`
4. Click en pestaña "SQL"
5. Ejecuta: `CREATE DATABASE gestion_usuarios;`
6. Click en "gestion_usuarios" en el menú izquierdo
7. Click en pestaña "Importar"
8. Selecciona el archivo `database/gestion_usuarios.sql`
9. Click en "Ejecutar"
10. Listo! Verás la tabla "usuarios" con 4 registros

#### Opción B: Usando PowerShell (Windows)
```powershell
# Desde la raíz del proyecto (C:\WORKSPACE\PRY_PROYECTOFINAL_P2)
Get-Content database/gestion_usuarios.sql | mysql -u root -p
# Ingresa tu contraseña de MySQL cuando te la pida
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

# Navegar a la carpeta backend desde la raíz del proyecto
cd backend


# Instalar dependencias (Express, MySQL2, bcryptjs, CORS)
npm install

# ⚠️ IMPORTANTE: Configurar credenciales de MySQL
# Edita backend/db.js con tus credenciales:
```

**backend/db.js:**
```javascript
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',      // UniServer
    // password: '',        // XAMPP (sin contraseña)
    // password: 'tu_pass', // MySQL standalone
    database: 'gestion_usuarios',
    port: 3306
});
```
 desde la raíz del proyecto
cd frontend

# Instalar dependencias (Lit, Bootstrap, Vite)
npm install

# Iniciar servidor de desarrollo con hot-reload
npm run dev
```

✅ **Frontend corriendo en:** http://localhost:5173

**Abre tu navegador en esa URL y verás ChesStore funcionando!**
```

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Autenticar usuario |
| POST | `/auth/verificar` | Verificar sesión activa |
```
### Usuarios (CRUD completo)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar todos los usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear nuevo usuario |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |
```

### Productos (CRUD completo)
```
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos` | Listar todos los productos |
| GET | `/productos/:id` | Obtener producto por ID |
| POST | `/productos` | Crear nuevo producto |
| PUT | `/productos/:id` | Actualizar producto |
| DELETE | `/productos/:id` | Eliminar producto |
```

### Ejemplos de Peticiones

**Login:**

```json
POST /auth/login
{
  "correo": "admin@chesstore.com",
  "password": "admin123"
}
```

**Crear Usuario:**
```json
POST /users
{
  "nombre": "Carlos López",
  "correo": "carlos@example.com",
  "password": "carlos123",
  "rol": "Usuario",
  "estado": "activo´C"
}
```

**Crear Producto:**
```json
POST /productos
{
  "nombre": "Laptop HP",
  "descripcion": "Laptop HP 15.6\" Intel Core i5",
  "precio": 599.99,
  "stock": 15,
  "categoria": "Computadoras",
  "imagen_url": "https://via.placeholder.com/200"
}
```

### 4. Configurar el Frontend

```bash
# Navegar a la carpeta frontend
cd frontend
**Web Components** con Lit (10 componentes)
✅ **Propiedades reactivas** y estado local
✅ **Shadow DOM** con estilos encapsulados
✅ **Custom Events** para comunicación entre componentes
✅ **Routing interno** (Home, Productos, Usuarios, Contacto)
✅ **Sistema de autenticación** con localStorage
✅ **Roles de usuario** (Admin, Usuario, Invitado)
✅ **CRUD completo** de usuarios y productos
✅ **Validación de formularios** HTML5 + custom
✅ **Diseño responsive** Bootstrap 5
✅ **Modales de confirmación** para acciones críticas
✅ **Toasts persistentes** para feedback visual (5 segundos)
✅ **Animaciones suaves** con transiciones CSS

### Backend
✅ **API REST** completa con Express
✅ **Autenticación segura** con bcrypt
✅ **CORS configurado** para desarrollo
✅ **Validaciones** en todas las rutas
✅ **Manejo de errores** robusto
✅ **IDs secuenciales** sin saltos (reutiliza IDs eliminados)
✅ **Consultas SQL** optimizadas
✅ **Separación de rutas** por módulo

### Base de Datos
✅ **Estructura normalizada**
✅ **Timestamps automáticos** (created_at, updated_at)
✅ **Índices** en campos de búsqueda
✅ **Relaciones** bien definidas
✅ **Datos de prueba** incluidoe en: **http://localhost:5173** (o el puerto que Vite asigne)

## 🔌 API REST - Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Obtener todos los usuarios |
| GET | `/users/:id` | Obtener un usuario específico |
| POST | `/users` | Crear un nuevo usuario |
| PUT | `/users/:id` | Actualizar un usuario existente |
| DELETE | `/users/:id` | Eliminar un usuario |

### Ejemplo de Petición POST
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "rol": "Administrador",
  "estado": "activo"
}
```

## 🎨 Componentes Web Components

### 1. `user-app-component`
Componente principal que:
- Controla el estado de la aplicación
- Gestiona la carga de usuarios desde el API
- Coordina la comunicación entre componentes
- Maneja errores y estados de carga

### 2. `user-form-component`
Formulario para crear y editar usuarios que:
- Valida campos requeridos
- Soporta modo creación y edición
- Emite eventos personalizados (`saved`, `cancel`)
- Usa Shadow DOM para estilos encapsulados

### 3. `user-list-component`
Lista de usuarios que:
- Muestra todos los usuarios en formato tabla
- Permite editar y eliminar usuarios
- Confirma antes de eliminar
- Muestra badges de estado (activo/inactivo)

## ✨ Características Implementadas

### Frontend
✅ Web Components con Lit
✅ Propiedades reactivas
✅ Shadow DOM con estilos encapsulados
✅ Custom Events entre componentes
✅ Manejo de estados (loading, error)
✅ Validación de formularios
✅ Diseño responsive
✅ Confirmación de eliminación
✅ Feedback visual de acciones

### Backend
✅ API REST completa
✅ Validación de datos
✅ Manejo de errores
✅ Códigos HTTP apropiados
✅ CORS habilitado
✅ Mensajes descriptivos

### Base de Datos
✅ Tabla usuarios con todos los campos requeridos
✅ Auto incremento en ID
✅ Restricciones NOT NULL

## 🧪 Pruebas

### Probar el Backend (sin frontend)
```bash
# Obtener todos los usuarios
curl http://localhost:3000/users

# Crear un usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","correo":"test@test.com","rol":"Usuario","estado":"activo"}'

# Actualizar un usuario
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Updated Name","correo":"test@test.com","rol":"Usuario","estado":"activo"}'

# Eliminar un usuario
curl -X DELETE http://localhost:3000/users/1
```

## 🐛 Solución de Problemas

### Error: "Cannot GET /users"
- Verificar que el backend esté ejecutándose en puerto 3000
- Revisar la configuración de rutas en `server.js`

### Error: "Error al conectar con la base de datos"
- Verificar que MySQL esté ejecutándose
- Comprobar credenciales en `backend/db.js`
- Verificar que la base de datos `gestion_usuarios` exista

### Error: "Failed to fetch"
- Verificar que el backend esté ejecutándose
- Revisar que CORS esté habilitado en el backend
- Comprobar la URL del API en los componentes

### Frontend no carga
- Ejecutar `npm install` en la carpeta frontend
- Verificar que Vite esté instalado correctamente
- Comprobar que el puerto 5173 esté disponible

## 📦 Build para Producción

### Backend
```bash
cd backend
# Ya está listo para producción, solo ejecutar:
node server.js
```

### Frontend
```bash
cd frontend
npm run build
# Los archivos se generarán en la carpeta dist/
```

## 👨‍💻 Autor

Proyecto Final - Desarrollo Web con Web Components y API REST

## 📄 Licencia

ISC

## 📚 Documentación Adicional

- [Lit Documentation](https://lit.dev/)
- [Express Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
