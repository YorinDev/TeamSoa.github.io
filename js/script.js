import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuAMnfhhn3so9FV70mktoBqhM_wZrQY_k",
    authDomain: "soaesport-85eff.firebaseapp.com",
    projectId: "soaesport-85eff",
    storageBucket: "soaesport-85eff.firebasestorage.app",
    messagingSenderId: "515591931528",
    appId: "1:515591931528:web:cc13849028210f50f8413d",
    measurementId: "G-LHL50FX5KD"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification
const auth = getAuth(app);

// Rend l'auth accessible depuis d'autres scripts (facultatif)
window.auth = auth;

// Vérifie si un utilisateur est connecté
onAuthStateChanged(auth, (user) => {

    if (user) {
        console.log("Utilisateur connecté :", user.email);
    } else {
        console.log("Aucun utilisateur connecté");
    }

});

// Exporte les fonctions utiles
export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
};
