import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyDrF-d9I4CnlYiiZa0jrJlyRRHoWP3enEk",
    authDomain: "chefbier-afc93.firebaseapp.com",
    projectId: "chefbier-afc93",
    storageBucket: "chefbier-afc93.appspot.com",
    messagingSenderId: "778230754903",
    appId: "1:778230754903:web:99a7448689121e69e93d12",
    measurementId: "G-C5SZ14BS5T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const notificationPermissions = async () => {
    console.log("now asking for notifications");
    try {
        const messaging = getMessaging(app);
        await Notification.requestPermission();
        const token = await getToken(messaging);
        console.log('Your token is:', token, messaging.swRegistration);
        messaging.swRegistration.active.onstatechange = () => {
            console.log("Yeet")
        }


        return token;
    } catch (error) {
        console.error(error);
    }
}