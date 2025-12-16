/**
 * Rutas API REST para Gestión de Usuarios
 * 
 * Implementa las 5 operaciones CRUD requeridas:
 * - GET    /users      - Listar todos los usuarios
 * - GET    /users/:id  - Obtener un usuario específico
 * - POST   /users      - Crear nuevo usuario
 * - PUT    /users/:id  - Actualizar usuario existente
 * - DELETE /users/:id  - Eliminar usuario
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// Calcula el menor id disponible para mantener secuencia sin saltos
function getNextAvailableId(rows) {
    let next = 1;
    for (const row of rows) {
        if (row.id === next) {
            next += 1;
        } else {
            break;
        }
    }
    return next;
}

/**
 * GET /users
 * Obtiene todos los usuarios de la base de datos
 * Responde con un array JSON de usuarios
 */
router.get('/', (req, res) => {
    db.query('SELECT id, nombre, correo, rol, estado, fecha_creacion, fecha_actualizacion FROM usuarios', (err, result) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ 
                error: 'Error al obtener usuarios',
                details: err.message 
            });
        }
        res.json(result);
    });
});

/**
 * GET /users/:id
 * Obtiene un usuario específico por su ID
 * Responde con un objeto JSON del usuario o 404 si no existe
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT id, nombre, correo, rol, estado, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            return res.status(500).json({ 
                error: 'Error al obtener usuario',
                details: err.message 
            });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }
        
        res.json(result[0]);
    });
});

/**
 * POST /users
 * Crea un nuevo usuario en la base de datos
 * Requiere: nombre, correo, rol, estado en el body
 * Responde con mensaje de éxito y el ID del nuevo usuario
 */
router.post('/', (req, res) => {
    const { nombre, correo, rol, estado, password } = req.body;
    
    // Validación de campos requeridos
    if (!nombre || !correo || !rol || !estado || !password) {
        return res.status(400).json({ 
            error: 'Todos los campos son requeridos (nombre, correo, password, rol, estado)' 
        });
    }
    
    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ 
            error: 'El formato del correo electrónico no es válido' 
        });
    }
    
    // Validación de longitud de nombre
    if (nombre.trim().length < 3) {
        return res.status(400).json({ 
            error: 'El nombre debe tener al menos 3 caracteres' 
        });
    }
    
    // Validación de rol válido
    const rolesValidos = ['Administrador', 'Usuario'];
    if (!rolesValidos.includes(rol)) {
        return res.status(400).json({ 
            error: 'El rol debe ser: Administrador o Usuario' 
        });
    }
    
    // Validación de estado válido
    const estadosValidos = ['activo', 'inactivo'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ 
            error: 'El estado debe ser: activo o inactivo' 
        });
    }
    
    // Obtener ids existentes ordenados para encontrar el menor id libre
    db.query('SELECT id FROM usuarios ORDER BY id', (errIds, rows) => {
        if (errIds) {
            console.error('Error al preparar creación de usuario:', errIds);
            return res.status(500).json({ error: 'Error al preparar creación de usuario' });
        }

        const nextId = getNextAvailableId(rows);
        const hashedPassword = bcrypt.hashSync(password, 10);

        db.query(
            'INSERT INTO usuarios (id, nombre, correo, password, rol, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [nextId, nombre.trim(), correo.toLowerCase().trim(), hashedPassword, rol, estado],
            (err, result) => {
                if (err) {
                    console.error('Error al crear usuario:', err);
                    
                    // Error de correo duplicado
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ 
                            error: 'Ya existe un usuario con ese correo electrónico' 
                        });
                    }
                    
                    return res.status(500).json({ 
                        error: 'Error al crear usuario',
                        details: err.message 
                    });
                }

                // Ajustar el AUTO_INCREMENT al siguiente número disponible más alto
                const maxExisting = rows.length ? rows[rows.length - 1].id : 0;
                const nextAuto = Math.max(maxExisting, nextId) + 1;
                db.query('ALTER TABLE usuarios AUTO_INCREMENT = ?', [nextAuto], () => {});

                res.status(201).json({ 
                    message: 'Usuario creado exitosamente',
                    id: nextId
                });
            }
        );
    });
});

/**
 * PUT /users/:id
 * Actualiza un usuario existente
 * Requiere: nombre, correo, rol, estado en el body
 * Responde con mensaje de éxito o 404 si no existe
 */
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, estado, password } = req.body;
    
    // Validación de campos requeridos
    if (!nombre || !correo || !rol || !estado) {
        return res.status(400).json({ 
            error: 'Todos los campos son requeridos (nombre, correo, rol, estado)' 
        });
    }
    
    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ 
            error: 'El formato del correo electrónico no es válido' 
        });
    }
    
    // Validación de longitud de nombre
    if (nombre.trim().length < 3) {
        return res.status(400).json({ 
            error: 'El nombre debe tener al menos 3 caracteres' 
        });
    }
    
    // Validación de rol válido
    const rolesValidos = ['Administrador', 'Usuario'];
    if (!rolesValidos.includes(rol)) {
        return res.status(400).json({ 
            error: 'El rol debe ser: Administrador o Usuario' 
        });
    }
    
    // Validación de estado válido
    const estadosValidos = ['activo', 'inactivo'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ 
            error: 'El estado debe ser: activo o inactivo' 
        });
    }
    
    const updates = [nombre.trim(), correo.toLowerCase().trim(), rol, estado];
    let sql = 'UPDATE usuarios SET nombre=?, correo=?, rol=?, estado=?';
    if (password && String(password).length > 0) {
        const hashedPassword = bcrypt.hashSync(String(password), 10);
        sql += ', password=?';
        updates.push(hashedPassword);
    }
    sql += ' WHERE id=?';
    updates.push(id);
    db.query(
        sql,
        updates,
        (err, result) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                
                // Error de correo duplicado
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ 
                        error: 'Ya existe otro usuario con ese correo electrónico' 
                    });
                }
                
                return res.status(500).json({ 
                    error: 'Error al actualizar usuario',
                    details: err.message 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            
            res.json({ 
                message: 'Usuario actualizado exitosamente' 
            });
        }
    );
});

/**
 * DELETE /users/:id
 * Elimina un usuario de la base de datos
 * Responde con mensaje de éxito o 404 si no existe
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    db.query(
        'DELETE FROM usuarios WHERE id=?',
        [id],
        (err, result) => {
            if (err) {
                console.error('Error al eliminar usuario:', err);
                return res.status(500).json({ 
                    error: 'Error al eliminar usuario',
                    details: err.message 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            
            res.json({ 
                message: 'Usuario eliminado exitosamente' 
            });
        }
    );
});

module.exports = router;
