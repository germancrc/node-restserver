const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let servicioSchema = new Schema({
    nombre: { 
        type: String, 
        unique: true, 
        required: [true, 'Debe poner nombre al servicio'] 
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' }
});


module.exports = mongoose.model('Servicio', servicioSchema);