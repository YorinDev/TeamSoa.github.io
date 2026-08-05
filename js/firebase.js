// ==========================
// Firebase App
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


// ==========================
// Firebase Authentication
// ==========================

import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ==========================
// Cloud Firestore
// ==========================

import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================
// Firebase Storage
// ==========================

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";



// ==========================
// Configuration Firebase
// ==========================

const firebaseConfig = {

    apiKey: "AIzaSyAuAMnfhhn3so9FV70mktoBqhM_wZrQY_k",

    authDomain: "soaesport-85eff.firebaseapp.com",

    projectId: "soaesport-85eff",

    storageBucket: "soaesport-85eff.firebasestorage.app",

    messagingSenderId: "515591931528",

    appId: "1:515591931528:web:cc13849028210f50f8413d",

    measurementId: "G-LHL50FX5KD"

};



// ==========================
// Initialisation Firebase
// ==========================

const app = initializeApp(firebaseConfig);


// Services Firebase

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);



// Export pour les autres fichiers

export {

    app,

    auth,

    db,

    storage

};
