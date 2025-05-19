// Espera o vídeo terminar para mostrar o conteúdo
const video = document.getElementById("introVideo");
const content = document.getElementById("mainContent");

video.addEventListener("ended", () => {
    window.location.href = "nivel1.html";
});

// Exibe o nickname salvo
const nickname = localStorage.getItem("nickname");
document.getElementById("nicknameDisplay").textContent = nickname ? " " + nickname : "";

