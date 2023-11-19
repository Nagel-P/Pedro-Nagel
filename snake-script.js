var tamanhoCasa = 20;
var linhas = 20;
var colunas = 30;
var mesa;
var contexto;
var snakeX = tamanhoCasa * 5;
var snakeY = tamanhoCasa * 5;
var velociddX = 0;
var velociddY = 0;
var corpo = [];
var comidaX;
var comidaY;
var gameOver = false;
var pontuacao = 0;

window.onload = function () {
    mesa = document.getElementById("mesa");
    mesa.height = linhas * tamanhoCasa;
    mesa.width = colunas * tamanhoCasa;
    contexto = mesa.getContext("2d");

    spawnComida();
    document.addEventListener("keyup", mudaDirecao);
    setInterval(update, 1000 / 10);
}

function update() {
    if (gameOver) {
        return;
    }
    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            contexto.fillStyle = ((i + j) % 2 === 0) ? "#222" : "#333";
            contexto.fillRect(j * tamanhoCasa, i * tamanhoCasa, tamanhoCasa, tamanhoCasa);
        }
    }

    contexto.fillStyle = "#fff";
    contexto.fillRect(comidaX, comidaY, tamanhoCasa, tamanhoCasa);

    if (snakeX == comidaX && snakeY == comidaY) {
        corpo.push([comidaX, comidaY]);
        spawnComida();
        pontuacao++;
        atualizarPontuacao();
    }

    for (let i = corpo.length - 1; i > 0; i--) {
        corpo[i] = corpo[i - 1];
    }
    if (corpo.length) {
        corpo[0] = [snakeX, snakeY];
    }

    contexto.fillStyle = "#ccc";
    snakeX += velociddX * tamanhoCasa;
    snakeY += velociddY * tamanhoCasa;
    contexto.fillRect(snakeX, snakeY, tamanhoCasa, tamanhoCasa);
    for (let i = 0; i < corpo.length; i++) {
        contexto.fillRect(corpo[i][0], corpo[i][1], tamanhoCasa, tamanhoCasa);
    }

    function perdeuMane() {
        contexto.font = "40px Courier New";
        contexto.fillStyle = "white";
        const gameOverTextWidth = contexto.measureText("Você perdeu mané!").width;
        const xPosition = (mesa.width - gameOverTextWidth) / 2;
        const yPosition = mesa.height / 2;
        contexto.fillText("Você perdeu mané!", xPosition, yPosition);

        setTimeout(function () {
            location.reload();
        }, 3000);
    }

    if (snakeX < 0 || snakeX > colunas * tamanhoCasa || snakeY < 0 || snakeY > linhas * tamanhoCasa) {
        gameOver = true;
        perdeuMane();
    }

    for (let i = 0; i < corpo.length; i++) {
        if (snakeX == corpo[i][0] && snakeY == corpo[i][1]) {
            gameOver = true;
            perdeuMane();
        }
    }
}

function mudaDirecao(e) {
    if (e.code == "KeyW" && velociddY != 1) {
        velociddX = 0;
        velociddY = -1;
    } else if (e.code == "KeyS" && velociddY != -1) {
        velociddX = 0;
        velociddY = 1;
    } else if (e.code == "KeyA" && velociddX != 1) {
        velociddX = -1;
        velociddY = 0;
    } else if (e.code == "KeyD" && velociddX != -1) {
        velociddX = 1;
        velociddY = 0;
    }
}

function spawnComida() {
    comidaX = Math.floor(Math.random() * colunas) * tamanhoCasa;
    comidaY = Math.floor(Math.random() * linhas) * tamanhoCasa;
}

function atualizarPontuacao() {
    document.getElementById("pontuacao").innerText = "Pontuação: " + pontuacao;
}
