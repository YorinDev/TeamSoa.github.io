const container = document.getElementById("account-container");

fetch("components/account.html")

.then(response => response.text())

.then(html=>{

    container.innerHTML = html;

    const button=document.getElementById("accountButton");
    const menu=document.getElementById("accountMenu");

    button.addEventListener("click",()=>{

        menu.classList.toggle("open");

    });

    window.addEventListener("click",(e)=>{

        if(!button.contains(e.target) && !menu.contains(e.target))
            menu.classList.remove("open");

    });

});
