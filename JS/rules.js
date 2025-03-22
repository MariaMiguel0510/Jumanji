document.addEventListener('DOMContentLoaded', function() {
    let savedNickname = localStorage.getItem("nickname");

    if (savedNickname) {
        let nicknameDisplay = document.getElementById("nicknameDisplay");
        nicknameDisplay.textContent = savedNickname;
    } else {
        console.log("Nenhum nickname encontrado.");
    }
});