const passwordValidator = require('password-validator');

//schéma validation pour le mot de passe
const passwordSchema = new passwordValidator();

// ajout des propriété 
passwordSchema
    .is().min(8) // Longueur minimale de 8 caractères
    .is().max(40) // Longueur maximale de 40 caractères
    .has().uppercase() // Doit contenir au moins une lettre en majuscule
    .has().lowercase() // Doit contenir au moins une lettre en majuscule
    .has().digits(2) // Doit contenir au moins deux chiffres
    .has().not().spaces() // Ne doit pas contenir d'espace
    .is().not().oneOf(['Passw0rd', 'Password123']); //N'est pas l'un de ces mots de passe

//Export du middleware du mot de passe
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(401).json({ error: "Le mot de passe n'est pas assez fort!" });
    }
};