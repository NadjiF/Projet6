//bcrypt hashe le mot de passe
const bcrypt = require('bcrypt');

//crypto-js crypte l'adresse mail 
const cryptojs = require('crypto-js');

//crée et vérifie des tokens
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//function signup (création de compte)
exports.signup = (req, res, next) => {
    //chiffrer l'email dans la base de donnée 
    const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, "CLE_SECRETE").toString();

    // crypte le mot de passe hash, 10 tours
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({ 
                email: emailCryptoJs,
                password: hash
            });
            //user dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//function login (connexion d'un compte déja crée)
exports.login = (req, res, next) => {

    //chiffrer l'email dans la base de donnée 
    const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, "CLE_SECRETE").toString();

    //récupèration l'utilisateur de la base de données
    User.findOne({ email: emailCryptoJs })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
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