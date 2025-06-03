let animals = ["gorila", "leao", "lobo", "panda", "tigre", "urso"];
let board = [];
let linhas = 5;
let colunas = 5;
let painel = document.querySelector('.painel');

let quadroAtual; //imagem em que cliquei para arrastar
let quadroAlvo; //imagem pela qual vou trocar aquela que arrastei

let lives = parseInt(sessionStorage.getItem('vidasRestantes')) || 3;
let moves = 20;
let movesDisplay = document.getElementById("moves");
let trocaAudio = document.getElementById('troca');
let vidasElements = document.querySelectorAll('.vidas div'); // divs representando as vidas

let jogoAtivo = true;
let winnerPhrase = document.getElementById('venceu');
let loserPhrase = document.getElementById('perdeu');
let beginning = document.getElementById('beginning');

updateLivesDisplay();

// Atualiza a exibição das vidas (texto + visual)
function updateLivesDisplay() {
    for (let i = 0; i < vidasElements.length; i++) {
        if (i < lives) {
            vidasElements[i].style.visibility = 'visible';
            vidasElements[i].classList.remove('fadeOutRight');
        } else {
            vidasElements[i].style.visibility = 'hidden';
        }
    }
}

function startGame() {
    painel.classList.add('fadeIn');
    inicio();

    // de 100ms em 100ms o jogo verifica se há combinações de imagens iguais e se houver destroi-as
    window.setInterval(function () {
        destroi();
        desce();
        geraNovos();
    }, 100);
}

// devolve uma imagem aleatória do array animals
function randomAnimal() {
    return animals[Math.floor(Math.random() * animals.length)];
}

// inicializa o jogo colocando as imagens de forma aleatória
function inicio() {
    let joiaColuna = Math.floor(Math.random() * colunas); // sorteia a coluna da joia

    for (let l = 0; l < linhas; l++) {
        let linha = [];
        for (let c = 0; c < colunas; c++) {
            let quadro = document.createElement("img");
            quadro.id = l.toString() + "-" + c.toString();

            // coloca a joia na primeira linha, numa coluna aleatória
            if (l === 0 && c === joiaColuna) {
                quadro.src = "/images/joia.png";
            } else {
                quadro.src = "/images/" + randomAnimal() + ".png";
            }

            quadro.addEventListener("dragstart", dragStart);
            quadro.addEventListener("dragover", dragOver);
            quadro.addEventListener("dragenter", dragEnter);
            quadro.addEventListener("dragleave", dragLeave);
            quadro.addEventListener("drop", dragDrop);
            quadro.addEventListener("dragend", dragEnd);

            document.querySelector(".painel").append(quadro);
            linha.push(quadro);
        }
        board.push(linha);
    }
}

function dragStart() {
    quadroAtual = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() { }

function dragDrop() {
    quadroAlvo = this;
}

function dragEnd() {
    if (!jogoAtivo) return;

    if (quadroAtual.src.includes("blank") || quadroAlvo.src.includes("blank")) {
        return;
    }

    let coordAtuais = quadroAtual.id.split("-");
    let line = parseInt(coordAtuais[0]);
    let column = parseInt(coordAtuais[1]);

    let coordAlvo = quadroAlvo.id.split("-");
    let line2 = parseInt(coordAlvo[0]);
    let column2 = parseInt(coordAlvo[1]);

    let esquerda = column2 == column - 1 && line == line2;
    let direita = column2 == column + 1 && line == line2;
    let cima = line2 == line - 1 && column == column2;
    let baixo = line2 == line + 1 && column == column2;

    let lado = esquerda || direita || cima || baixo;

    if (lado) {
        let imgAtual = quadroAtual.src;
        let imgAlvo = quadroAlvo.src;
        quadroAtual.src = imgAlvo;
        quadroAlvo.src = imgAtual;

        let valido = verifica();

        if (!valido) {
            // desfaz a troca
            quadroAtual.src = imgAtual;
            quadroAlvo.src = imgAlvo;
        } else {
            moves--;
            movesDisplay.innerText = 'moves: ' + moves;

            if (moves <= 0) {
                lives--;
                updateLivesDisplay();
                movesDisplay.style.display = 'none';
                if (lives === 0) {
                    jogoAtivo = false;
                    beginning.classList.add('mostrar');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 5000);
                } else {
                    loserPhrase.classList.add('mostrar'); // Mostra derrota
                }
            }
        }
    }
}


function destroi() {
    tresAnimais();
}

// elimina três imagens quando estão 3 seguidas iguais
function tresAnimais() {
    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas - 2; c++) {
            let animal1 = board[l][c];
            let animal2 = board[l][c + 1];
            let animal3 = board[l][c + 2];
            if (animal1.src == animal2.src && animal2.src == animal3.src && !animal3.src.includes("blank")) {
                animal1.src = "/images/blank.png";
                animal2.src = "/images/blank.png";
                animal3.src = "/images/blank.png";
            }
        }
    }

    for (let c = 0; c < colunas; c++) {
        for (let l = 0; l < linhas - 2; l++) {
            let animal1 = board[l][c];
            let animal2 = board[l + 1][c];
            let animal3 = board[l + 2][c];
            if (animal1.src == animal2.src && animal2.src == animal3.src && !animal1.src.includes("blank")) {
                animal1.src = "/images/blank.png";
                animal2.src = "/images/blank.png";
                animal3.src = "/images/blank.png";
            }
        }
    }
}

function verifica() {
    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas - 2; c++) {
            let animal1 = board[l][c];
            let animal2 = board[l][c + 1];
            let animal3 = board[l][c + 2];
            if (animal1.src == animal2.src && animal2.src == animal3.src && !animal3.src.includes("blank")) {
                return true;
            }
        }
    }

    for (let c = 0; c < colunas; c++) {
        for (let l = 0; l < linhas - 2; l++) {
            let animal1 = board[l][c];
            let animal2 = board[l + 1][c];
            let animal3 = board[l + 2][c];
            if (animal1.src == animal2.src && animal2.src == animal3.src && !animal1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function desce() {
    for (let c = 0; c < colunas; c++) {
        let index = linhas - 1;
        for (let l = linhas - 1; l >= 0; l--) {
            if (!board[l][c].src.includes("blank")) {
                board[index][c].src = board[l][c].src;
                index -= 1;
            }
        }

        for (let l = index; l >= 0; l--) {
            board[l][c].src = "/images/blank.png";
        }
    }

    verificaJoia(); // verificar se a joia chegou à última linha
}

function geraNovos() {
    for (let c = 0; c < colunas; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "/images/" + randomAnimal() + ".png"; // só animais normais
        }
    }

    // verifica se ainda há jogadas possíveis, caso contrário baralha o tabuleiro
    if (!temJogadaPossivel()) {
        baralhaTabuleiro();
    }
}

// verifica se a joia chegou à última linha
function verificaJoia() {
    for (let c = 0; c < colunas; c++) {
        if (board[linhas - 1][c].src.includes("joia")) {
            jogoAtivo = false;
            winnerPhrase.classList.add('mostrar'); // Mostra derrota
            movesDisplay.style.display = 'none';
        }
    }
}


// verifica se há pelo menos uma jogada possível
function temJogadaPossivel() {
    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            // testa a troca horizontal
            if (c < colunas - 1) {
                trocaTemporaria(l, c, l, c + 1);
                if (verifica()) {
                    trocaTemporaria(l, c, l, c + 1); // desfaz
                    return true;
                }
                trocaTemporaria(l, c, l, c + 1); // desfaz
            }
            // testa a troca vertical
            if (l < linhas - 1) {
                trocaTemporaria(l, c, l + 1, c);
                if (verifica()) {
                    trocaTemporaria(l, c, l + 1, c); // desfaz
                    return true;
                }
                trocaTemporaria(l, c, l + 1, c); // desfaz
            }
        }
    }
    return false;
}

// troca temporária de duas imagens
function trocaTemporaria(l1, c1, l2, c2) {
    let temp = board[l1][c1].src;
    board[l1][c1].src = board[l2][c2].src;
    board[l2][c2].src = temp;
}

// Baralha os animais do tabuleiro
function baralhaTabuleiro() {
    let imagens = [];

    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            let img = board[l][c];
            if (!img.src.includes("blank") && !img.src.includes("joia")) {
                imagens.push(img.src);
            }
        }
    }

    //baralha
    for (let i = imagens.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [imagens[i], imagens[j]] = [imagens[j], imagens[i]];
    }

    let index = 0;
    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            let img = board[l][c];
            if (!img.src.includes("blank") && !img.src.includes("joia")) {
                img.src = imagens[index];
                index++;
            }
        }
    }
}

// Adiciona este trecho no teu script, por exemplo logo abaixo das outras funções

// Seleciona o botão “Try again” (coloca o id correto no teu HTML, aqui usamos 'tryAgain')
const tryAgainBtn = document.getElementById('tryAgain');

function resetGame() {
    // 1. Limpa o painel e o array que armazena o tabuleiro
    document.querySelector('.painel').innerHTML = '';
    board = [];

    // 2. Reseta o número de movimentos para 5 e atualiza no DOM
    moves = 20;
    movesDisplay.innerText = 'moves: ' + moves;
    movesDisplay.style.display = 'block';

    // 3. Volta a ativar o jogo
    jogoAtivo = true;

    // 4. Esconde mensagens de vitória/derrota
    loserPhrase.classList.remove('mostrar');
    winnerPhrase.classList.remove('mostrar');
    beginning.classList.remove('mostrar');

    // 5. Gera um novo tabuleiro (mantendo o número de vidas atual)
    inicio();
}

function fadeOutAndRedirect() {
    winnerPhrase.classList.add('fade-out');
    painel.classList.add('fade-out-board');
    document.querySelector('.vidas').classList.add('fade-out-lives');
    
    // Aguarda a duração da transição antes de redirecionar
    setTimeout(() => {
        window.location.href = 'nivel5.html';
    }, 1000); // deve bater com o tempo da transição (1s)
}
