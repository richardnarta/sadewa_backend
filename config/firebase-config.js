require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_SERVICE_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.REALTIME_DB_URL
});

const db = admin.database();

const message = admin.messaging();

module.exports = { db , message };