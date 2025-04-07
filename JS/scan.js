let camara;
let time;

function setup() {
    const container = document.getElementById('canvasCamara');
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    let canvas = createCanvas(w, h);
    canvas.parent('canvasCamara');// adiciona o canvas dentro da div
    camara = createCapture(VIDEO, { flipped: true });
    camara.hide();

    time = 100000; /*1 minuto é 10000*/
    setTimeout(muda, time); /*depois de passar um minuto aparece a parte de cair*/
}

function draw() {
    /*desenha a câmara centrada na janela*/
    image(camara, width / 2 - camara.width / 2, height / 2 - camara.height / 2);
}

function muda() {
    window.location.href = "rules.html";//é suposto ir para a parte de cair não das regras
}