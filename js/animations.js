const reveals = document.querySelectorAll(".reveal");

if (reveals.length > 0) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active-reveal");

            }

        });

    }, {
        threshold:0.15
    });


    reveals.forEach(section => {

        observer.observe(section);

    });

}
