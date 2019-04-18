const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');



//mTnNGqWOvsGW6UDs
//strider
//mongodb+srv://strider:<password>@cluster0-a9pk1.mongodb.net/test
// Petición de tipo GET
app.get("/usuario", verificaToken, (req, res) => {



    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre  email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios
                });
            });

        })

});


// Petición de tipo POST
app.post("/usuario", [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;



    // utilizar modelo para grabar en la base de datos

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            message: 'bad request, name is required.'
        });

    } else {

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        // grabado en base de datos
        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.status(201).json({
                ok: true,
                usuario: usuarioDB
            });
        });


    }


});


// Petición de tipo PUT
app.put("/usuario/:id", [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});



// Petición de tipo DELETE
app.delete("/usuario/:id", [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });





});

//exportar la libreria
module.exports = app;