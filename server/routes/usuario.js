const express = require('express');
const bcrypt = require('bcrypt');  //bcrypt sirve para encriptar la contraseña
const _ = require('underscore'); //libreria para filtar los campos que queremos actualizar y bloquear los que no.
const Usuario =  require('../models/usuario');
const app = express();



// Peticiones HTTP
app.get('/usuario', function (req, res) { // Obtener usuarios de la DB

    let desde = req.query.desde || 0; // Para hacer busqyedas por parametros. Para filtar
    desde = Number(desde);

    let porPagina = req.query.porPagina || 5; // Para hacer busqyedas por parametros. Para filtar
    porPagina = Number(porPagina);

    Usuario.find( {}, 'nombre email role estado google img' ) // Para hacer busqyedas por parametros. Para filtar los datos a mostrar poner entre apostrofes como string
    .skip(desde)
    .limit(porPagina)
    .exec( (err, usuarios) => {
        if ( err ) {
            return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Usuario.count( {}, ( err, conteo) => { // Para agregar el total de registros de la DB

                res.json({
                    ok: true,
                    usuarios,
                    registros: conteo
                });

            });
    })
});

// Para agregar usuarios a la DB
app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if ( err ) {
           return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// Para modicicar/actualizar datos de usuarios en la DB
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado'] );

    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if ( err ) {
            return res.status(400).json({
                 ok: false,
                 err
             });
         };

         res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id; // obtener el id del registro a eliminar

    let cambiaEstado = {
        estado: false
    }

   //  Usuario.findByIdAndRemove(id, ( err, usuarioBorrado ) => { // para borrar el registro fisicamente de la DB

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true }, ( err, usuarioBorrado ) => { // para borrar el registro fisicamente de la DB
        if ( err ) {
            return res.status(400).json({
                 ok: false,
                 err
             });
         };

         if ( !usuarioBorrado ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
         }

         res.json({
             ok: true,
             usuario: usuarioBorrado

         });

    });




});

// Fin peticiones

module.exports = app;

