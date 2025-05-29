let winnerPhrase = document.getElementById('venceu');
let loserPhrase = document.getElementById('perdeu');
let beginning = document.getElementById('beginning');

let word = ['C', 'A', 'N', 'Y', 'O', 'N']; // letras que formam a palavra correta
let foundPositions = new Array(word.length).fill(false); // Array que verifica se as letras foram encontradas

let lives = parseInt(sessionStorage.getItem('vidasRestantes')) || 3;
let attempts = 3; // número de tentativas
let vidasElements = document.querySelectorAll('.vidas div'); // divs representando as vidas

let gameArea = document.getElementById('containerN2'); // local onde as letras vão ser desenhadas
let bgImgElement = document.getElementById('backgroundN2'); // imagem onde as letras ficam camufladas

let tempCanvas = document.createElement('canvas');
let ctx = tempCanvas.getContext('2d');

// array de letras aleatórias (todas as letras do alfabeto, incluindo caracteres especiais)
let randomLetters = ['G', 'M', 'W', 'Q', 'Z', 'V', 'U', 'Ç', 'D'];

updateLivesDisplay();
updateAttemptsDisplay();  // Atualiza o display logo no início

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

// Atualiza a exibição do número de tentativas no HTML
function updateAttemptsDisplay() {
    let attemptsElement = document.getElementById('attemptsCount');
    if (attemptsElement) {
        attemptsElement.textContent = attempts;
    }
}

// Evento de clicar numa letra
function clicaLetra(event) {
    let letterElement = event.currentTarget;
    let clickedLetter = letterElement.dataset.letter;

    if (letterElement.clicked === true) return;
    letterElement.clicked = true;

    letterElement.style.color = 'black';

    if (letterElement.dataset.isWordLetter === 'true') {
        let canyonLetters = document.querySelectorAll('.canyon span');
        for (let i = 0; i < canyonLetters.length; i++) {
            if (canyonLetters[i].dataset.letter === clickedLetter && canyonLetters[i].style.opacity !== '1') {
                canyonLetters[i].style.opacity = '1';
                canyonLetters[i].style.color = 'rgba(52, 75, 0, 1)';

                // Atualiza a posição correta da palavra
                word.forEach((char, idx) => {
                    if (char === clickedLetter) {
                        foundPositions[idx] = true;
                    }
                });

                if (foundPositions.every(Boolean)) {
                    winnerPhrase.classList.add('mostrar'); // Mostra a mensagem de vitória
                }
                break;
            }
        }
    } else {
        // Letra errada: desconta uma tentativa
        attempts--;
        updateAttemptsDisplay();  // Atualiza o número de tentativas no HTML

        if (attempts <= 0) {
            // Perde uma vida
            lives--;
            sessionStorage.setItem('vidasRestantes', lives);
            updateLivesDisplay();

            if (lives <= 0) {
                beginning.classList.add('mostrar');
                setTimeout(() => {
                    window.location.href = 'homepage.html';
                }, 5000);
            } else {
                loserPhrase.classList.add('mostrar'); // Mostra derrota
            }
        }
    }
}

// Função para criar letras no cenário
function createLetter(letter, isWordLetter = false) {
    let letterElement = document.createElement('span');
    letterElement.classList.add('letter');
    letterElement.textContent = letter;
    letterElement.dataset.letter = letter;
    letterElement.dataset.isWordLetter = isWordLetter;

    let topPercent = Math.random() * 90 + 5;
    let leftPercent = Math.random() * 90 + 5;
    letterElement.style.top = `${topPercent}%`;
    letterElement.style.left = `${leftPercent}%`;

    let x = Math.floor((leftPercent / 100) * tempCanvas.width);
    let y = Math.floor((topPercent / 100) * tempCanvas.height);
    let pixelData = ctx.getImageData(x, y, 1, 1).data;
    let [r, g, b] = pixelData;

    const adjustColor = (r, g, b) => {
        let adjustment = Math.floor(Math.random() * 2) + 2;
        return [
            Math.min(255, r + adjustment),
            Math.min(255, g + adjustment),
            Math.min(255, b + adjustment)
        ];
    };

    [r, g, b] = adjustColor(r, g, b);
    letterElement.style.color = `rgb(${r}, ${g}, ${b})`;

    gameArea.appendChild(letterElement);
    letterElement.addEventListener('click', clicaLetra);
}

// Inicializa o jogo (com a palavra e letras aleatórias)
function initGame() {
    tempCanvas.width = bgImgElement.naturalWidth;
    tempCanvas.height = bgImgElement.naturalHeight;
    ctx.drawImage(bgImgElement, 0, 0, tempCanvas.width, tempCanvas.height);

    for (let i = 0; i < word.length; i++) {
        createLetter(word[i], true); // Letras da palavra correta
    }

    for (let i = 0; i < randomLetters.length; i++) {
        createLetter(randomLetters[i], false); // Letras aleatórias
    }

    updateLivesDisplay(); // Mostra corretamente as vidas no início
    updateAttemptsDisplay(); // Atualiza tentativas no início
}

function clearLetters() {
  // 1) Remove só os spans de classe .letter (letras espalhadas no cenário)
  gameArea.querySelectorAll('span.letter').forEach(letter => letter.remove());

  // 2) Coloca TODOS os spans do "canyon" no estado original
  let canyonContainer = document.querySelector('.canyon');
  if (canyonContainer) {
    canyonContainer.querySelectorAll('span').forEach(span => {
      // apaga qualquer estilo inline aplicado durante o jogo
      span.removeAttribute('style');
    });
  }
}

function resetGame() {
  // limpa só as letras sobre o cenário e reseta o canyon
  clearLetters();

  // reseta variáveis de jogo, exceto vidas
  attempts = 3;
  foundPositions.fill(false);

  // recarrega vidas do sessionStorage
  lives = parseInt(sessionStorage.getItem('vidasRestantes')) || 3;

  // atualiza UI
  updateLivesDisplay();
  updateAttemptsDisplay();

  // esconde mensagens
  winnerPhrase.classList.remove('mostrar');
  loserPhrase.classList.remove('mostrar');
  beginning.classList.remove('mostrar');

  // gera novamente as letras (tanto as da palavra quanto as aleatórias)
  initGame();
}


