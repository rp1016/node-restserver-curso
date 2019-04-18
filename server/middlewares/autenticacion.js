const jwt = require('jsonwebtoken');


// ================
// Verificar Token
// ================

let verificaToken = (req, res, next) => {

    // primero leer el header personalizado de token. 
    let token = req.get('token'); // Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            });
        }

        req.usuario = decoded.usuario;
        next();


    });

};

// ================
// Verifica AdminRole
// ================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};



module.exports = {
    verificaToken,
    verificaAdmin_Role
};