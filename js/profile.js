import { auth, db } from "./firebase.js";


import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {

doc,
getDoc,
updateDoc

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



const editUsername =
document.getElementById("editUsername");

const editAvatar =
document.getElementById("editAvatar");

const save =
document.getElementById("saveProfile");



let currentUser;





onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.href="connexion.html";

        return;

    }


    currentUser=user;



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



        editUsername.value =
        data.pseudo || "";



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







// ============================
// Conversion image en base64
// ============================


function resizeImage(file){


return new Promise((resolve,reject)=>{


    const reader = new FileReader();



    reader.onload = ()=>{


        const img = new Image();



        img.onload = ()=>{


            const canvas =
            document.createElement("canvas");


            canvas.width = 512;

            canvas.height = 512;



            const ctx =
            canvas.getContext("2d");



            ctx.drawImage(
                img,
                0,
                0,
                512,
                512
            );



            resolve(
                canvas.toDataURL(
                    "image/jpeg",
                    0.85
                )
            );


        };



        img.src =
        reader.result;


    };



    reader.onerror =
    reject;



    reader.readAsDataURL(file);


});


}







save.addEventListener("click",async()=>{


if(!currentUser)
return;



let updateData={};




// Pseudo

if(editUsername.value.trim()){


    updateData.pseudo =
    editUsername.value.trim();


}






// Avatar

if(editAvatar.files.length > 0){



    const file =
    editAvatar.files[0];



    if(file.size > 2 * 1024 * 1024){


        alert(
        "L'image est trop grande (maximum 2 Mo)."
        );


        return;


    }





    if(
        ![
        "image/png",
        "image/jpeg",
        "image/webp"
        ]
        .includes(file.type)
    ){


        alert(
        "Format accepté : PNG, JPG ou WebP."
        );


        return;


    }




    const base64 =
    await resizeImage(file);



    updateData.avatar =
    base64;



    avatar.src =
    base64;


}






await updateDoc(

    doc(db,"users",currentUser.uid),

    updateData

);





if(updateData.pseudo){


    username.textContent =
    updateData.pseudo;


}



alert(
"Profil mis à jour !"
);



});








logout.addEventListener("click",async()=>{


await signOut(auth);


window.location.href="connexion.html";


});
