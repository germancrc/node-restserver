const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let serviciosValidos = {
    values: ['CASA', 'PISO', 'REPARACION'],
    message: '{VALUE} no es un rol valido'
};

let servicioSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'Debe poner nombre al servicio'],
        enum: serviciosValidos 
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
    activo: {
        type: Boolean,
        default: true,
        required: false
    },
    timestamps: { 
        createdAt: '',
        updatedAt: '' 
    }
});


module.exports = mongoose.model('Servicio', servicioSchema);