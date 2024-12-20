require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.AUTH_SECRET_KEY
const expirationTime = process.env.AUTH_EXPIRATION_SECONDS
const algorithm = process.env.AUTH_ALGORITHM

function generateToken(payload) {
  return jwt.sign(payload, secretKey, 
    {
      algorithm: algorithm,
      expiresIn: Number(expirationTime)
    }
  );
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey,
      { algorithms: [algorithm] }
    );
    return decoded;
  } catch (error) {
    return null;
  }
}

async function getNotificationTokenAndId(token) {
  const jwt = await verifyToken(token);

  return {
    id: jwt.id,
    notification: jwt.notification
  };
}

module.exports = {
  generateToken,
  verifyToken,
  getNotificationTokenAndId,
};