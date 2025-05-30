const audio = document.getElementById('tambores');
const somDesligado = document.getElementById('desligado');
const somLigado = document.getElementById('ligado');

function toggleSom() {
    if (somLigado.style.display === 'block') {
        somLigado.style.display = 'none';
        somDesligado.style.display = 'block';
        audio.pause();
    } else {
        somDesligado.style.display = 'none';
        somLigado.style.display = 'block';
        audio.play();
    }
}

somLigado.addEventListener('click', toggleSom);
somDesligado.addEventListener('click', toggleSom);

