import { auth, db } from "./firebase.js";


import {

    onAuthStateChanged,
    signOut,
    reload

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {

    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";




// ==========================
// TABLE DES ROLES
// ==========================

const roles = {

    FondateurRL:{
        name:"Fondateur-RL",
        color:"#1B73D1",
        weight:0
    },


    FondateurSOA:{
        name:"Fondateur-SOA",
        color:"#050505",
        weight:1
    },


    CoFondateur:{
        name:"Co-Fondateur",
        color:"#AD9B47",
        weight:2
    },


    Secretaire:{
        name:"Secrétaire",
        color:"#ABDED3",
        weight:3
    },


    WebMaker:{
        name:"WebMaker",
        color:"#354D28",
        weight:4
    },


    JoueurSOA:{
        name:"Joueur-SOA",
        color:"#DE9514",
        weight:5
    },


    JoueurEspoirSOA:{
        name:"Creator",
        color:"#2CC789",
        weight:6
    },


    Moderateur:{
        name:"Modérateur",
        color:"#0F75BF",
        weight:7
    },


    MiniaMaker:{
        name:"MiniaMaker",
        color:"#BF0F76",
        weight:8
    },


    Animateur:{
        name:"Animateur",
        color:"#66D90F",
        weight:9
    },


    CreateurDeContenu:{
        name:"Créateur-de-contenu",
        color:"#8A2984",
        weight:10
    },


    Member:{
        name:"Membre",
        color:"#DBDBDB",
        weight:11
    }

};




// ==========================
// Récupération rôle
// ==========================

function getRoleData(roleName){

    return roles[roleName] || roles.Member;

}




// ==========================
// ELEMENTS
// ==========================

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





// Modification pseudo

const editUsernameButton =
document.getElementById("editUsernameButton");


const usernameModal =
document.getElementById("usernameModal");


const newUsername =
document.getElementById("newUsername");


const saveUsername =
document.getElementById("saveUsername");


const cancelUsername =
document.getElementById("cancelUsername");





// Modification avatar

const avatarContainer =
document.querySelector(".avatar-container");


const avatarModal =
document.getElementById("avatarModal");


const avatarInput =
document.getElementById("avatarInput");


const avatarPreview =
document.getElementById("avatarPreview");


const saveAvatar =
document.getElementById("saveAvatar");


const cancelAvatar =
document.getElementById("cancelAvatar");



let currentUser = null;

let cropper = null;

// ========================
// CHARGEMENT PROFIL
// ========================

onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.href="connexion.html";

        return;

    }



    currentUser=user;



    // Recharge les informations Firebase Auth
    // pour avoir le vrai état emailVerified

    await reload(user);





    // Met à jour Firestore après validation du mail

    if(user.emailVerified){


        const userRef =
        doc(db,"users",user.uid);



        const userDoc =
        await getDoc(userRef);



        if(userDoc.exists()){


            if(userDoc.data().verified !== true){


                await updateDoc(

                    userRef,

                    {
                        verified:true
                    }

                );


            }


        }


    }





    if(email){

        email.textContent =
        user.email;

    }





    const userDoc =
    await getDoc(

        doc(
            db,
            "users",
            user.uid
        )

    );





    if(userDoc.exists()){


        const data =
        userDoc.data();





        if(avatar){

            avatar.src =
            data.avatar ||
            "images/default-avatar.png";

        }





        if(username){

            username.textContent =
            data.pseudo ||
            "Utilisateur";

        }






        if(role){


            const userRole =
            data.role ||
            "Member";



            const roleInfo =
            getRoleData(userRole);



            role.textContent =
            roleInfo.name;



            role.style.color =
            roleInfo.color;


        }






        if(verified){


            verified.textContent =
            data.verified
            ? "Oui"
            : "Non";


        }






        if(date && data.createdAt){


            date.textContent =
            data.createdAt
            .toDate()
            .toLocaleDateString("fr-FR");


        }



    }


});







// ========================
// MODIFICATION PSEUDO
// ========================


if(editUsernameButton){


editUsernameButton.addEventListener("click",()=>{


    usernameModal.classList.add("active");



    if(username){

        newUsername.value =
        username.textContent;

    }


});


}







if(cancelUsername){


cancelUsername.addEventListener("click",()=>{


    usernameModal.classList.remove("active");


});


}








if(saveUsername){


saveUsername.addEventListener("click",async()=>{


    if(!currentUser)
    return;





    const userData =
    await getDoc(

        doc(
            db,
            "users",
            currentUser.uid
        )

    );





    if(userData.exists()){


        const lastChange =
        userData.data().lastPseudoChange;



        if(lastChange){


            const difference =
            Date.now()
            -
            lastChange.toMillis();




            if(difference < 2*60*60*1000){


                const minutes =
                Math.ceil(

                    (2*60*60*1000-difference)
                    /
                    60000

                );



                alert(

                    "Vous devez attendre encore "
                    +
                    minutes
                    +
                    " minutes avant de changer votre pseudo."

                );


                return;


            }


        }


    }






    const pseudo =
    newUsername.value.trim();





    if(!pseudo)
    return;






    const normalized =
    pseudo.toLowerCase();






    const check =
    query(

        collection(db,"users"),

        where(
            "pseudoLower",
            "==",
            normalized
        )

    );






    const result =
    await getDocs(check);





    let exists=false;






    result.forEach((doc)=>{


        if(doc.id !== currentUser.uid){

            exists=true;

        }


    });






    if(exists){


        alert(
            "Ce pseudo est déjà utilisé."
        );


        return;


    }






    await updateDoc(

        doc(
            db,
            "users",
            currentUser.uid
        ),

        {

            pseudo:pseudo,

            pseudoLower:normalized,

            lastPseudoChange:
            serverTimestamp()

        }

    );






    if(username){

        username.textContent =
        pseudo;

    }




    usernameModal.classList.remove("active");



});


}

// ========================
// MODIFICATION AVATAR
// ========================


if(avatarContainer){


avatarContainer.addEventListener("click",()=>{


    avatarModal.classList.add("active");


});


}







if(cancelAvatar){


cancelAvatar.addEventListener("click",()=>{


    avatarModal.classList.remove("active");



    if(cropper){


        cropper.destroy();

        cropper=null;


    }


});


}









if(avatarInput){


avatarInput.addEventListener("change",(event)=>{


    const file =
    event.target.files[0];



    if(!file)
    return;






    if(!file.type.startsWith("image/")){


        alert(
            "Veuillez choisir une image."
        );


        return;


    }






    const reader =
    new FileReader();





    reader.onload=()=>{



        avatarPreview.src =
        reader.result;






        if(cropper){

            cropper.destroy();

        }







        cropper =
        new Cropper(

            avatarPreview,

            {

                aspectRatio:1,

                viewMode:1,

                dragMode:"move",

                autoCropArea:1,

                background:false

            }

        );



    };






    reader.readAsDataURL(file);



});


}













if(saveAvatar){


saveAvatar.addEventListener("click",async()=>{


    if(!cropper || !currentUser)
    return;







    const userData =
    await getDoc(

        doc(
            db,
            "users",
            currentUser.uid
        )

    );







    if(userData.exists()){


        const lastChange =
        userData.data().lastAvatarChange;






        if(lastChange){



            const difference =
            Date.now()
            -
            lastChange.toMillis();







            if(difference < 12*60*60*1000){





                const hours =
                Math.ceil(

                    (12*60*60*1000-difference)
                    /
                    3600000

                );






                alert(

                    "Vous devez attendre encore "
                    +
                    hours
                    +
                    " heures avant de changer votre photo."

                );



                return;



            }


        }


    }









    const canvas =
    cropper.getCroppedCanvas({

        width:256,

        height:256

    });








    const image =
    canvas.toDataURL(

        "image/jpeg",

        0.75

    );









    await updateDoc(

        doc(
            db,
            "users",
            currentUser.uid
        ),

        {

            avatar:image,

            lastAvatarChange:
            serverTimestamp()

        }

    );







    if(avatar){

        avatar.src=image;

    }






    avatarModal.classList.remove("active");







    cropper.destroy();


    cropper=null;



});


}












// ========================
// DECONNEXION
// ========================


if(logout){


logout.addEventListener("click",async()=>{


    await signOut(auth);



    window.location.href =
    "connexion.html";



});


}
