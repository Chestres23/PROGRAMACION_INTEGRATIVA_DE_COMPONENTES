const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/productos', require('./routes/productos'));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'API REST de Gestión de Usuarios y Productos',
        version: '2.0.0',
        endpoints: {
            auth: {
                'POST /auth/login': 'Iniciar sesión',
                'POST /auth/verificar': 'Verificar sesión'
            },
            users: {
                'GET /users': 'Obtener todos los usuarios',
                'GET /users/:id': 'Obtener un usuario específico',
                'POST /users': 'Crear un nuevo usuario',
                'PUT /users/:id': 'Actualizar un usuario',
                'DELETE /users/:id': 'Eliminar un usuario'
            },
            productos: {
                'GET /productos': 'Obtener todos los productos',
                'GET /productos/:id': 'Obtener un producto específico',
                'POST /productos': 'Crear un nuevo producto',
                'PUT /productos/:id': 'Actualizar un producto',
                'DELETE /productos/:id': 'Eliminar un producto'
            }
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('===========================================');
    console.log('Servidor iniciado exitosamente');
    console.log(`API REST ejecutándose en http://localhost:${PORT}`);
    console.log('===========================================');
});
