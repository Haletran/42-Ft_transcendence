// SETUP CANVAS
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
// set width and height of canvas
canvas.width = innerWidth
canvas.height = innerHeight
let keys = {};

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
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.color
        ctx.fill()
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
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
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
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

// CENTER THE THING ON THE SCREEN USE IT WITH THE BOARD
const x = canvas.width / 2
const y = canvas.height / 2


// UTILS
//DO NOT TOUCH THOSE FUNCTIONS
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
function checkKeyDown(e) {
    keys[e.keyCode] = true;
}

function checkKeyUp(e) {
    keys[e.keyCode] = false;
}




// GAME RELATED FUNCTIONS
resizeCanvas()
function initGame() {
    const player1 = new Player(30, y, 'white', 10, 100, 5, 'player1')
    const player2 = new Player(canvas.width - 30, y, 'white', 10, 100, 5, 'player2')
    const ball = new Ball(x, y, 10, 'white', { x: 0, y: 0 }, 5)
    const table = new Table(0, 0, canvas.width, canvas.height, 'black')
    return { player1, player2, ball, table }
}

//resizeCanvas();
const game = initGame();
function movePlayers() {
    if (keys['38']) {
        // up arrow
        game.player1.y -= game.player1.speed;
    }
    if (keys['40']) {
        // down arrow
        game.player1.y += game.player1.speed;
    }
    if (keys['87']) {
        // w
        game.player2.y -= game.player2.speed;
    }
    if (keys['83']) {
        // s
        game.player2.y += game.player2.speed;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.table.draw()
    game.player1.draw()
    game.player2.draw()
    game.ball.draw()
    movePlayers()
    requestAnimationFrame(gameLoop)
}
gameLoop()
resizeCanvas()

// EVENTS
//window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('keydown', checkKeyDown, false);
window.addEventListener('keyup', checkKeyUp, false);