/**
 * Rutas API REST para Gestión de Productos
 */
const express = require('express');
const router = express.Router();
const db = require('../db');

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
 * GET /productos
 * Obtiene todos los productos
 */
router.get('/', (req, res) => {
    db.query('SELECT * FROM productos ORDER BY fecha_creacion DESC', (err, result) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(result);
    });
});

/**
 * GET /productos/:id
 * Obtiene un producto específico
 */
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener producto' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result[0]);
    });
});

/**
 * POST /productos
 * Crea un nuevo producto
 */
router.post('/', (req, res) => {
    const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;
    
    if (!nombre || !precio || !stock) {
        return res.status(400).json({ error: 'Nombre, precio y stock son requeridos' });
    }

    // Obtener ids existentes ordenados para encontrar el menor id libre
    db.query('SELECT id FROM productos ORDER BY id', (errIds, rows) => {
        if (errIds) {
            console.error('Error al preparar creación de producto:', errIds);
            return res.status(500).json({ error: 'Error al preparar creación de producto' });
        }

        const nextId = getNextAvailableId(rows);

        db.query(
            'INSERT INTO productos (id, nombre, descripcion, precio, stock, categoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nextId, nombre, descripcion || '', precio, stock, categoria || 'General', imagen_url || 'https://via.placeholder.com/200'],
            (err, result) => {
                if (err) {
                    console.error('Error al crear producto:', err);
                    return res.status(500).json({ error: 'Error al crear producto' });
                }

                // Ajustar el AUTO_INCREMENT al siguiente número disponible más alto
                const maxExisting = rows.length ? rows[rows.length - 1].id : 0;
                const nextAuto = Math.max(maxExisting, nextId) + 1;
                db.query('ALTER TABLE productos AUTO_INCREMENT = ?', [nextAuto], () => {});

                res.status(201).json({ 
                    message: 'Producto creado exitosamente',
                    id: nextId 
                });
            }
        );
    });
});

/**
 * PUT /productos/:id
 * Actualiza un producto
 */
router.put('/:id', (req, res) => {
    const { nombre, descripcion, precio, stock, categoria, imagen_url, estado } = req.body;
    
    db.query(
        'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen_url=?, estado=? WHERE id=?',
        [nombre, descripcion, precio, stock, categoria, imagen_url, estado || 'activo', req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar producto' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({ message: 'Producto actualizado exitosamente' });
        }
    );
});

/**
 * DELETE /productos/:id
 * Elimina un producto
 */
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM productos WHERE id=?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    });
});

module.exports = router;
