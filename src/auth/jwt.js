const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const decodeToken = (token) => {
  const codedToken = token.split(' ')[0];
  return jwt.decode(codedToken, JWT_SECRET);
};

module.exports = { decodeToken };
