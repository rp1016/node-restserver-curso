require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//parse application
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Petición de tipo GET
app.get("/usuario", function(req, res) {
    res.json("GET usuario");
});


// Petición de tipo GET
app.post("/usuario/:id", function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            message: 'bad request, name is required.'
        });

    } else {
        res.status(200).json({
            body: body

        });
    }


});


// Petición de tipo PUT
app.put("/usuario/:id", function(req, res) {
    let id = req.params.id;

    res.json({
        id: id,
        description: 'operacion PUT'
    });
});



// Petición de tipo DELETE
app.delete("/usuario", function(req, res) {
    res.json("delete usuario");
});





app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", 3000);
});