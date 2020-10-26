const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacionEmp');

let app = express();

let Servicio = require('../models/servicio');

// ============================
// Mostrar todos los servicios
// ============================
app.get('/servicio', verificaToken, (req, res) => {

    Servicio.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, servicios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                servicios
            });

        })
});

// ============================
// Mostrar un servicio por ID
// ============================
app.get('/servicio/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Servicio.findById(id, (err, servicioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!servicioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            servicio: servicioDB
        });

    });


});

// ============================
// Crear nuevo servicio
// ============================
app.post('/servicio', verificaToken, (req, res) => {
    let body = req.body;

    let servicio = new Servicio({
        nombre: body.nombre,
        usuario: req.usuario._id
    });


    servicio.save((err, servicioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!servicioDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            servicio: servicioDB
        });


    });


});

// ============================
// Editar servicio
// ============================
app.put('/servicio/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descServicio = {
        nombre: body.nombre
    };

    Servicio.findByIdAndUpdate(id, descServicio, { new: true, runValidators: true }, (err, servicioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!servicioDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            servicio: servicioDB
        });

    });


});

// ============================
// Eliminar servicio
// ============================
app.delete('/servicio/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Servicio.findByIdAndRemove(id, (err, servicioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!servicioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Servicio borrado'
        });

    });


});


module.exports = app;