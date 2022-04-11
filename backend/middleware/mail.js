// Regex pour email
module.exports = (req, res, next) => {
    const verifyEmail = (email) => {
        let regexEmail =/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i
        let isRegexTrue = regexEmail.test(email)
        isRegexTrue ? next() : res.status(400).json({ message: 'Veuillez entrer une adresse mail valide !' });
    }
    verifyEmail(req.body.email)
  };