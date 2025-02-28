// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const VITE_FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const VITE_FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;
const firebaseConfig = {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: "reginaroads-84d5e.firebaseapp.com",
    projectId: "reginaroads-84d5e",
    storageBucket: "reginaroads-84d5e.firebasestorage.app",
    messagingSenderId: "520889058663",
    appId: VITE_FIREBASE_APP_ID,
    measurementId: "G-3W4JELZT79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);