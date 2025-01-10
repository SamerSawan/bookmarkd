import { initializeApp } from "firebase/app";
//import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "bookmarkd-91642.firebaseapp.com",
  projectId: "bookmarkd-91642",
  storageBucket: "bookmarkd-91642.firebasestorage.app",
  messagingSenderId: "335917673625",
  appId: "1:335917673625:web:fb1331b4b8b11fbad01c08",
  measurementId: "G-X3NG99WSVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
const auth = getAuth(app);


export {auth};