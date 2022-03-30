const config = require('config');
const  User  = require('../models/users');

async function isAdmin(req, res, next) {
  if (!config.get('adminMiddlewareEnabled')) return next();
  const user = await User.findOne({ id: req.user.user_id});
  if (user.isAdmin === false) {
    return res.status(403).send("vous n'etes pas administrateur");
  } else {
    next();
  }
}
module.exports = isAdmin;
