const express = require('express');
const bcrypt = require('bcrypt');  //bcrypt sirve para encriptar la contraseña
const jwt = require('jsonwebtoken');
const Empleado =  require('../models/empleado');
const app = express();


app.post('/loginEmp', (req, res) => {

    let body = req.body;

    Empleado.findOne( { email: body.email}, (err, empleadoDB) => {
        
        if ( err ) {
            return res.status(500).json({
                 ok: false,
                 err
             });
         }

        if ( !empleadoDB ) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if ( !bcrypt.compareSync( body.password, empleadoDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o ontraseña incorrectos'
                }
            });
        } 

        let token = jwt.sign({
            usuario: empleadoDB
        },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN}); //variable expiracion en config.js

        res.json({
            ok: true,
            usuario: empleadoDB,
            token
        });

    });

});


module.exports = app;