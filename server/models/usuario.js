
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    cedula: {
        type: String,
        unique: true,
        required: [true, 'La cedula es necesaria']
    },
    direccion: {
        type: String,
        required: [true, 'Debe escribir su direccion']
    },
    numero: {
        type: String,
        required: [true, 'Falta numero de la casa / apto']
    },
    sector: {
        type: String,
        required: [true, 'Falta el sector']
    },
    provincia: {
        type: String,
        required: [true, 'Provincia']
    },
    telefono: {
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
    img: {
        type: String,
        required: false
    },
    activo: {
        type: Boolean,
        default: true,
        required: false
    },
    google: {
        type: Boolean,
        default: false,
        required: false
    },
    servicio: {
        type: String,
        required: false
    } 
});

// Para no retornar datos de la contraseña al usuario.
usuarioSchema.methods.toJSON =  function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

usuarioSchema.plugin( uniqueValidator , { message: '{PATH} ya está en uso' })

module.exports = mongoose.model('Usuario', usuarioSchema);

