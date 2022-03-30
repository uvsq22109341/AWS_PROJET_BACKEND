const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const  User = require('../models/users');
const generateAuthToken = require('../utilities/tokenUtility');

router.post('/', async (req, res) => {
  const user = await User.findOne( {email : req.body.email});
  if (!user) return res.status(400).send('email ou mot de passe invalide');
  const found_password = await bcrypt.compare(req.body.password, user.password);
  if (!found_password) return res.status(400).send('mot de passe invalide');

  const jwt = generateAuthToken(user);
  user.token = jwt;
  await user.save() ; 
  res.send({ jwt });
});

router.delete('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.send('déconnexion réussi')
      }
    });
  } else {
    res.end()
  }
})



module.exports = router;
