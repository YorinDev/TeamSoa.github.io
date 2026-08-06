import { db } from "./firebase.js";


import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";




// ==========================
// TABLE DES ROLES
// ==========================

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
        color:"#354D28"
    },


    JoueurSOA:{
        name:"Joueur-SOA",
        color:"#DE9514"
    },


    JoueurEspoirSOA:{
        name:"Creator",
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





// ==========================
// ELEMENTS
// ==========================


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









// ==========================
// CHARGEMENT PROFIL
// ==========================


async function loadProfile(){



    const params =
    new URLSearchParams(
        window.location.search
    );



    const uid =
    params.get("uid");





    if(!uid){


        if(pseudo){

            pseudo.textContent =
            "Utilisateur introuvable";

        }


        return;

    }








    try{



        const userDoc =
        await getDoc(

            doc(
                db,
                "users",
                uid
            )

        );







        if(!userDoc.exists()){



            if(pseudo){

                pseudo.textContent =
                "Utilisateur introuvable";

            }


            return;


        }









        const data =
        userDoc.data();








        if(avatar){


            avatar.src =
            data.avatar ||
            "images/default-avatar.png";


        }







        if(pseudo){


            pseudo.textContent =
            data.pseudo ||
            "Utilisateur";


        }









        if(role){



            const userRole =
            roles[data.role] ||
            roles.Member;





            role.textContent =
            userRole.name;





            role.style.color =
            userRole.color;



        }










        if(verified){



            verified.textContent =
            data.verified
            ? "Oui"
            : "Non";



        }









        if(date){



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






    }

    catch(error){


        console.error(
            "Erreur chargement profil :",
            error
        );



        if(pseudo){

            pseudo.textContent =
            "Erreur de chargement";

        }



    }



}






loadProfile();
