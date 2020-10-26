const express = require('express');
const app = express();

// rutas usuario
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./servicio'));
// app.use(require('./producto'));

// rutas empleados
app.use(require('./loginEmp'));
app.use(require('./empleado'));
 // app.use(require('./buscar/empleado'));


module.exports = app;