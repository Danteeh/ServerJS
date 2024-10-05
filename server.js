const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 15609;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'junction.proxy.rlwy.net', // URL del host de tu base de datos
    user: 'root',                     // Tu nombre de usuario
    password: 'HYtPRtNPmXrSjnCtfNThLIwXQoWdswda', // Tu contraseña
    database: 'railway',              // El nombre de tu base de datos
    port: 15609                        // El puerto de conexión
});


// Probar la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para guardar el profesor
app.post('/guardarProfesor', (req, res) => {
    const { nombre, puntaje } = req.body;

    // Verificar si el profesor ya existe
    const query = 'SELECT * FROM profesores WHERE nombre = ?';
    connection.execute(query, [nombre], (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error en la consulta.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'El profesor ya existe.' });
        } else {
            // Insertar el nuevo profesor
            const insertQuery = 'INSERT INTO profesores (nombre, puntaje) VALUES (?, ?)';
            connection.execute(insertQuery, [nombre, puntaje], (err) => {
                if (err) {
                    return res.status(500).json({ mensaje: 'Error al guardar los datos.' });
                }
                return res.status(200).json({ mensaje: 'Datos guardados exitosamente.' });
            });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
