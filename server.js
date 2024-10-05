app.post('/guardarProfesor', (req, res) => {
    const { nombre, puntaje } = req.body;

    // Verificar si el profesor ya existe
    const query = 'SELECT * FROM profesores WHERE nombre = ?';
    connection.execute(query, [nombre], (err, results) => {
        if (err) {
            console.error('Error en la consulta SELECT:', err); // Imprimir el error
            return res.status(500).json({ mensaje: 'Error en la consulta.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'El profesor ya existe.' });
        } else {
            // Insertar el nuevo profesor
            const insertQuery = 'INSERT INTO profesores (nombre, puntaje) VALUES (?, ?)';
            connection.execute(insertQuery, [nombre, puntaje], (err) => {
                if (err) {
                    console.error('Error en la consulta INSERT:', err); // Imprimir el error
                    return res.status(500).json({ mensaje: 'Error al guardar los datos.' });
                }
                return res.status(200).json({ mensaje: 'Datos guardados exitosamente.' });
            });
        }
    });
});
