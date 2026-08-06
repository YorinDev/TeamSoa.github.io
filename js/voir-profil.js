import { db } from "./firebase.js";


import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";




// TABLE DES ROLES

const roles = {

    FondateurRL:{
        name:"Fondateur-RL",
        color:"#1B73D1"
    },

    FondateurSOA:{
        name:"Fondateur-SOA",
        color:"#050505"
    },

    CoFondateur:{
        name:"Co-Fondateur",
        color:"#AD9B47"
    },

    Secretaire:{
        name:"Secrétaire",
        color:"#ABDED3"
    },

    WebMaker:{
        name:"WebMaker",
        color:"#153218"
    },

    JoueurSOA:{
        name:"Joueur-SOA",
        color:"#DE9514"
    },

    JoueurEspoirSOA:{
        name:"Joueur-Espoir-SOA",
        color:"#2CC789"
    },

    Moderateur:{
        name:"Modérateur",
        color:"#0F75BF"
    },

    MiniaMaker:{
        name:"MiniaMaker",
        color:"#BF0F76"
    },

    Animateur:{
        name:"Animateur",
        color:"#66D90F"
    },

    CreateurDeContenu:{
        name:"Créateur-de-contenu",
        color:"#8A2984"
    },

    Member:{
        name:"Membre",
        color:"#DBDBDB"
    }

};





const avatar =
document.getElementById("avatar");


const pseudo =
document.getElementById("pseudo");


const role =
document.getElementById("role");


const verified =
document.getElementById("verified");


const date =
document.getElementById("date");





async function loadProfile(){



    const params =
    new URLSearchParams(
        window.location.search
    );



    const uid =
    params.get("uid");



    if(!uid){


        pseudo.textContent =
        "Utilisateur introuvable";


        return;

    }





    const userDoc =
    await getDoc(

        doc(
            db,
            "users",
            uid
        )

    );




    if(!userDoc.exists()){


        pseudo.textContent =
        "Utilisateur introuvable";


        return;


    }





    const data =
    userDoc.data();





    avatar.src =
    data.avatar ||
    "images/default-avatar.png";





    pseudo.textContent =
    data.pseudo ||
    "Utilisateur";






    const userRole =
    roles[data.role] ||
    roles.Membre;



    role.textContent =
    userRole.name;



    role.style.color =
    userRole.color;







    verified.textContent =
    data.emailVerified
    ? "Oui"
    : "Non";






    if(data.createdAt){


        date.textContent =
        data.createdAt
        .toDate()
        .toLocaleDateString("fr-FR");


    }
    else{


        date.textContent =
        "Inconnue";


    }



}





loadProfile();
