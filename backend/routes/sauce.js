
// Création d'un routeur Express qui contiendra la logique de nos routes
const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const sauceInput = require('../middleware/sauce-input');
const sauceCtrl = require('../controllers/sauce');


// Application de notre middleware auth à toute nos routes, multer placé après pour qu'il ne s'applique qu'aux
// requêtes authentifiées
router.get("/", auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceInput, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceInput, sauceCtrl.updateSauce)
router.delete("/:id", auth, sauceCtrl.deleteSauce)
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce)

module.exports = router;