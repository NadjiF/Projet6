const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user')
const checkMail = require('../middleware/mail')
const checkPassword = require('../middleware/password')

router.post('/signup', checkMail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router
