import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
import { registerMessagingToken } from './Axios';


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
    try {
        const messaging = getMessaging(app);
        await Notification.requestPermission();
        const token = await getToken(messaging);

        messaging.onMessageHandler = function (payload) {
            const { data, body, actions } = payload.data;

            const notificationOptions = {
                body: body,
                data: JSON.parse(data),
                actions: JSON.parse(actions)
            };

            const not = messaging.swRegistration.showNotification(payload.data.title, notificationOptions);
        };

        return token;
    } catch (error) {
        console.error(error);
    }
}