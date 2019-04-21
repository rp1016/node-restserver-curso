const express = require('express');
const fileupload = require('express-fileupload');
const app = express();

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");

//default options
app.use(fileupload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) === -1) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son: ' + tiposValidos.join(' , '),
                tipo: tipo
            }
        });
    }

    let archivo = req.files.archivo;

    // validar extension permitida
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    if (extensionesValidas.indexOf(extension) === -1) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    archivo.mv('../uploads/' + tipo + '/' + nombreArchivo, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        // aqui la imagen se cargo. 
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {

            imagenProducto(id, res, nombreArchivo);
        }




    });

    function imagenUsuario(id, res, nombreArchivo) {

        Usuario.findById(id, (err, usuarioDB) => {

            if (err) {
                borraArchivo(nombreArchivo, usuarios);
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            if (!usuarioDB) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err: { message: 'el usuario no existe' }
                });
            }
            borraArchivo(usuarioDB.img, 'usuarios');


            usuarioDB.img = nombreArchivo;



            usuarioDB.save((err, usuarioGuardado) => {
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombreArchivo
                });
            });


        })


    }

    function imagenProducto(id, res, nombreArchivo) {

        Producto.findById(id, (err, productoDB) => {

            if (err) {
                borraArchivo(nombreArchivo, 'productos');
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            if (!productoDB) {
                borraArchivo(nombreArchivo, 'productos');
                return res.status(500).json({
                    ok: false,
                    err: { message: 'el producto no existe' }
                });
            }
            borraArchivo(productoDB.img, 'productos');


            productoDB.img = nombreArchivo;



            productoDB.save((err, productoGuardado) => {
                res.json({
                    ok: true,
                    usuario: productoGuardado,
                    img: nombreArchivo
                });
            });


        })
    }

    function borraArchivo(nombreImagen, tipo) {
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen}`);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }

    }





});

module.exports = app;