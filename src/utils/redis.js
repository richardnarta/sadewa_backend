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
  const client = await getClient();
  await client.expire(key, expirationTime);
}

async function getAvailableJWT() {
  const client = await getClient();

  let cursor = '0';
  const suffix = ':token';

  const reply = await client.scan(cursor, { COUNT: 100 });
  const keys = reply.keys;

  const filteredKeys = keys.filter(key => key.endsWith(suffix));
  
  return await Promise.all(filteredKeys.map(async (key)=> {
    return await getToken(key);
  }));
}

module.exports = {
  storeToken,
  storeOTP,
  getToken,
  removeToken,
  extendTokenExpire,
  getAvailableJWT,
};