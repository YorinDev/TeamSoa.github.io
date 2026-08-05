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



let currentUser = null;

let cropper = null;








// CHARGEMENT DU PROFIL


onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.href="connexion.html";

        return;

    }



    currentUser = user;



    // EMAIL FIREBASE

    if(email){

        email.textContent = user.email;

    }





    const userDoc =
    await getDoc(
        doc(db,"users",user.uid)
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

            role.textContent =
            data.role ||
            "Member";

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











// ======================
// MODIFICATION PSEUDO
// ======================


if(editUsernameButton && usernameModal){


editUsernameButton.addEventListener("click",()=>{


    usernameModal.classList.add("active");


    if(newUsername){

        newUsername.value =
        username.textContent;

    }


});


}



if(cancelUsername && usernameModal){


cancelUsername.addEventListener("click",()=>{


    usernameModal.classList.remove("active");


});


}





if(saveUsername){


saveUsername.addEventListener("click",async()=>{


    if(!currentUser || !newUsername)
    return;



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



    result.forEach((userDoc)=>{


        if(userDoc.id !== currentUser.uid){

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





    if(username){

        username.textContent =
        pseudo;

    }



    if(usernameModal){

        usernameModal.classList.remove("active");

    }


});


}









// ======================
// MODIFICATION AVATAR
// ======================


if(avatarContainer && avatarModal){


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




    if(avatar){

        avatar.src=image;

    }



    avatarModal.classList.remove("active");



    cropper.destroy();

    cropper=null;



});


}









// ======================
// DECONNEXION
// ======================


if(logout){


logout.addEventListener("click",async()=>{


    await signOut(auth);


    window.location.href =
    "connexion.html";


});


}
