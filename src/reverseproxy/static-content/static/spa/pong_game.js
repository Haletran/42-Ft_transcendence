// SETUP CANVAS
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass } from '../js/utils.js';

let canvas = document.querySelector('canvas');
if (!canvas) {
    const gameDiv = document.querySelector('.game');
    canvas = document.createElement('canvas');
    canvas.id = 'pong_canvas';
    gameDiv.appendChild(canvas);
}
const ctx = canvas.getContext("2d");

// VARIABLES
canvas.width = innerWidth - 100
canvas.height = innerHeight - 100
let keys = {};
let animationFrameId;


// CENTER THE THING ON THE SCREEN USE IT WITH THE BOARD
const x = canvas.width / 2
const y = canvas.height / 2

// SETUP GAME CLASS
class Player {
    constructor(x, y, color, width, height, speed, name) {
        this.x = x
        this.y = y
        this.color = color
        this.width = width
        this.height = height
        this.speed = speed
        this.name = name
        this.initialX = x
        this.initialY = y
        this.score = 0
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        movePlayers()
        this.draw()
    }
    reset() {
        this.score = 0
        this.x = this.initialX
        this.y = this.initialY
    }

}

class Ball {
    constructor(x, y, radius, color, velocity, speed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.speed = speed
        this.initialX = x
        this.initialY = y
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        moveBall()
        this.draw()
    }
    reset() {
        this.x = this.initialX
        this.y = this.initialY
        this.velocity = { x: 2, y: 2 }
    }
}

class Table {
    constructor(x, y, width, height, bg_color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = bg_color
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineDashOffset = 4;
        ctx.setLineDash([5, 15]);
        ctx.moveTo(canvas.width / 2, canvas.height);
        ctx.lineTo(canvas.width / 2, 0);
        ctx.stroke();

        ctx.font = "48px serif";
        ctx.fillStyle = 'white';
        ctx.fillText(game.player1.score, canvas.width / 2 - 100, 100);
        ctx.fillText(game.player2.score, canvas.width / 2 + 70, 100);
    }
    update() {
        this.draw()
    }
}

class Pong {
    constructor() {
        this.game = initGame();
    }
}


// GAME RELATED FUNCTIONS
function initGame() {
    // depends on the responsivess
    const player1 = new Player(30, y, 'white', 10, 100, 5, 'player1')
    const player2 = new Player(canvas.width - 30, y, 'white', 10, 100, 5, 'player2')
    const ball = new Ball(x, y, 10, 'red', { x: 2, y: 2 }, 2)
    const table = new Table(0, 0, canvas.width, canvas.height, 'black')
    return { player1, player2, ball, table }
}

const game = initGame();
function movePlayers() {
    if (keys['38'] && game.player2.y > 0) { // UP
        game.player2.y -= game.player2.speed;
    }
    if (keys['40'] && game.player2.y < canvas.height - game.player2.height) { // DOWN
        game.player2.y += game.player2.speed;
    }
    if (keys['87'] && game.player1.y > 0) { // W
        game.player1.y -= game.player1.speed;
    }
    if (keys['83'] && game.player1.y < canvas.height - game.player1.height) { // S
        game.player1.y += game.player1.speed;
    }
}

function moveBall() {

    if (game.ball.y + game.ball.radius > canvas.height || game.ball.y - game.ball.radius < 0) {
        game.ball.velocity.y = -game.ball.velocity.y
    }
    if (game.ball.x + game.ball.radius > canvas.width || game.ball.x - game.ball.radius < 0) {
        if (game.ball.x + game.ball.radius > game.player1.x + game.player1.width) {
            game.player1.score += 1
        } else if (game.ball.x + game.ball.radius < game.player2.x + game.player2.width)
            game.player2.score += 1
        game.ball.x = game.ball.initialX
        game.ball.y = game.ball.initialY
        game.ball.velocity.x = -game.ball.velocity.x
    }
    if (game.ball.x + game.ball.radius > game.player2.x && game.ball.y > game.player2.y && game.ball.y < game.player2.y + game.player2.height) {
        game.ball.velocity.x = -game.ball.velocity.x
    }
    if (game.ball.x - game.ball.radius < game.player1.x + game.player1.width && game.ball.y > game.player1.y && game.ball.y < game.player1.y + game.player1.height) {
        game.ball.velocity.x = -game.ball.velocity.x
    }

    // KIND OF GLITCHY
    let paddleHeight = game.player1.height;
    let halfPaddle = paddleHeight / 2;

    if (game.ball.x - game.ball.radius < game.player1.x + game.player1.width && game.ball.y > game.player1.y && game.ball.y < game.player1.y + halfPaddle) {
        game.ball.velocity.y = -Math.abs(game.ball.velocity.y);
    }
    if (game.ball.x - game.ball.radius < game.player1.x + game.player1.width && game.ball.y > game.player1.y + halfPaddle && game.ball.y < game.player1.y + paddleHeight) {
        game.ball.velocity.y = Math.abs(game.ball.velocity.y);
    }
    if (game.ball.x + game.ball.radius > game.player2.x && game.ball.y > game.player2.y && game.ball.y < game.player2.y + halfPaddle) {
        game.ball.velocity.y = -Math.abs(game.ball.velocity.y);
    }
    if (game.ball.x + game.ball.radius > game.player2.x && game.ball.y > game.player2.y + halfPaddle && game.ball.y < game.player2.y + paddleHeight) {
        game.ball.velocity.y = Math.abs(game.ball.velocity.y);
    }

    game.ball.x += game.ball.velocity.x * game.ball.speed
    game.ball.y += game.ball.velocity.y * game.ball.speed
}

function GameEnd() {
    if (game.player1.score === 5 || game.player2.score === 5) {
        if (game.player1.score === 5) {
            alert('Player1 won')
        } else {
            alert('Player2 won')
        }
        game.player1.reset()
        game.player2.reset()
        game.ball.reset()
        return true
    }
}

function animate(pong) {
    if (GameEnd()) {
        clearCanvas();
        hideElementsByClass('game');
        showElementsByClass('menu', 'flex');
        addClassToElementsByClass('menu', 'center');
        cancelAnimationFrame(animationFrameId);
        keys = {};
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.table.update()
        game.player1.update()
        game.player2.update()
        game.ball.update()
        animationFrameId = requestAnimationFrame(animate)
    }
    console.log("SCORE : ", game.player1.score, game.player2.score)
    console.log("BALL : ", game.ball.x, game.ball.y, game.ball.velocity)
}

// UTILS
//DO NOT TOUCH THOSE FUNCTIONS
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function checkKeyDown(e) {
    keys[e.keyCode] = true;
}

function checkKeyUp(e) {
    keys[e.keyCode] = false;
}
window.addEventListener('keydown', checkKeyDown, false);
window.addEventListener('keyup', checkKeyUp, false);

export function startGame() {
    const pong = new Pong();
    animate(pong);
}

startGame();