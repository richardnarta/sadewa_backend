require('dotenv').config();
const { getClient } = require('../../config/redis-config');
const expirationTime = process.env.AUTH_EXPIRATION_SECONDS

const storeToken = async (key, token) => {
  const client = await getClient();
  await client.setEx(String(key), Number(expirationTime), String(token));
};

const storeOTP = async (key, OTP) => {
  const client = await getClient();
  await client.setEx(String(key), 300, String(OTP));
};

async function getToken(key) {
  const client = await getClient();
  const token = await client.get(key);
  return token;
}

async function removeToken(key) {
  const client = await getClient();
  await client.del(key);
}

async function extendTokenExpire(key) {
  await this.redis.expire(key, expirationTime);
}

module.exports = {
  storeToken,
  storeOTP,
  getToken,
  removeToken,
  extendTokenExpire,
};