import { auth, db } from "./firebase.js";


import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";





const avatar =
document.getElementById("profileAvatar");


const username =
document.getElementById("profileUsername");


const email =
document.getElementById("profileEmail");


const role =
document.getElementById("profileRole");


const verified =
document.getElementById("profileVerified");


const date =
document.getElementById("profileDate");


const logout =
document.getElementById("logoutButton");






onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.href="connexion.html";

        return;

    }



    const userDoc =
    await getDoc(
        doc(db,"users",user.uid)
    );



    if(userDoc.exists()){


        const data=userDoc.data();



        avatar.src =
        data.avatar ||
        "images/default-avatar.png";



        username.textContent =
        data.pseudo || "Utilisateur";



        email.textContent =
        user.email;



        role.textContent =
        data.role || "Member";



        verified.textContent =
        user.emailVerified
        ? "Oui"
        : "Non";



        if(data.createdAt){


            date.textContent =
            data.createdAt.toDate()
            .toLocaleDateString("fr-FR");


        }


    }


});





logout.addEventListener("click",async()=>{


    await signOut(auth);


    window.location.href="connexion.html";


});
