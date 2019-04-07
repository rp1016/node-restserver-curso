// =========================
// Puerto
// =========================
process.env.PORT = process.env.PORT || 3000;

// =========================
// Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================
// Base de datos
// =========================
let user = 'strider';
let password = 'mTnNGqWOvsGW6UDs';
let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb + srv: //strider:' + password + '@cluster0-a9pk1.mongodb.net/test';
process.env.URLDB = urlDB;