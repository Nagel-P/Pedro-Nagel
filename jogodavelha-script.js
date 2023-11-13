
const statusDisplay = document.querySelector('.game--status');

let turnoAtivo = true;

let jogadorAtual = "X";

let estadoPartida = ["", "", "", "", "", "", "", "", ""];

const vitoria = () => `O jogador ${jogadorAtual} venceu!`;
const empate = () => `Rodada terminou em velha!`;
const turnoJogador = () => `É o turno do ${jogadorAtual}`;

statusDisplay.innerHTML = turnoJogador();

document.querySelectorAll('.casa').forEach(casa => casa.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', restartDeJogo);

function handleCellClick(clickedCellEvent) {   
        const casaClicada = clickedCellEvent.target;
        const clickedCellIndex = parseInt(
          casaClicada.getAttribute('data-casa-index')
        );
    
        if (estadoPartida[clickedCellIndex] !== "" || !turnoAtivo) {
            return;
        }
   
        casaSelecionada(casaClicada, clickedCellIndex);
        validacaoResultado();
}

function casaSelecionada(casaClicada, clickedCellIndex) {
    
        estadoPartida[clickedCellIndex] = jogadorAtual;
        casaClicada.innerHTML = jogadorAtual;
    }

    const condicaoVitoria = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    function validacaoResultado() {
        let vitoriaDeRodada = false;
        for (let i = 0; i < 8; i++) {
            const condicaoControle = condicaoVitoria[i];
            let a = estadoPartida[condicaoControle[0]];
            let b = estadoPartida[condicaoControle[1]];
            let c = estadoPartida[condicaoControle[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                vitoriaDeRodada = true;
                break
            }
        }
    if (vitoriaDeRodada) {
        statusDisplay.innerHTML = vitoria();
        turnoAtivo = false;
        return;
    }

    let rodadaEmpate = !estadoPartida.includes("");
    if (rodadaEmpate) {
        statusDisplay.innerHTML = empate();
        turnoAtivo = false;
        return;
    }

    mudancaDeJogo();
}

function mudancaDeJogo() {
    jogadorAtual = jogadorAtual === "X" ? "O" : "X";
    statusDisplay.innerHTML = turnoJogador();
}

function restartDeJogo() {
    turnoAtivo = true;
    jogadorAtual = "X";
    estadoPartida = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = turnoJogador();
    document.querySelectorAll('.casa')
               .forEach(casa => casa.innerHTML = "");
}    