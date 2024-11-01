require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.AUTH_SECRET_KEY
const expirationTime = process.env.AUTH_EXPIRATION_SECONDS
const algorithm = process.env.AUTH_ALGORITHM

function generateToken(payload) {
  return jwt.sign(payload, secretKey, 
    {
      algorithm: algorithm,
      expiresIn: expirationTime
    }
  );
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey,
      { algorithms: ['HS256'] }
    );
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};