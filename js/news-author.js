import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



async function loadNewsAuthors(){


    const authors =
    document.querySelectorAll(".news-author a");



    for(const author of authors){


        const url =
        new URL(author.href);


        const uid =
        url.searchParams.get("uid");



        if(!uid)
        continue;




        const userDoc =
        await getDoc(
            doc(db,"users",uid)
        );



        if(userDoc.exists()){


            const data =
            userDoc.data();



            const img =
            author.querySelector("img");


            const span =
            author.querySelector("span");



            if(img){

                img.src =
                data.avatar ||
                "images/default-avatar.png";

            }



            if(span){

                span.textContent =
                data.pseudo ||
                "Utilisateur";

            }


        }


    }


}



loadNewsAuthors();
