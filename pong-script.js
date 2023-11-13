var DIRECAO = {
    IDLE: 0,
    CIMA: 1,
    BAIXO: 2,
    ESQUERDA: 3,
    DIREITA: 4
};
 
var rounds = [5, 5, 3, 3, 2];
var cores = ['#333'];
 
var Bola = {
    new: function (aumentoVelocidade) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas.height / 2) - 9,
            moveX: DIRECAO.IDLE,
            moveY: DIRECAO.IDLE,
            speed: aumentoVelocidade || 7 
        };
    }
};
 
var Ai = {
    new: function (lado) {
        return {
            width: 18,
            height: 180,
            x: lado === 'esquerda' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: DIRECAO.IDLE,
            speed: 8
        };
    }
};
 
var Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
 
        this.canvas.width = 1400;
        this.canvas.height = 850;
 
        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';
 
        this.player = Ai.new.call(this, 'esquerda');
        this.ai = Ai.new.call(this, 'direita');
        this.bola = Bola.new.call(this);
 
        this.ai.speed = 5;
        this.running = this.over = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = '#333';
 
        Pong.menu();
        Pong.listen();
    },
 
    endGameMenu: function (text) {
        Pong.context.font = '45px Courier New';
        Pong.context.fillStyle = this.color;
 
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        );
 
        Pong.context.fillStyle = '#ffffff';
 
        Pong.context.fillText(text,
            Pong.canvas.width / 2,
            Pong.canvas.height / 2 + 15
        );
 
        setTimeout(function () {
            Pong = Object.assign({}, Game);
            Pong.initialize();
        }, 3000);
    },
 
    menu: function () {
        Pong.draw();
 
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;
 
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );
 
        this.context.fillStyle = '#ffffff';
 
        this.context.fillText('Aperte qualquer tecla para começar.',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },
 
    update: function () {
        if (!this.over) {
            if (this.bola.x <= 0) Pong._resetTurn.call(this, this.ai, this.player);
            if (this.bola.x >= this.canvas.width - this.bola.width) Pong._resetTurn.call(this, this.player, this.ai);
            if (this.bola.y <= 0) this.bola.moveY = DIRECAO.BAIXO;
            if (this.bola.y >= this.canvas.height - this.bola.height) this.bola.moveY = DIRECAO.CIMA;
 
            if (this.player.move === DIRECAO.CIMA) this.player.y -= this.player.speed;
            else if (this.player.move === DIRECAO.BAIXO) this.player.y += this.player.speed;
 
            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.bola.moveX = this.turn === this.player ? DIRECAO.ESQUERDA : DIRECAO.DIREITA;
                this.bola.moveY = [DIRECAO.CIMA, DIRECAO.BAIXO][Math.round(Math.random())];
                this.bola.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }
 
            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);
 
            if (this.bola.moveY === DIRECAO.CIMA) this.bola.y -= (this.bola.speed / 1.5);
            else if (this.bola.moveY === DIRECAO.BAIXO) this.bola.y += (this.bola.speed / 1.5);
            if (this.bola.moveX === DIRECAO.ESQUERDA) this.bola.x -= this.bola.speed;
            else if (this.bola.moveX === DIRECAO.DIREITA) this.bola.x += this.bola.speed;
 
            if (this.ai.y > this.bola.y - (this.ai.height / 2)) {
                if (this.bola.moveX === DIRECAO.DIREITA) this.ai.y -= this.ai.speed / 1.5;
                else this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.bola.y - (this.ai.height / 2)) {
                if (this.bola.moveX === DIRECAO.DIREITA) this.ai.y += this.ai.speed / 1.5;
                else this.ai.y += this.ai.speed / 4;
            }
 
            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;
 
            if (this.bola.x - this.bola.width <= this.player.x && this.bola.x >= this.player.x - this.player.width) {
                if (this.bola.y <= this.player.y + this.player.height && this.bola.y + this.bola.height >= this.player.y) {
                    this.bola.x = (this.player.x + this.bola.width);
                    this.bola.moveX = DIRECAO.DIREITA;
 
                }
            }
 
            if (this.bola.x - this.bola.width <= this.ai.x && this.bola.x >= this.ai.x - this.ai.width) {
                if (this.bola.y <= this.ai.y + this.ai.height && this.bola.y + this.bola.height >= this.ai.y) {
                    this.bola.x = (this.ai.x - this.bola.width);
                    this.bola.moveX = DIRECAO.ESQUERDA;
 
                }
            }
        }
 
        if (this.player.score === rounds[this.round]) {
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Você ganhou!'); }, 1000);
            } else {
                this.color = this._generateRoundColor();
                this.player.score = this.ai.score = 0;
                this.player.speed += 0.5;
                this.ai.speed += 1;
                this.bola.speed += 1;
                this.round += 1;
 
            }
        }
        else if (this.ai.score === rounds[this.round]) {
            this.over = true;
            setTimeout(function () { Pong.endGameMenu('Você perdeu mané!'); }, 1000);
        }
    },
 
    draw: function () {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
 
        this.context.fillStyle = this.color;
 
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
 
        this.context.fillStyle = '#ffffff';
 
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );
 
        this.context.fillRect(
            this.ai.x,
            this.ai.y,
            this.ai.width,
            this.ai.height 
        );
 
        if (Pong._turnDelayIsOver.call(this)) {
            this.context.fillRect(
                this.bola.x,
                this.bola.y,
                this.bola.width,
                this.bola.height
            );
        }
 
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();
 
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';
 
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        );
 
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );
 
        this.context.font = '30px Courier New';
 
        this.context.fillText(
            'Round ' + (Pong.round + 1),
            (this.canvas.width / 2),
            35
        );
 
        this.context.font = '40px Courier';
 
        this.context.fillText(
            rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
            (this.canvas.width / 2),
            100
        );
    },
 
    loop: function () {
        Pong.update();
        Pong.draw();
 
        if (!Pong.over) requestAnimationFrame(Pong.loop);
    },
 
    listen: function () {
        document.addEventListener('keydown', function (key) {
            if (Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }
 
            if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECAO.CIMA;
 
            if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECAO.BAIXO;
        });
 
        document.addEventListener('keyup', function (key) { Pong.player.move = DIRECAO.IDLE; });
    },
 
    _resetTurn: function(victor, loser) {
        this.bola = Bola.new.call(this, this.bola.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();
 
        victor.score++;
    },
 
    _turnDelayIsOver: function() {
        return ((new Date()).getTime() - this.timer >= 1000);
    },
 
    _generateRoundColor: function () {
    return "#333";
}

};
 
var Pong = Object.assign({}, Game);
Pong.initialize();