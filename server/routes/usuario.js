const express = require('express');
const bcrypt = require('bcrypt');  //bcrypt sirve para encriptar la contraseña
const _ = require('underscore'); //libreria para filtar los campos que queremos actualizar y bloquear los que no.
const Usuario =  require('../models/usuario');
const { verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');
const app = express();


// Peticiones HTTP
app.get('/usuario', verificaToken,  (req, res) => { 

    let desde = req.query.desde || 0; // Para hacer busquedas por parametros. Para filtar
    desde = Number(desde);

    let limit = req.query.limit || 5; // Para hacer busquedas por parametros. Para filtar
    limit = Number(limit);

    Usuario.find( {activo: true}, 'nombre apellido cedula direccion numero sector provincia telefono email img google activo' ) // Para hacer busqyedas por parametros. Para filtar los datos a mostrar poner entre apostrofes como string
    .skip(desde)
    .limit(limit)
    .exec( (err, solicitantes) => {
        if ( err ) {
            return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Usuario.countDocuments( {activo: true}, ( err, conteo) => { // Para agregar el total de registros de la DB

                res.json({
                    ok: true,
                    solicitantes,
                    registros: conteo
                });

            });
    });
});


// Para agregar usuarios a la DB
app.post('/usuario', verificaToken, function (req, res) { // verificaToken,
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        cedula: body.cedula,
        direccion: body.direccion,
        numero: body.numero,
        sector: body.sector,
        provincia: body.provincia,
        telefono: body.telefono,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        google: body.google,
        activo: body.activo,
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
app.put('/usuario/:id', verificaToken, function (req, res) { // verificaToken,

    let id = req.params.id;
    let body = _.pick( req.body, ['nombre', 'apellido', 'cedula', 'direccion',
    'numero', 'sector', 'provincia', 'telefono', 'email', 'img', 'estado'] );

    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if ( err ) {
            return res.status(400).json({
                 ok: false,
                 err
             });
         };

         res.json({
            ok: true,
            usuario: usuarioDB,
            message: 'Usuario actualizado'
        });
    });
});

app.delete('/usuario/:id', verificaToken, function (req, res) { // verificaToken, 

    let id = req.params.id; // obtener el id del registro a eliminar o desactivar

    let cambiaEstado = { // para desactivar el registro
        estado: false
    }

   //  Usuario.findByIdAndRemove(id, ( err, usuarioBorrado ) => { // para borrar el registro fisicamente de la DB

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true }, ( err, usuarioBorrado ) => { // para borrar el registro fisicamente de la DB
        if ( err ) {
            return res.status(400).json({
                 ok: false,
                 err: {
                    message: 'Usuario no existe'
                 }
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
             usuario: usuarioBorrado,
         });

    });

});

// Fin peticiones

module.exports = app;

