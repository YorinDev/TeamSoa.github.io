// ==========================
// Imports Firebase
// ==========================

import { auth, db } from "./firebase.js";

import {

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    sendEmailVerification,

    sendPasswordResetEmail,

    signOut

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {

    doc,

    setDoc,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



// ==========================
// Elements HTML
// ==========================

const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");

const loginTab = document.getElementById("loginTab");

const registerTab = document.getElementById("registerTab");

const message = document.getElementById("authMessage");



// ==========================
// Changement des onglets
// ==========================

if(loginTab && registerTab){


    loginTab.addEventListener("click",()=>{


        loginTab.classList.add("active");

        registerTab.classList.remove("active");


        loginForm.classList.remove("hidden");

        registerForm.classList.add("hidden");


    });



    registerTab.addEventListener("click",()=>{


        registerTab.classList.add("active");

        loginTab.classList.remove("active");


        registerForm.classList.remove("hidden");

        loginForm.classList.add("hidden");


    });


}



// ==========================
// Afficher un message
// ==========================

function showMessage(text, error=false){


    if(!message) return;


    message.innerHTML = text;


    if(error){

        message.style.color = "#ff4444";

    }else{

        message.style.color = "#FF7A00";

    }

}



// ==========================
// INSCRIPTION
// ==========================

if(registerForm){


registerForm.addEventListener("submit", async (e)=>{


    e.preventDefault();



    const username = document
    .getElementById("registerUsername")
    .value
    .trim();



    const email = document
    .getElementById("registerEmail")
    .value
    .trim();



    const password =
    document.getElementById("registerPassword").value;



    const confirm =
    document.getElementById("registerConfirm").value;



    if(password !== confirm){


        showMessage(
            "Les mots de passe ne correspondent pas.",
            true
        );


        return;

    }



    if(password.length < 6){


        showMessage(
            "Le mot de passe doit contenir au moins 6 caractères.",
            true
        );


        return;

    }



    if(username.length < 3){


        showMessage(
            "Le pseudo doit contenir au moins 3 caractères.",
            true
        );


        return;

    }



    try{


        const userCredential =
        await createUserWithEmailAndPassword(

            auth,

            email,

            password

        );



        const user =
        userCredential.user;



        await setDoc(

            doc(db,"users",user.uid),

            {

                pseudo: username,

                pseudoLower: username.toLowerCase(),

                email: email,

                avatar: "",

                role: "Member",

                verified:false,

                createdAt: serverTimestamp()

            }

        );



        await sendEmailVerification(user);



        showMessage(`

            Compte créé avec succès !<br><br>

            Un e-mail de vérification vient de vous être envoyé.<br><br>

            Ouvrez votre boîte mail et cliquez sur le lien reçu afin d'activer votre compte.<br><br>

            Si vous ne trouvez pas l'e-mail, pensez à vérifier votre dossier
            <b>Spam / Courriers indésirables</b>.

        `);



        registerForm.reset();



    }


    catch(error){


        console.error(error);


        showMessage(

            getErrorMessage(error.code),

            true

        );


    }



});


}



// ==========================
// CONNEXION
// ==========================

if(loginForm){


loginForm.addEventListener("submit", async(e)=>{


    e.preventDefault();



    const email =
    document.getElementById("loginEmail").value.trim();



    const password =
    document.getElementById("loginPassword").value;



    try{


        const result =
        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );



        if(result.user.emailVerified === false){


            showMessage(`

                Votre adresse e-mail n'est pas encore vérifiée.<br><br>

                Consultez votre boîte mail et cliquez sur le lien de confirmation.<br><br>

                Si vous ne trouvez pas le message, vérifiez votre dossier
                <b>Spam / Courriers indésirables</b>.

            `, true);



            return;

        }



        showMessage(
            "Connexion réussie."
        );



        setTimeout(()=>{


            window.location.href="profil.html";


        },1000);



    }


    catch(error){


        console.error(error);


        showMessage(

            getErrorMessage(error.code),

            true

        );


    }



});


}



// ==========================
// MOT DE PASSE OUBLIE
// ==========================

const forgotPassword =
document.getElementById("forgotPassword");



if(forgotPassword){


forgotPassword.addEventListener("click", async(e)=>{


    e.preventDefault();



    const email =
    document.getElementById("loginEmail").value.trim();



    if(!email){


        showMessage(
            "Entre ton adresse e-mail avant.",
            true
        );


        return;

    }



    try{


        await sendPasswordResetEmail(

            auth,

            email

        );



        showMessage(
            "E-mail de réinitialisation envoyé."
        );


    }


    catch(error){


        showMessage(

            getErrorMessage(error.code),

            true

        );


    }



});


}



// ==========================
// Déconnexion globale
// ==========================

window.logout = async function(){


    await signOut(auth);


    window.location.href="connexion.html";


};



// ==========================
// Messages Firebase
// ==========================

function getErrorMessage(code){


    switch(code){


        case "auth/email-already-in-use":

            return "Cette adresse e-mail est déjà utilisée.";



        case "auth/invalid-email":

            return "Adresse e-mail invalide.";



        case "auth/weak-password":

            return "Mot de passe trop faible (minimum 6 caractères).";



        case "auth/invalid-credential":

            return "E-mail ou mot de passe incorrect.";



        case "auth/user-not-found":

            return "Utilisateur introuvable.";



        case "auth/too-many-requests":

            return "Trop de tentatives. Réessaie plus tard.";



        default:

            return "Une erreur est survenue.";

    }


}
