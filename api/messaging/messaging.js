const admin = require("firebase-admin");

// const serviceAccount = require(process.env.FIREBASE_CONF);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


module.exports.sendToDevice = (devices = () => [], data) => {
  // try {
  //   const devicesE = devices();
  //   if (devicesE.length <= 0) return;
  //   admin.messaging().sendToDevice(devices, data);
  // } catch (e) {
  //   console.log("Message couldn't be sent")
  // }
};
