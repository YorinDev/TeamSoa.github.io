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
    getDocs

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";




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



let currentUser;

let cropper;






// CHARGEMENT PROFIL


onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.href="connexion.html";

        return;

    }



    currentUser = user;



    const userDoc =
    await getDoc(
        doc(db,"users",user.uid)
    );



    if(userDoc.exists()){


        const data =
        userDoc.data();



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
            data.createdAt
            .toDate()
            .toLocaleDateString("fr-FR");


        }


    }


});









// ========================
// MODIFICATION PSEUDO
// ========================


editUsernameButton.addEventListener("click",()=>{


    usernameModal.classList.add("active");


    newUsername.value =
    username.textContent;


});





cancelUsername.addEventListener("click",()=>{


    usernameModal.classList.remove("active");


});






saveUsername.addEventListener("click",async()=>{


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

            pseudoLower:normalized

        }

    );





    username.textContent =
    pseudo;



    usernameModal.classList.remove("active");



});









// ========================
// MODIFICATION AVATAR
// ========================



avatarContainer.addEventListener("click",()=>{


    avatarModal.classList.add("active");


});







cancelAvatar.addEventListener("click",()=>{


    avatarModal.classList.remove("active");


    if(cropper){

        cropper.destroy();

        cropper=null;

    }


});







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








saveAvatar.addEventListener("click",async()=>{


    if(!cropper)
    return;




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

            avatar:image

        }

    );





    avatar.src =
    image;



    avatarModal.classList.remove("active");



    cropper.destroy();

    cropper=null;



});









// ========================
// DECONNEXION
// ========================


logout.addEventListener("click",async()=>{


    await signOut(auth);


    window.location.href=
    "connexion.html";


});
