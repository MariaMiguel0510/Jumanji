let nickname = document.getElementById("nicknameForm");
let savedNickname = document.getElementById("nickname");

nickname.addEventListener("submit", saveNicknameOnSubmit);

// Guarda o nickname quando o botão submit é carregado
function saveNicknameOnSubmit(event) {
    event.preventDefault();  //impede que o formulário seja logo enviado
    let name = savedNickname.value;
    localStorage.setItem("nickname", name);  // guarda o nickname no localStorage
    window.location.href = "scan.html"; // redireciona para a página scan.html
}
