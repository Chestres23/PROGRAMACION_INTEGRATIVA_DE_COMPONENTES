-- ============================================
-- Script SQL: Base de Datos Gestión de Usuarios + Productos
-- ============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestion_usuarios;
USE gestion_usuarios;

-- Eliminar tablas si existen (para actualización limpia)
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

-- Crear la tabla de usuarios CON CONTRASEÑA
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de productos (para el sistema completo)
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50),
    imagen_url VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios de ejemplo CON CONTRASEÑAS
-- NOTA: En producción usar bcrypt, aquí usamos texto plano para simplicidad
INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES
    ('Admin Principal', 'admin@tienda.com', 'admin123', 'Administrador', 'activo'),
    ('Usuario Demo', 'usuario@tienda.com', 'user123', 'Usuario', 'activo'),
    ('Invitado Demo', 'invitado@tienda.com', 'guest123', 'Invitado', 'activo'),
    ('Ana Martínez', 'ana@tienda.com', 'ana123', 'Usuario', 'activo');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen_url, estado) VALUES
    ('Laptop HP', 'Laptop HP Core i5, 8GB RAM, 256GB SSD', 899.99, 15, 'Electrónica', 'https://via.placeholder.com/200', 'activo'),
    ('Mouse Logitech', 'Mouse inalámbrico ergonómico', 29.99, 50, 'Accesorios', 'https://via.placeholder.com/200', 'activo'),
    ('Teclado Mecánico', 'Teclado mecánico RGB', 79.99, 30, 'Accesorios', 'https://via.placeholder.com/200', 'activo'),
    ('Monitor Samsung 24"', 'Monitor Full HD 24 pulgadas', 199.99, 20, 'Electrónica', 'https://via.placeholder.com/200', 'activo'),
    ('Auriculares Sony', 'Auriculares con cancelación de ruido', 149.99, 25, 'Audio', 'https://via.placeholder.com/200', 'activo');

-- Consulta para verificar los datos
SELECT 'Usuarios:' as Tabla;
SELECT id, nombre, correo, rol, estado FROM usuarios;

SELECT 'Productos:' as Tabla;
SELECT id, nombre, precio, stock, categoria FROM productos;

-- ============================================
-- CREDENCIALES DE PRUEBA:
-- 
-- ADMINISTRADOR:
--   Email: admin@tienda.com
--   Password: admin123
--   Puede: Gestionar usuarios y productos
-- 
-- USUARIO:
--   Email: usuario@tienda.com
--   Password: user123
--   Puede: Gestionar productos
-- 
-- INVITADO:
--   Email: invitado@tienda.com
--   Password: guest123
--   Puede: Solo ver Home y Contacto
-- ============================================
