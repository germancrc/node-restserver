require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());


const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// Configiracion de rutas ver index.js
app.use(require('./routes/index'));


// para conectar la base de datos a node
mongoose.connect(process.env.URLDB, 
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            ( err, res ) => {

  if ( err ) throw err;

  console.log('Database ONLINE');
});


// Listening
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});