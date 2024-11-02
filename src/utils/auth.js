require('dotenv').config();
const bcrypt = require('bcryptjs');

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(Number(process.env.AUTH_SALT));
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
}

async function verifyPassword(plainPassword, hashedPassword) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

function generateOTPCode() {
  const min = 1111;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateOTPCode
};