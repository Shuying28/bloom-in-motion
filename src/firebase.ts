// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMrbNcchxMEIlsbnect-T1a50kavYBCiM",
  authDomain: "bloom-in-motion.firebaseapp.com",
  projectId: "bloom-in-motion",
  storageBucket: "bloom-in-motion.appspot.com",
  messagingSenderId: "371119742052",
  appId: "1:371119742052:web:e4801dd3a86bc19bc6d371"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);