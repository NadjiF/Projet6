
const express = require('express');

// application expess
const app = express();

// Helmet protège l'application de certaines vulnérabilités du Web 
// en configurant de manière appropriée des en-têtes HTTP
const helmet = require('helmet');

// Module dotenv pour les informations sensibles de l'application
require('dotenv').config();

const mongoose = require('mongoose');

// Import qui nous donnes accès au chemin de notre système de fichier
const path = require('path');

// Import du Middleware Limiter de requête
const rateLimit = require('./middleware/limiter');

// Import du routeur (sauce)
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user'); 




// Connection de l'API au cluster MongoDB
mongoose.connect(process.env.SECRET_DB,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

app.use(rateLimit);
//affichage des images(url) 
app.use(helmet({
  crossOriginResourcePolicy: false
}));



//Gestion des erreurs CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

//Express gère la ressource images de manière statique (un sous-répertoire de notre 
// répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images 
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement de nos routeurs pour toutes les demandes effectuées vers :
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Export de app.js pour pouvoir s'en servir dans nos autres fichiers
module.exports = app;