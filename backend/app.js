const express = require ('express');

const mongoose = require('mongoose');

const helmet = require ('helmet');

const path = require ('path');

require('dotenv').config();

//const userRoutes = ('./routes/user')
//const sauceRoutes = ('./routes/sauce')


const app = express();
app.use(express());

//connection au cloud mongoose
mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const rateLimit = require("express-rate-limit");

// L'utilisateur pourra faire 100 requêtes toutes les 20 minutes
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 100,
});
app.use(limiter);
  app.use(helmet({
    crossOriginRessourcePolicy : false

  }));
 
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//
  app.use(express.json());
  app.use('/images',express.static(path.join(__dirname,'images')));
  //
//app.use('/api/sauces',sauceRoutes)
//app.use('./auth', userRoutes)
module.exports = app;