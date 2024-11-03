require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_SERVICE_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.REALTIME_DB_URL
});

const db = admin.database();

module.exports = db;