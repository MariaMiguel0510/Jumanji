let nickname = document.getElementById("nickname");
let savedNickname = localStorage.getItem("nickname");

nickname.addEventListener("keydown", saveNicknameOnEnter);

// Salva o nickname quando o usuário pressiona Enter
function saveNicknameOnEnter(event) {
    if (event.key === "Enter") {  // Verifica se a tecla pressionada é o Enter
        event.preventDefault();
        let name = nickname.value;
        localStorage.setItem("nickname", name);  // Salva o nickname no localStorage
        window.location.href = "scan.html"; //quando carrego no enter e é submetido ent vai para a página do scan
        //alert("Nickname salvo com sucesso!");
    }
}

