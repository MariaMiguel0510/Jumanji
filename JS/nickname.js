let nicknameForm = document.getElementById("nicknameForm");
let nicknameInput = document.getElementById("nickname");

// Verifica se já existe um nickname salvo no localStorage
let savedNickname = localStorage.getItem("nickname");

// Se já houver um nickname salvo, podemos colocar esse como valor no campo input
if (savedNickname) {
    nicknameInput.value = savedNickname;
} else {
    // Caso contrário, o campo ficará vazio
    nicknameInput.value = '';
}


nicknameForm.addEventListener("submit", saveNicknameOnSubmit);

// Salva o nickname quando o usuário clica no botão de submit
function saveNicknameOnSubmit(event) {
    event.preventDefault();  // Impede o envio do formulário
    let name = nicknameInput.value; // Obtém o valor do nickname submetido
    localStorage.setItem("nickname", name);  // Salva o nickname no localStorage
    window.location.href = "scan.html"; // Redireciona para a página scan.html
}
