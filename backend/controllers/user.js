// Besoin de notre model User car on va enregistrer et lire des Users dans ses middlewares.
//j'importe le package de cryptage bcrypt pour hasher mot de passe
const bcrypt = require('bcrypt');

//j'importe crypto-js pour crypter l'adresse mail 
const cryptojs = require('crypto-js');

//j'importe le package pour créer et vérifier des tokens
const jwt = require('jsonwebtoken');

//j'importe le model User
const User = require('../models/user');

//enregistrement de nouveaux utilisateurs -- middleware avec fonction signup
exports.signup = (req, res, next) => {

    //chiffrer l'email dans la base de donnée 
    const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, "CLE_SECRETE").toString();

    //je crypte le mot de passe avec hash, 10 tours
    bcrypt.hash(req.body.password, 10)
        //je recupère le hash, l'enregistre dans un nouvel utilisateur et j'enregistre le hash en mot de passe
        .then(hash => {
            const user = new User({
                email: emailCryptoJs,
                password: hash
            });
            //j'enregistre le user dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Connexion d'utilisateur existant -- middleware avec fonction login
exports.login = (req, res, next) => {

    //chiffrer l'email dans la base de donnée 
    const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, "CLE_SECRETE").toString();

    //Je récupère l'utilisateur de la base de données
    User.findOne({ email: emailCryptoJs })
        .then(user => {
            //si email pas bon = pas de user
            if (!user) {
                //non autorisé
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            //si user, on compare le mot de passe envoyer par l'utilisateur qui veut se connecter avec le hash du user dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //si comparaison pas bonne
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //si comparaison est bonne, j'utilise la fonction sign pour encoder un nouveau token qui contient un payload (données encodées dans le token) grâce à une clé secrète temporaire, config expiration)
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};