import { initializeApp } from "firebase/app";
//import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "clean-node-447315-e1.firebaseapp.com",
  projectId: "clean-node-447315-e1",
  storageBucket: "clean-node-447315-e1.firebasestorage.app",
  messagingSenderId: "944068545949",
  appId: "1:944068545949:web:059eb32c67a7fa23307374",
  measurementId: "G-H9PPN2R588"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
const auth = getAuth(app);


export {auth};