const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };

}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // Verificar que usuario no tenga ese mismo correo. 
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        // manejo del error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            // si existe
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su atenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token
                });

            }

        } else {

            // usuario de base de datos no EXISTE, primera vez que el usuario está usando sus 
            // credenciales en la applicacion. 
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':-)';

            // grabar
            usuario.save((err, usuarioDB) => {
                // manejo del error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }



                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token
                });

            });
        }

    });

});


//exportar la libreria
module.exports = app;