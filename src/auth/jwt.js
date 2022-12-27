const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const decodeToken = (token) => {
  const codedToken = token.split(' ')[1];
  return jwt.decode(codedToken, JWT_SECRET);
};

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET);

module.exports = { decodeToken, generateToken };
