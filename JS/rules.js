window.onload = function () {
    let nickname = localStorage.getItem("nickname");
    if (nickname) {
        document.getElementById("displayNickname").textContent = nickname;
    }
};

const video = document.getElementById("introVideo");
const audio = document.getElementById("quedaSom");
let conteudo = document.querySelector('.conteudo');

// Quando o vídeo começa, inicia o som
video.addEventListener("play", () => {
    audio.play();
});

// Quando o vídeo termina, aplica a animação de fade-out e mostra o conteúdo
video.addEventListener("ended", () => {
    video.classList.add("fade-out");
    conteudo.style.display = "flex";
});


// Exibe o nickname salvo, se existir
const nickname = localStorage.getItem("nickname");
const display = document.getElementById("nicknameDisplay");

if (display) {
    display.textContent = nickname ? " " + nickname : "";
}
