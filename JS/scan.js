let camara;
let time;
let cameraActive = false;

function setup() {
    const container = document.getElementById('canvasCamara');
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    let canvas = createCanvas(w, h);
    canvas.parent('canvasCamara');

    camara = createCapture(VIDEO, () => {
        cameraActive = true; // quando a câmera estiver pronta
    });

    camara.size(w, h);
    camara.hide();

    time = 100000;
    setTimeout(muda, time);
}

function draw() {
    let scannerBar = document.querySelector('.scanner > div');

    if (cameraActive) {
        push(); // guarda o estado atual
        translate(width, 0); // move a origem para a direita
        scale(-1, 1); // espelha horizontalmente (efeito espelho)
        image(camara, 0, 0, width, height);
        pop(); // restaura o estado anterior
        scannerBar.style.display = "block";
    }
}

function muda() {
    window.location.href = "rules.html";
}
