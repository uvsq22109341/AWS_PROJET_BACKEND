const express = require('express');
const router = express.Router();
const  User  = require('../models/users');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const generateAuthToken = require('../utilities/tokenUtility');

router.get('/', [auth, admin], async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post('/', async (req, res) => {
  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const password_digest = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      user_name: req.body.user_name,
      email: req.body.email,
      password: password_digest
    });

    res
      .header('x-auth-token', generateAuthToken(user))
      .header('access-control-expose-headers', 'x-auth-token')
      .send(
        {
          _id: user._id,
          user_name: req.body.user_name,
          email: req.body.email
        });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.user_id},
    attributes: { exclude: [ 'created_at', 'updated_at'] }
  });
  res.send(user);
});

router.put('/me', auth, async (req, res) => {
  // To do:
  // 1. add ability to update password. Don't forget to update token if password is updated.
  // 2. add ability to update a single property

  try {
      const user = await User.findOne({
        where: { id: req.user.user_id},
        attributes: { exclude: ['created_at', 'updated_at'] }
      });
      const updated_user = await user.update({
        user_name: req.body.user_name,
        email: req.body.email
      });
      res.send(updated_user);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    attributes: { exclude: [ 'created_at', 'updated_at'] }
  });
  if (!user) {
    res.status(404).send('User ID not found');
  } else {
    await user.destroy();
    res.send(user);
  }
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
