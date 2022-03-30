const jwt = require('jsonwebtoken');
const config = require("config") ;
function authenticateUser(req, res, next) {
  if (!config.get('authMiddlewareEnabled')) return next();
  const secret = process.env.TOKEN_KEY;

  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  else {
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    }
    catch (ex) {
      res.status(400).send('Bad Request, Invalid JWT');
    }
  }
}
module.exports = authenticateUser;