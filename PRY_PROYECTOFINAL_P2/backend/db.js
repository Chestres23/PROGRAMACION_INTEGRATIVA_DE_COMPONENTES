const mysql = require('mysql2');

// Configuración para UniServer Zero XV
const db = mysql.createConnection({
    host: '127.0.0.1',      // o 'localhost'
    user: 'root',
    password: 'admin',      // Contraseña de UniServer
    database: 'gestion_usuarios',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        console.error('Verifica:');
        console.error('   - UniServer está ejecutándose');
        console.error('   - La contraseña es "admin" (UniServer por defecto)');
        console.error('   - La base de datos "gestion_usuarios" existe');
        throw err;
    }
    console.log('Conectado a la base de datos MySQL (UniServer)');
});

module.exports = db;
