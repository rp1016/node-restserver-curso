const express = require('express');
const app = express();

// importacion del usuario
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;