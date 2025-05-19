var i;
var slides = document.getElementsByClassName("texto");
var dots = document.getElementsByClassName("dot");
var prevBtn = document.getElementById("prev");
var nextBtn = document.getElementById("next");
var slideIndex = 1;
let personagem = document.querySelector('.personagem');
let fundo = document.querySelector('.regras');

window.onload = function () {
    showSlides(slideIndex);

    window.plusSlides = function (n) {
        showSlides(slideIndex += n);
    }

    window.currentSlide = function (n) {
        showSlides(slideIndex = n);
    }
}

function showSlides(n) {
    if (n > slides.length) {
        slideIndex = slides.length;
    }

    if (n < 1) {
        slideIndex = 1;
    }

    // Oculta todos os parágrafos
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Remove classe 'active' dos botões de navegação
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    // Exibe o parágrafo atual
    let currentSlide = slides[slideIndex - 1];
    currentSlide.style.display = "block";

    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }

    // Lógica para desabilitar os botões de navegação
    if (prevBtn) {
        prevBtn.classList.toggle("disabled", slideIndex === 1);
    }
    if (nextBtn) {
        nextBtn.classList.toggle("disabled", slideIndex === slides.length);
    }

    // Se o último parágrafo tiver sido exibido então 
    if (slideIndex === slides.length) {

        currentSlide.classList.add('fadeOut');
        if (personagem) {
            personagem.classList.add('fadeOut');
        }
        if (fundo) {
            fundo.classList.add('fadeOut');
        }

        // verifica o nome do arquivo
        let path = window.location.pathname;
        let filename = path.substring(path.lastIndexOf('/') + 1);

        // se for nivel1.html, inicia o timer
        if (filename === 'nivel1.html') {
            setTimeout(() => {
                startTimer(); // inicia o timer
                iniciaNivel1();
                document.querySelector('footer').style.opacity = '1';
                document.body.style.cursor = 'none';
            }, 900);
        } else if (filename === 'nivel2.html') {
            setTimeout(initGame, 900);
            document.querySelector('footer').style.opacity = '1';
        } else if (filename === 'nivel3.html') {
            setTimeout(init, 900);
            document.querySelector('footer').style.opacity = '1';
        } else if (filename === 'nivel4.html') {
            setTimeout(startGame, 1200);
            document.querySelector('footer').style.opacity = '1';
        }
    }
}

//verifica se o ecrã #regras já desapareceu
function iniciaNivel1() {
    let checkInterval = setInterval(() => {
        let opacity = parseFloat(getComputedStyle(fundo).opacity);

        if (opacity === 0) {
            clearInterval(checkInterval);
            canShoot = true;
        }
    }, 100); // verifica a cada 100ms
}

