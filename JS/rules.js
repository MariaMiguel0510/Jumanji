document.addEventListener('DOMContentLoaded', function () {
    let savedNickname = localStorage.getItem("nickname");

    if (savedNickname) {
        let nicknameDisplay = document.getElementById("nicknameDisplay");
        nicknameDisplay.textContent = savedNickname;
    } else {
        console.log("Nenhum nickname encontrado.");
    }
});

//desenha as regras de x em x segundos, para que apreça uma parte do texto de cada vez na tela
function mostraTexto() {
    let texto = document.querySelectorAll('.rules');
    let nL = 3; // número de linhas de texto (h2)
    let i = 0; // variável para controlar qual dos h2 é exibido 

    function escreve() {

        if (i < nL) { // Verifica se o índice está dentro do limite
            // Esconde todas as frases usando um ciclo for
            for (let j = 0; j < nL; j++) {
                texto[j].style.display = 'none';
            }

            // Exibe a frase atual
            texto[i].style.display = 'block';
            i++; // Incrementa o índice para o próximo texto
        }
    }

    // mostra o primeiro h2
    escreve();

    // define o intervalo para trocar os h2 a cada 5 segundos
    setInterval(escreve, 5000);
}

// Executa a função após o carregamento da página
window.onload = mostraTexto;
