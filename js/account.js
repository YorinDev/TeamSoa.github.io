// ==========================
// Firebase
// ==========================

import { auth, db } from "./firebase.js";


import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



// ==========================
// Chargement du composant
// ==========================

const container = document.getElementById("account-container");



if(container){


fetch("components/account.html")


.then(response => response.text())


.then(html=>{


    container.innerHTML = html;



    const button =
        document.getElementById("accountButton");


    const menu =
        document.getElementById("accountMenu");



    button.addEventListener("click",()=>{


        menu.classList.toggle("open");


    });



    window.addEventListener("click",(e)=>{


        if(
            !button.contains(e.target)
            &&
            !menu.contains(e.target)
        ){

            menu.classList.remove("open");

        }


    });



    startAccountSystem();



});



}





// ==========================
// Système compte
// ==========================


function startAccountSystem(){


const avatar =
document.getElementById("accountAvatar");


const menuAvatar =
document.getElementById("menuAvatar");


const username =
document.getElementById("accountUsername");


const email =
document.getElementById("accountEmail");


const links =
document.getElementById("accountLinks");





onAuthStateChanged(auth, async(user)=>{


    if(user){


        let userData = null;



        const userDoc =
        await getDoc(
            doc(db,"users",user.uid)
        );



        if(userDoc.exists()){


            userData = userDoc.data();


        }



        const pseudo =
        userData?.pseudo || "Utilisateur";


        const avatarURL =
        userData?.avatar || 
        "images/default-avatar.png";



        // Avatar bouton

        avatar.src = avatarURL;


        // Avatar menu

        menuAvatar.src = avatarURL;



        // Informations

        username.textContent = pseudo;


        email.textContent = user.email;



        // Menu connecté

        links.innerHTML = `


        <a href="profil.html">

            👤 Mon profil

        </a>


        <a href="#" id="logoutButton">

            🚪 Déconnexion

        </a>


        `;



        document
        .getElementById("logoutButton")
        .addEventListener("click", async(e)=>{


            e.preventDefault();


            await signOut(auth);


            window.location.reload();


        });



    }

    else{


        // Pas connecté


        avatar.src =
        "images/default-avatar.png";


        menuAvatar.src =
        "images/default-avatar.png";



        username.textContent =
        "Invité";


        email.textContent =
        "Non connecté";



        links.innerHTML = `


        <a href="connexion.html">

            👤 Connexion

        </a>


        `;


    }



});


}
