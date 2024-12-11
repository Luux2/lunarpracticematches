// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKGoNEdfe68KSazAAoHGteMf8R-kS_LbQ",
    authDomain: "lunarpractice-7feb7.firebaseapp.com",
    databaseURL: "https://lunarpractice-7feb7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lunarpractice-7feb7",
    storageBucket: "lunarpractice-7feb7.firebasestorage.app",
    messagingSenderId: "1041285620765",
    appId: "1:1041285620765:web:1fb7f401b88591ce8692f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export { app };
