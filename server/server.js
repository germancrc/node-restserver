require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

 
// Peticiones HTTP
app.get('/usuario', function (req, res) {
  res.json('Usuario obtenido')
});

app.post('/usuario', function (req, res) {
    let body = req.body;

    if ( body.nombre === undefined ) {
        res.status(400).json({
            ok: false,
            mensaje: 'Es necesario poner el nombre'
        });
    } else {
        res.json({
            usuario: body
        });
    }

});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function (req, res) {
    res.json('Usuario Borrado')
});
 

// Listening
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});