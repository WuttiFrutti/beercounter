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

const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  const { data, body, actions } = payload.data;

  const notificationOptions = {
    body: body,
    data: JSON.parse(data),
    actions: JSON.parse(actions)
  };
  self.registration.showNotification(payload.data.title, notificationOptions);
});

self.addEventListener('notificationclick', function(e) {  
  const notification = e.notification;
  if(e.action === "join"){
    notification.close();
    clients.openWindow(notification.data.url);
  }else{
    notification.close();
  }
}, false);