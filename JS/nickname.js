let nickname = document.getElementById("nicknameForm");
let savedNickname = localStorage.getItem("nicknameForm");

nickname.addEventListener("submit", saveNicknameOnSubmit);

// Salva o nickname quando o usuário clica no botão de submit
function saveNicknameOnSubmit(event) {
    event.preventDefault();  // Impede o envio do formulário
    let name = nickname.value;
    localStorage.setItem("nickname", name);  // Salva o nickname no localStorage
    window.location.href = "scan.html"; // Redireciona para a página scan.html
}

