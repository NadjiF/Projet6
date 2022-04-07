const express = require ('express');

const mongoose = require('mongoose')

require('dotenv').config();

const app = express();

//connection au cloud mongoose
mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;