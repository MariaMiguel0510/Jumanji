let winnerPhrase = document.getElementById('venceu');
let loserPhrase = document.getElementById('perdeu');
let beginning = document.getElementById('beginning');

let lives = parseInt(sessionStorage.getItem('vidasRestantes')) || 3;
let attempts = 3; // número de tentativas
let vidasElements = document.querySelectorAll('.vidas div'); // divs representando as vidas

const URL = "../mymodel/";
let model, webcam, ctx;
let labelContainer, instructionContainer, feedbackContainer;
let maxPredictions;

const targetPoses = ["Pose 1", "Pose 2", "Pose 3", "Pose 4"];
const poseInstructions = ["Down", "Left", "Right", "Two hands Up"];

let currentTargetPoseIndex;
let poseAttemptStartTime;
let poseFeedbackGiven = false;

let moveCounter = 0;
let totalMoves = 20;
let currentSpeed = 3000; // Initial 3s per move

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

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    instructionContainer = document.getElementById("instruction-container");
    feedbackContainer = document.getElementById("feedback-container");

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 200;
    const flip = true;
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();

    // Não adiciona o canvas da webcam ao DOM
    // document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Oculta os labels de previsão
    labelContainer = document.getElementById("label-container");
    labelContainer.style.display = "none";

    // Ainda é necessário o canvas para processar internamente
    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");

    startGame();
    window.requestAnimationFrame(loop);
}

function startGame() {
    if (moveCounter >= totalMoves) {
        winnerPhrase.classList.add('mostrar');
        return;
    }

    adjustSpeed();
    selectNewPose();
    poseAttemptStartTime = Date.now();
    poseFeedbackGiven = false;
    moveCounter++;
}

function adjustSpeed() {
    if (moveCounter >= 15) currentSpeed = 1500;
    else if (moveCounter >= 10) currentSpeed = 2200;
    else if (moveCounter >= 5) currentSpeed = 2800;
    else currentSpeed = 3500;
}

let lastTwoPoses = [];

function selectNewPose() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * targetPoses.length);
    } while (
        lastTwoPoses.length >= 2 &&
        lastTwoPoses[lastTwoPoses.length - 1] === newIndex &&
        lastTwoPoses[lastTwoPoses.length - 2] === newIndex
    );

    currentTargetPoseIndex = newIndex;
    lastTwoPoses.push(newIndex);
    if (lastTwoPoses.length > 2) lastTwoPoses.shift();

    updateInstruction();
}

function updateInstruction() {
    instructionContainer.textContent = poseInstructions[currentTargetPoseIndex];
    instructionContainer.classList.remove("animate");
    void instructionContainer.offsetWidth;
    instructionContainer.classList.add("animate");
}

function showFeedback(feedbackText, isCorrect) {
    feedbackContainer.textContent = feedbackText;
    feedbackContainer.style.color = isCorrect ? "limegreen" : "red";
    feedbackContainer.style.opacity = 1;

    setTimeout(() => {
        feedbackContainer.style.opacity = 0;
    }, 1500);
}

function updateStats() {
    document.getElementById("attemptsCount").textContent = `${attempts}`;
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    let predictedPose = "";
    let highestProbability = 0;

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability;

        if (probability > highestProbability) {
            highestProbability = probability;
            predictedPose = className;
        }
    }

    const targetPose = targetPoses[currentTargetPoseIndex].toLowerCase();
    const timeElapsed = Date.now() - poseAttemptStartTime;
    const enoughTimePassed = timeElapsed >= currentSpeed;

    if (!poseFeedbackGiven && enoughTimePassed) {
        if (predictedPose.toLowerCase() === targetPose && highestProbability > 0.6) {
            showFeedback("Correct!", true);
        } else {
            showFeedback("Wrong", false);
            attempts -= 1;
        }

        updateStats();
        poseFeedbackGiven = true;

        if (attempts <= 0) {
            lives--; // perde uma vida
            sessionStorage.setItem('vidasRestantes', lives); // atualiza vidas no sessionStorage
            updateLivesDisplay();

            loserPhrase.classList.add('mostrar'); // Mostra derrota
            feedbackContainer.style.display = "none";
            instructionContainer.style.display = "none";

            if (lives <= 0) {
                beginning.classList.add('mostrar'); // Mostra derrota
                window.location.href = 'homepage.html';
            }

            return;
        }

        setTimeout(() => {
            startGame();
        }, 1500);
    }
}

// reseta o jogo
function restartGame() {
    attempts = 3;
    moveCounter = 0;
    loserPhrase.classList.remove('mostrar');
    winnerPhrase.classList.remove('mostrar');
    feedbackContainer.style.display = "block";
    instructionContainer.style.display = "block";
    updateStats();
    startGame();
}
