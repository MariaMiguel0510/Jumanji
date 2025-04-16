let camara;
let time;
let cameraActive = false; // Variável para armazenar o estado da câmera

function setup() {
    const container = document.getElementById('canvasCamara');
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    let canvas = createCanvas(w, h);
    canvas.parent('canvasCamara'); // adiciona o canvas dentro da div
    camara = createCapture(VIDEO, function(stream) {
        // Quando a captura da câmera for bem-sucedida
        cameraActive = true;
    });
    camara.size(w, h);
    camara.hide();

    time = 100000; /*1 minuto é 10000*/
    setTimeout(muda, time); /*depois de passar um minuto aparece a parte de cair*/
}

function draw() {
    // Se a câmera estiver ativa, desenha a imagem
    if (cameraActive) {
        image(camara, width / 2 - camara.width / 2, height / 2 - camara.height / 2);
    }

    let scannerBar = document.querySelector('.scanner > div');

    if (cameraActive) {
        // Se a câmera estiver ligada, exibe a barra azul
        scannerBar.style.display = "block";
    } else {
        // Caso contrário, esconde a barra azul
        scannerBar.style.display = "none";
    }
}

function muda() {
    window.location.href = "rules.html"; // é suposto ir para a parte de cair não das regras
}
