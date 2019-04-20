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
let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;
process.env.URLDB = urlDB;


// =========================
// Vencimiento del Token
// =========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =========================
// SEED de autenticación
// =========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =========================
// Google Client ID
// =========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '343877995921-v1idevcr7dk5298blfjvsdh8jrc20fho.apps.googleusercontent.com';