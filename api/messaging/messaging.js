const admin = require("firebase-admin");


admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "chefbier-afc93",
    "private_key_id": process.env.FIREBASE_KEY_ID,
    "private_key": process.env.FIREBASE_KEY,
    "client_email": "firebase-adminsdk-z7nqm@chefbier-afc93.iam.gserviceaccount.com",
    "client_id": "101842389371668864696",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-z7nqm%40chefbier-afc93.iam.gserviceaccount.com"
  })
});


module.exports = admin.messaging();