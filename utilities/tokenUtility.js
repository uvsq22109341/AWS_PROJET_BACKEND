const jwt = require('jsonwebtoken');

module.exports = function generateAuthToken(user){
  const secret =process.env.TOKEN_KEY;
  return jwt.sign({ user_id: user._id, email: user.email }, secret);
}
