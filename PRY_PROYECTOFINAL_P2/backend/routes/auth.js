/**
 * Rutas de Autenticación
 * Login y validación de credenciales
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

/**
 * POST /auth/login
 * Autentica un usuario con correo y contraseña
 */
router.post('/login', (req, res) => {
    const { correo, password } = req.body;
    
    // Validación de campos
    if (!correo || !password) {
        return res.status(400).json({ 
            error: 'Correo y contraseña son requeridos' 
        });
    }
    
    // Buscar usuario por correo
    db.query(
        'SELECT id, nombre, correo, rol, estado, password FROM usuarios WHERE correo = ?',
        [correo.toLowerCase().trim()],
        (err, result) => {
            if (err) {
                console.error('Error en login:', err);
                return res.status(500).json({ 
                    error: 'Error en el servidor' 
                });
            }
            
            // Usuario no encontrado
            if (result.length === 0) {
                return res.status(401).json({ 
                    error: 'Credenciales incorrectas' 
                });
            }
            
            const usuario = result[0];
            
            // Verificar si el usuario está activo
            if (usuario.estado !== 'activo') {
                return res.status(403).json({ 
                    error: 'Usuario inactivo. Contacte al administrador.' 
                });
            }
            
            const storedPassword = usuario.password || '';
            const isBcryptHash = typeof storedPassword === 'string' && storedPassword.startsWith('$2');
            // Permite validar tanto contraseñas hasheadas como texto plano heredado
            const passwordOk = isBcryptHash 
                ? bcrypt.compareSync(password, storedPassword) 
                : storedPassword === password;
            if (!passwordOk) {
                return res.status(401).json({ 
                    error: 'Credenciales incorrectas' 
                });
            }
            
            // Login exitoso - NO enviar password al cliente
            delete usuario.password;
            
            res.json({
                message: 'Login exitoso',
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            });
        }
    );
});

/**
 * POST /auth/verificar
 * Verifica si un usuario está autenticado (usando datos del localStorage)
 */
router.post('/verificar', (req, res) => {
    const { correo } = req.body;
    
    if (!correo) {
        return res.status(400).json({ error: 'Correo requerido' });
    }
    
    db.query(
        'SELECT id, nombre, correo, rol, estado FROM usuarios WHERE correo = ?',
        [correo],
        (err, result) => {
            if (err || result.length === 0) {
                return res.status(401).json({ error: 'Sesión inválida' });
            }
            
            const usuario = result[0];
            
            if (usuario.estado !== 'activo') {
                return res.status(403).json({ error: 'Usuario inactivo' });
            }
            
            res.json({ usuario });
        }
    );
});

module.exports = router;
