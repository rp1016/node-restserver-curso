require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

//parse application
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// habilitar la carpeta public para ser accedida 
app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname, '../public'));

// configuración global de rutas.
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", 3000);
});