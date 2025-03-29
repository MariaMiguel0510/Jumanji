let camara;
let time;

function setup() {
    createCanvas(innerWidth, innerHeight);
    camara = createCapture(VIDEO, { flipped: true });
    camara.size(540, 405);
    camara.hide();

    time = 10000; /*1 minuto é 10000*/
    setTimeout(muda, time); /*depois de passar um minuto aparece a parte de cair*/
}

function draw() {
    /*desenha a câmara centrada na janela*/
    image(camara, width/2 - camara.width/2, height/2 - camara.height/2);
}

function muda(){
    window.location.href = "rules.html";//é suposto ir para a parte de cair não das regras
}