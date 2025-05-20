let winnerPhrase = document.getElementById('venceu');
let loserPhrase = document.getElementById('perdeu');
let beginning = document.getElementById('beginning');
let bumerangueAudio = document.getElementById('bumerangue');
let timer = document.getElementById('timer');

let motas = [];
const maxMotas = 40;
let motasRestantes = maxMotas;

//se houver valor guardado, usa-o; senão começa com 3 vidas
let lives = parseInt(sessionStorage.getItem('vidasRestantes')) || 3;
const vidasElements = document.querySelectorAll('.vidas div');

let angle, angleSpeed = 1.0;
let dir_aux, vel;
let shoot = false, dx = 0, dy = 0;
let baseX, baseY, bumerangueImg, sizeFactor = 1;
let returning = false;
let bumerangueAng = 0;
let jogoTerminado = false, jogoIniciado = false, countdown;
let motaImg;
let canShoot = false;

// carrega imagens
function preload() {
    bumerangueImg = loadImage(".../images/boomerang.png");
    motaImg = loadImage(".../images/mota.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(RADIANS);
    baseX = width / 2;
    baseY = height - 25;
    vel = createVector(2, 2);

    // adiciona as 3 primeiras motas
    for (let i = 0; i < 3; i++) {
        motas[i] = criarNovaMota();
    }

    motasRestantes = maxMotas;
    atualizarContadorMotas();
}

function draw() {
    clear();
    if (jogoIniciado) {
        desenhaMotas();
        desenhaBumerangue();
    }
}

function keyPressed() {
    if (!jogoIniciado || jogoTerminado || shoot || returning || !canShoot) return;

    dir_aux = createVector(mouseX - baseX, mouseY - baseY).normalize();
    shoot = true;
    bumerangueAudio.currentTime = 0;
    bumerangueAudio.play();
}

function desenhaMotas() {
    for (const mota of motas) {
        mota.desenhaMota();
        if (!jogoTerminado) {
            mota.trocaPos();
        }
    }
}

function desenhaBumerangue() {
    const centroY = height + 20;

    if (!jogoTerminado) {
        angle = atan2(mouseY - centroY, mouseX - baseX);
    }

    // Desenha o triângulo indicador (não essencial, pode ser removido se quiser)
    fill(0);
    triangle(
        baseX + cos(angle) * 100, centroY + sin(angle) * 100,
        baseX + cos(angle - HALF_PI) * 40, centroY + sin(angle - HALF_PI) * 40,
        baseX + cos(angle + HALF_PI) * 40, centroY + sin(angle + HALF_PI) * 40
    );
    circle(width / 2, height + 25, 135);

    if (!shoot) {
        push();
        translate(baseX, baseY);
        imageMode(CENTER);
        image(bumerangueImg, 0, 0, 140 * sizeFactor, 50 * sizeFactor);
        pop();
        return;
    }

    bumerangueAng += 0.3;

    push();
    translate(baseX + dx, baseY + dy);
    rotate(bumerangueAng);
    imageMode(CENTER);
    image(bumerangueImg, 0, 0, 140 * sizeFactor, 50 * sizeFactor);
    pop();

    if (!returning) {
        sizeFactor = max(0.2, sizeFactor - 0.03);
        dx += vel.x * dir_aux.x * 10; // simplificado cálculo, multiplicando por 10 para velocidade adequada
        dy += vel.y * dir_aux.y * 10;
    } else {
        sizeFactor = min(1, sizeFactor + 0.02);
        dx -= vel.x * dir_aux.x * 10;
        dy -= vel.y * dir_aux.y * 10;
    }

    // Começa o retorno quando o bumerangue sai da tela além do limite
    if ((baseX + dx > width + 200) || (baseX + dx < -200) || (baseY + dy > height + 200) || (baseY + dy < -200)) {
        returning = true;
    }

    // Reinicia quando chega perto da base
    if (dist(baseX + dx, baseY + dy, baseX, baseY) < 10) {
        reiniciaBumerangue();
    }

    for (let i = 0; i < motas.length; i++) {
        if (!jogoTerminado && motas[i].ativa && motas[i].colide(baseX + dx, baseY + dy)) {
            motas[i].elimina();
            matarMota();
            if (motas.length < maxMotas) {
                motas.push(criarNovaMota());
            }
            break;
        }
    }
}

function reiniciaBumerangue() {
    shoot = false;
    returning = false;
    dx = 0;
    dy = 0;
    bumerangueAng = 0;
    sizeFactor = 1;
    if (!bumerangueAudio.paused) {
        bumerangueAudio.pause();
        bumerangueAudio.currentTime = 0;
    }
}

function finalizaJogo(vitoria) {
    if (jogoTerminado) return;

    jogoTerminado = true;
    jogoIniciado = false;
    clearInterval(countdown);
    document.body.style.cursor = 'default';
    timer.style.display = 'none';

    if (vitoria) {
        winnerPhrase.classList.add('mostrar');
    } else {
        if (lives <= 0) {
            beginning.classList.add('mostrar');
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 5000);
        } else {
            loserPhrase.classList.add('mostrar');
        }
    }
}

function criarNovaMota() {
    let novaX, novaY, valido = false;
    for (let t = 0; t < 500; t++) {
        novaX = random(0, width - 200);
        novaY = random(0, height - 250);

        valido = !motas.some(m => m.ativa && abs(novaX - m.x) < 205 && abs(novaY - m.y) < 255);
        if (valido) break;
    }
    return new Mota(motaImg, novaX, novaY, 200, 250);
}

function matarMota() {
    if (motasRestantes > 0) {
        motasRestantes--;
        atualizarContadorMotas();
    }
    if (motasRestantes === 0) {
        finalizaJogo(true);
    }
}

function atualizarContadorMotas() {
    document.getElementById('motasRestantes').textContent = motasRestantes;
}

function updateLivesDisplay() {
    for (let i = 0; i < vidasElements.length; i++) {
        if (i < lives) {
            vidasElements[i].style.visibility = 'visible';
            vidasElements[i].classList.remove('fadeOutRight');
        } else {
            vidasElements[i].style.visibility = 'hidden';
        }
    }

    sessionStorage.setItem('vidasRestantes', lives);
}

function startTimer() {
    canShoot = true;
    jogoIniciado = true;
    let time = 60;

    updateLivesDisplay();

    countdown = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timer.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        time--;

        if (time < 0) {
            clearInterval(countdown);
            timer.textContent = "00:00";

            if (motasRestantes > 0) {
                // Perde uma vida
                lives--;
                console.log("Vidas restantes:", lives);
                updateLivesDisplay();

                if (lives <= 0) {
                    // Game over — mostrar mensagem e parar tudo
                    finalizaJogo(false);
                } else {
                    // Ainda tem vidas, mas perdeu o nível
                    finalizaJogo(false);
                }
            } else {
                // Vitória (derrotou todas as motas antes do tempo)
                finalizaJogo(true);
            }
        }
    }, 1000);
}

class Mota {
    constructor(imagem, posx, posy, largura, altura) {
        this.img = imagem;
        this.x = posx;
        this.y = posy;
        this.larg = largura;
        this.alt = altura;
        this.escala = 0.1;
        this.escalaMax = 5;
        this.ativa = true;
        this.lastChangeFrame = 0;
    }

    desenhaMota() {
        if (!this.ativa) return;

        noStroke();
        push();
        translate(this.x + this.larg / 2, this.y + this.alt / 2);
        scale(this.escala);
        imageMode(CENTER);
        image(this.img, 0, 0, this.larg, this.alt);
        pop();
    }

    trocaPos() {
        if ((frameCount - this.lastChangeFrame) >= 60) {
            let novaX, novaY, valido = false;

            for (let t = 0; t < 500; t++) {
                novaX = random(0, width - this.larg);
                novaY = random(0, height - this.alt);
                valido = !motas.some(other => other !== this && other.ativa && abs(novaX - other.x) < this.larg + 5 && abs(novaY - other.y) < this.alt + 5);
                if (valido) break;
            }

            if (valido) {
                this.x = novaX;
                this.y = novaY;
            }
            this.lastChangeFrame = frameCount;
        }

        if (this.escala < this.escalaMax) {
            this.escala += 0.003;
        }
    }

    colide(xc, yc) {
        return (xc > this.x && xc < this.x + this.larg && yc > this.y && yc < this.y + this.alt);
    }

    elimina() {
        this.ativa = false;
    }
}


function resetGame() {
  // 1) Para qualquer timer pendente e limpa flags
  clearInterval(countdown);
  jogoTerminado = false;
  jogoIniciado   = false;
  shoot          = false;
  returning      = false;
  dx = dy = bumerangueAng = 0;
  sizeFactor     = 1;
  canShoot       = false;

  // 2) Reinicia o boomerangue (posição, som, escala...)
  reiniciaBumerangue();

  // 3) Limpa e recria as motas
  motas = [];
  for (let i = 0; i < 3; i++) {
    motas.push(criarNovaMota());
  }
  motasRestantes = maxMotas;
  atualizarContadorMotas();

  // 4) Reseta as vidas ao valor inicial (aqui usamos 3, ajuste se quiser)
  lives = 3;
  sessionStorage.setItem('vidasRestantes', lives);
  updateLivesDisplay();

  // 5) Remove eventuais mensagens de vitória/derrota
  winnerPhrase.classList.remove('mostrar');
  loserPhrase.classList.remove('mostrar');
  beginning.classList.remove('mostrar');

  // 6) Restaura cursor e mostra timer
  document.body.style.cursor = 'none';
  timer.style.display = 'block';

  // 7) Inicia de novo o timer e permite atirar
  startTimer();
}
