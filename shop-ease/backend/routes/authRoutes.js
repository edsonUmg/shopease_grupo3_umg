// src/routes/authRoutes.js (o en la raíz de tu proyecto)
const express = require('express');
const router = express.Router();

// Ruta para verificar disponibilidad de username
router.post('/check-username', (req, res) => {
    const { username } = req.body;
    // Aquí debes consultar tu base de datos (MongoDB, MySQL, etc.)
    // Ejemplo simulado:
    const usernameExists = false; // Cambia esto por tu lógica real
    res.json({ available: !usernameExists });
});

module.exports = router;