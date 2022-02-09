/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDrF-d9I4CnlYiiZa0jrJlyRRHoWP3enEk",
    authDomain: "chefbier-afc93.firebaseapp.com",
    projectId: "chefbier-afc93",
    storageBucket: "chefbier-afc93.appspot.com",
    messagingSenderId: "778230754903",
    appId: "1:778230754903:web:99a7448689121e69e93d12",
    measurementId: "G-C5SZ14BS5T"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});