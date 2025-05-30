let nickname = document.getElementById("nicknameForm");
let savedNickname = document.getElementById("nickname");

nickname.addEventListener("submit", saveNicknameOnSubmit);

// Guarda o nickname quando o botão submit é carregado
function saveNicknameOnSubmit(event) {
    event.preventDefault();  //impede que o formulário seja logo enviado
    let name = savedNickname.value;
    localStorage.setItem("nickname", name);  // guarda o nickname no localStorage
    window.location.href = "rules.html"; // redireciona para a página rules.html
}

const audio = document.getElementById('tambores');
const somDesligado = document.getElementById('desligado');
const somLigado = document.getElementById('ligado');      

// When the page loads: play audio and show sound ON icon
window.onload = () => {
  audio.play();
  somLigado.style.display = 'block';    // show "sound ON" icon
  somDesligado.style.display = 'none';  // hide "sound OFF" icon
};

function toggleSom() {
  if (audio.paused) {
    audio.play();
    somLigado.style.display = 'block';    // show "sound ON" icon
    somDesligado.style.display = 'none';  // hide "sound OFF" icon
  } else {
    audio.pause();
    somLigado.style.display = 'none';     // hide "sound ON" icon
    somDesligado.style.display = 'block'; // show "sound OFF" icon
  }
}

somLigado.addEventListener('click', toggleSom);
somDesligado.addEventListener('click', toggleSom);



