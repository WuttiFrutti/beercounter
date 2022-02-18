const admin = require("firebase-admin");

const serviceAccount = require(process.env.FIREBASE_CONF);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = admin.messaging();