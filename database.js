// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Configurar conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GhostPlay'
});

connection.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Rutas CRUD de usuarios
app.post('/usuarios', (req, res) => {
    const { nombre, email, password } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [nombre, email, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario creado', id: result.insertId });
    });
});

app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(result[0]);
    });
});

app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    const sql = 'UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?';
    connection.query(sql, [nombre, email, password, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario actualizado' });
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario eliminado' });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

