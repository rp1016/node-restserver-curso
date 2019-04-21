const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ==================================
// Obtener todos los productos
// ==================================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // poopulate: usarios categoria.
    // paginado.


    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos: productos
            })
        })



});

// ==================================
// Obtener un producto por ID
// ==================================
app.get('/producto/:id', (req, res) => {
    // poopulate: usarios categoria.

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }


            res.json({
                ok: true,
                producto: productoDB
            });







        });



});

// ==================================
// Buscar un producto 
// ==================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regExp = new RegExp(termino, 'i');

    Producto.find({ nombre: regExp })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productos
            });

        });

});



// ==================================
// Crear un producto 
// ==================================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria
    // grabar el producto

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        res.status(201).json({
            ok: true,
            product: productoDB
        });




    });





});


// ==================================
// Actualizar un producto 
// ==================================
app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria
    // grabar el producto

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });



    });




});

// ==================================
// Borrar un producto 
// ==================================
app.delete('/producto/:id', verificaToken, (req, res) => {


    // borrado logico. cambiar flag disponible a false.
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            });

        });




    });



});




module.exports = app;