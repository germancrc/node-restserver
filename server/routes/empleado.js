const express = require('express');
const bcrypt = require('bcrypt');  //bcrypt sirve para encriptar la contraseña
const _ = require('underscore'); //libreria para filtar los campos que queremos actualizar y bloquear los que no.
const Empleado =  require('../models/empleado');
const { verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacionEmp');
const empleado = require('../models/empleado');
const app = express();


// Peticiones HTTP
app.get('/empleado', verificaToken, (req, res) => {  //   

    let desde = req.query.desde || 0; // Para hacer busquedas por parametros. Para filtar
    desde = Number(desde);

    let limit = req.query.limit || 50; // Para hacer busquedas por parametros. Para filtar
    limit = Number(limit);

    Empleado.find( {activo: true}, 'nombre apellido email role activo img' ) // Para hacer busqyedas por parametros. Para filtar los datos a mostrar poner entre apostrofes como string
    .skip(desde)
    .limit(limit)
    .exec( (err, usuarios) => {
        if ( err ) {
            return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Empleado.countDocuments( {activo: true}, ( err, conteo) => { // Para agregar el total de registros de la DB

                res.json({
                    ok: true,
                    usuarios,
                    registros: conteo
                });

            });
    });
});

app.get('/empleado/:id', [verificaToken, verificaAdmin_Role], function (req, res) { // [verificaToken, verificaAdmin_Role],

    let id = req.params.id;

    Empleado.findById( id, (err, empleadoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empleadoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            empleado: empleadoDB
        });
    });
});

// Para agregar usuarios a la DB
app.post('/empleado', [verificaToken, verificaAdmin_Role], function (req, res) { // 
    let body = req.body;

    let empleado = new Empleado({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    empleado.save((err, empleadoDB) => {
        if ( err ) {
           return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: empleadoDB
        });
    });
});

// Para modicicar/actualizar datos de usuarios en la DB
app.put('/empleado/:id', [verificaToken, verificaAdmin_Role], function (req, res) { // [verificaToken, verificaAdmin_Role],

    let id = req.params.id;
    let body = _.pick( req.body, ['nombre', 'apellido', 'email', 'img', 'role', 'estado'] );

    Empleado.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, empleadoDB) => {

        if ( err ) {
            return res.status(400).json({
                 ok: false,
                 err
             });
         };

         res.json({
            ok: true,
            usuario: empleadoDB,
            message: 'Usuario actualizado'
        });
    });
});

app.delete('/empleado/:id', [verificaToken, verificaAdmin_Role], function (req, res) { // [verificaToken, verificaAdmin_Role], 

    let id = req.params.id; // obtener el id del registro a eliminar o desactivar

    let cambiaEstado = { // para desactivar el registro
        activo: false
    }

   //  Usuario.findByIdAndRemove(id, ( err, usuarioBorrado ) => { // para borrar el registro fisicamente de la DB

    Empleado.findByIdAndUpdate(id, cambiaEstado, {new: true }, ( err, empleadoBorrado ) => { // para borrar el registro fisicamente de la DB
        if ( err ) {
            return res.status(400).json({
                 ok: false,
                 err: {
                    message: 'Usuario no existe'
                 }
             });
         };

         if ( !empleadoBorrado ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
         }

         res.json({
             ok: true,
             usuario: empleadoBorrado,
         });

    });




});

// Fin peticiones

module.exports = app;

