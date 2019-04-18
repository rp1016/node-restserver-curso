const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {

    // obtener el body --> email y password
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        // manejo del error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // verificar si no viene usuario de base de datos
        if (!usuarioDB) {
            return res.status(403).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        // evaluar la contraseña 
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(403).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });

    });

});














//exportar la libreria
module.exports = app;