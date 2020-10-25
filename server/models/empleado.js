
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { object } = require('underscore');

let rolesValidos = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let empleadoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    role: {
        type: String,
        default: 'USER',
        enum: rolesValidos
    },
    img: {
        type: String,
        required: false
    },
    activo: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

// Para no retornar datos de la contraseña al usuario.
empleadoSchema.methods.toJSON =  function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

empleadoSchema.plugin( uniqueValidator , { message: '{PATH} ya está en uso' })

module.exports = mongoose.model('Empleado', empleadoSchema);

