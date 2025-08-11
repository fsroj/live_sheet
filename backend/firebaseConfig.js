const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lify-280503.firebaseio.com" // Usa tu URL
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };