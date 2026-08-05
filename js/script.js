// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuAMnfhhn3so9FV70mktoBqhM_wZrQY_k",
  authDomain: "soaesport-85eff.firebaseapp.com",
  projectId: "soaesport-85eff",
  storageBucket: "soaesport-85eff.firebasestorage.app",
  messagingSenderId: "515591931528",
  appId: "1:515591931528:web:cc13849028210f50f8413d",
  measurementId: "G-LHL50FX5KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
