import { auth, db } from "./firebase.js";


import {

    onAuthStateChanged,
    signOut

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




// COULEURS DES RANGS

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
        color:"##ABDED3",
        weight:3
    },


    JoueurSOA:{
        name:"Joueur-SOA",
        color:"#DE9514",
        weight:4
    },


    JoueurEspoirSOA:{
        name:"Creator",
        color:"#2CC789",
        weight:5
    },


    Moderateur:{
        name:"Modérateur",
        color:"#0F75BF",
        weight:6
    },


    MiniaMaker:{
        name:"MiniaMaker",
        color:"#BF0F76",
        weight:7
    },


    Animateur:{
        name:"Animateur",
        color:"#66D90F",
        weight:8
    },

    CreateurDeContenu:{
        name:"Créateur-de-contenu",
        color:"#8A2984",
        weight:9
    },

    Membre:{
        name:"Membre",
        color:"##DBDBDB",
        weight:10
    }

};




// ==========================
// Récupérer les informations d'un rôle
// ==========================

function getRoleData(roleName){


    return roles[roleName] || roles.Member;


}




// ==========================
// Trier une liste de comptes
// Plus petit weight = plus haut
// ==========================

function sortUsersByRole(users){


    return users.sort((a,b)=>{


        const roleA =
        getRoleData(a.role).weight;


        const roleB =
        getRoleData(b.role).weight;



        return roleA - roleB;


    });


}






// ELEMENTS PROFIL


const avatar = document.getElementById("profileAvatar");

const username = document.getElementById("profileUsername");

const email = document.getElementById("profileEmail");


const role = document.getElementById("profileRole");

const verified = document.getElementById("profileVerified");

const date = document.getElementById("profileDate");


const logout = document.getElementById("logoutButton");






// MODIFICATION PSEUDO


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








// MODIFICATION AVATAR


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



    if(email){

        email.textContent=user.email;

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
            user.emailVerified
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


    newUsername.value =
    username.textContent;


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





    username.textContent =
    pseudo;



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

        width:512,

        height:512

    });







    const image =
    canvas.toDataURL(

        "image/jpeg",

        0.85

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







    avatar.src=image;




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
