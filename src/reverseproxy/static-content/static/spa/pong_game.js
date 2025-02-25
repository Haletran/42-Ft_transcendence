// SETUP CANVAS
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass, setACookie, getACookie } from '../js/utils.js';
import { set1v1victory } from '../src/scoreTable.js';
import { interactWithContract } from '../js/interact.js'
import { shoot } from '../src/particles.js';


let canvas = document.querySelector('canvas#pong_canvas');
if (!canvas) {
    const gameDiv = document.querySelector('.game');
    canvas = document.createElement('canvas');
    canvas.id = 'pong_canvas';
    canvas.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle');
    gameDiv.appendChild(canvas);
}

const ctx = canvas.getContext("2d");
let game = 0;
const collisionSound_PONG = new Audio('/static/imgs/pong.mp3');
const collisionSound_PING = new Audio('/static/imgs/ping.mp3');
const coutdownSound = new Audio('/static/imgs/countdown.mp3');
const victorySound = new Audio('/static/imgs/victory.mp3');
const pointSound = new Audio('/static/imgs/point.mp3');
const isPowerUp = localStorage.getItem('powerUp');
let pauseButtonHandler = null;
const powerUpImage = new Image();
powerUpImage.src = '/static/imgs/powerup.png';

// VARIABLES
canvas.width = innerWidth - 400
canvas.height = innerHeight - 200
let keys = {};
let first_hit = 0;
let animationFrameId = 0;
const hitEffect = () => {
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, game.ball.radius * 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
};

// CENTER THE THING ON THE SCREEN USE IT WITH THE BOARD
const x = canvas.width / 2
const y = canvas.height / 2

let contractAddresses = [];

async function fetchContractAddresses() {
    try {
        const url = '/static/spa/contract/deployedAddresses.json';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        let addresses;
        try {
            addresses = JSON.parse(text);
        } catch (err) {
            throw new Error('Failed to parse JSON');
        }
        const firstContract = addresses[0];

        return [
            firstContract.contract1,
            firstContract.contract2,
            firstContract.contract3,
            firstContract.contract4,
            firstContract.contract5,
            firstContract.contract6,
            firstContract.contract7
        ];
    } catch (err) {
        console.error('Error fetching contract addresses:', err);
        throw err;
    }
}

fetchContractAddresses().then(addresses => {
    contractAddresses = addresses;
}).catch(err => {
    console.error("Error fetching addresses:", err);
});


// SETUP GAME CLASSES
class Player {
    constructor(x, y, color, width, height, speed, name, isAi) {
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
        this.isAi = isAi
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    setName(name) {
        this.name = name
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
    constructor(x, y, width, height, bg_color, t_color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = bg_color
        this.text_color = t_color;
        this.lastAIMoveTime = 0;
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

        ctx.font = "23px sans-serif";
        ctx.fillStyle = this.text_color;
        ctx.fillText(game.player1.name, 50, 50);
        ctx.fillText(game.player2.name, canvas.width - 150, 50);

        ctx.font = "48px sans-serif";
        ctx.fillText(game.player1.score, canvas.width / 2 - 100, 100);
        ctx.fillText(game.player2.score, canvas.width / 2 + 70, 100);
    }

    update() {
        this.draw()
    }
}

class Tournament {
    constructor(playerNames) {
        const playerWidth = 10;
        const screenWidth = canvas.width;
        const spacing = screenWidth / (playerNames.length + 1);
        this.players = playerNames.map((name, index) => {
            const xPos = spacing * (index + 1);
            return new Player(
                xPos - playerWidth / 2,
                canvas.height / 2,
                'white',
                10,
                100,
                5,
                name
            );
        });
        this.bracket = this.createBracket();
        this.currentRound = 0;
        this.contract = 0;
        this.matchInProgress = false;
    }

    createBracket() {
        const totalPlayers = this.players.length;
        const bracket = [];
        const shuffledPlayers = this.shuffleArray([...this.players]);
        for (let i = 0; i < totalPlayers; i += 2) {
            bracket.push({
                player1: shuffledPlayers[i],
                player2: shuffledPlayers[i + 1],
                winner: null
            });
        }

        return bracket;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async playMatch(player1, player2) {
        game.player1 = new Player(
            30,
            canvas.height / 2,
            'white',
            10,
            100,
            5,
            player1.name
        );
        game.player2 = new Player(
            canvas.width - 30,
            canvas.height / 2,
            'white',
            10,
            100,
            5,
            player2.name
        );

        game.ball.reset();
        game.player1.reset();
        game.player2.reset();

        return new Promise((resolve) => {
            const matchLoop = () => {
                if (getACookie('game_running') === 'false') {
                    return;
                }
                if (GameEnd()) {
                    const scores = { p1: game.player1.score, p2: game.player2.score };
                    set1v1victory(game.player1, game.player2, scores, false, true);
                    const winner = getWinner(game.player1, game.player2);
                    interactWithContract(contractAddresses[this.contract], game.player1.name, game.player1.score, game.player2.name, game.player2.score);
                    resolve(winner === game.player1.name ? player1 : player2);
                    this.contract++;
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    game.table.update();
                    game.player1.update();
                    game.player2.update();
                    game.ball.update();
                    animationFrameId = requestAnimationFrame(matchLoop);
                }
            };
            matchLoop();
        });
    }

    async startTournament(resolve) {
        if (getACookie('game_running') === 'false') {
            return;
        }
        while (this.currentRound < Math.log2(this.players.length)) {
            const roundMatchups = this.bracket.filter(match => match.winner === null);
            const roundWinners = [];

            for (const match of roundMatchups) {
                const winner = await this.playMatch(match.player1, match.player2);
                alert(`${winner.name} won!`);
                match.winner = winner;
                roundWinners.push(winner);
            }
            if (roundWinners.length > 1) {
                this.bracket = roundWinners.reduce((newBracket, winner, index, arr) => {
                    if (index % 2 === 0) {
                        newBracket.push({
                            player1: winner,
                            player2: arr[index + 1],
                            winner: null
                        });
                    }
                    return newBracket;
                }, []);
            }

            this.currentRound++;
        }

        const tournamentWinner = this.bracket[0].winner;
        alert(`Tournament Winner: ${tournamentWinner.name}!`);
        clearCanvas();
        hideElementsByClass('game');
        showElementsByClass('menu', 'flex');
        addClassToElementsByClass('menu', 'center');
        resolve(tournamentWinner.name);
    }
}

class Pong {
    constructor(gamemode) {
        this.game = initGame(gamemode);
        this.gameMode = gamemode;
    }
}

// GAME RELATED FUNCTIONS
function initGame(gamemode) {
    let username = localStorage.getItem('username');
    let username2 = localStorage.getItem('username2');
    let ballColor = localStorage.getItem('ballColor');
    let playerColor = localStorage.getItem('playerColor');
    let textColor = localStorage.getItem('textColor');
    let tableColor = localStorage.getItem('mapColor');
    if (!tableColor) { tableColor = '#282931' }
    if (!textColor) { textColor = '#ffffff' }
    if (!playerColor) { playerColor = '#ffffff' }
    if (!ballColor) { ballColor = '#ffffff' }
    if (!username) { username = 'player1' }
    const angleRange = Math.PI / 2;
    const baseAngle = Math.random() < 0.5 ? Math.PI : 0;
    const randomAngle = baseAngle + (Math.random() * angleRange - angleRange / 2);
    if (gamemode === 'pvp') {
        const player1 = new Player(30, y, playerColor, 10, 100, 5, username, false)
        const player2 = new Player(canvas.width - 30, y, playerColor, 10, 100, 5, username2, false)
        const ball = new Ball(x, y, 10, ballColor, { x: 3 * Math.cos(randomAngle), y: 3 * Math.sin(randomAngle) }, 2)
        const table = new Table(0, 0, canvas.width, canvas.height, tableColor, textColor)
        return { player1, player2, ball, table }
    }
    else if (gamemode === 'vsa') {
        const player1 = new Player(30, y, playerColor, 10, 100, 5, username, false)
        const player2 = new Player(canvas.width - 30, y, playerColor, 10, 100, 5, 'AI', true)
        const ball = new Ball(x, y, 10, ballColor, { x: 3 * Math.cos(randomAngle), y: 3 * Math.sin(randomAngle) }, 2)
        const table = new Table(0, 0, canvas.width, canvas.height, tableColor, textColor)
        return { player1, player2, ball, table }
    }
    else if (gamemode === 'tour') {
        const player1 = new Player(30, y, playerColor, 10, 100, 5, 'player1', false)
        const player2 = new Player(canvas.width - 30, y, playerColor, 10, 100, 5, 'player2', false)
        const ball = new Ball(x, y, 10, ballColor, { x: 3 * Math.cos(randomAngle), y: 3 * Math.sin(randomAngle) }, 2)
        const table = new Table(0, 0, canvas.width, canvas.height, tableColor, textColor)
        return { player1, player2, ball, table }
    }
}

class PowerUp {
    constructor() {
        const margin = 50;
        this.x = margin + Math.random() * (canvas.width - 2 * margin);
        this.y = margin + Math.random() * (canvas.height - 2 * margin);
        this.size = 50;
        this.color = 'red';
        this.isVisible = true;
    }

    draw() {
        if (this.isVisible && powerUpImage.complete && isPowerUp === 'true') {
            ctx.drawImage(powerUpImage, this.x, this.y, this.size, this.size);
        }
    }
    collision(ball) {
        const distX = Math.abs(ball.x - this.x - this.size / 2);
        const distY = Math.abs(ball.y - this.y - this.size / 2);

        if (distX > (this.size / 2 + ball.radius) || distY > (this.size / 2 + ball.radius)) {
            return false;
        }

        if (distX <= (this.size / 2) || distY <= (this.size / 2)) {
            this.isVisible = false;
            return true;
        }

        const dx = distX - this.size / 2;
        const dy = distY - this.size / 2;
        return (dx * dx + dy * dy <= (ball.radius * ball.radius));
    }
    update() {
        this.draw();
    }
}

let powerUp = new PowerUp();

function predictBallYAtX(targetX) {
    let predictedX = game.ball.x + game.ball.radius;
    let predictedY = game.ball.y + game.ball.radius;
    let velocityX = game.ball.velocity.x;
    let velocityY = game.ball.velocity.y;
    const predictionInterval = 1000;
    const boardHeight = canvas.height;

    while (predictedX < targetX) {
        predictedX += velocityX * (predictionInterval / 1000);
        predictedY += velocityY * (predictionInterval / 1000);

        if (predictedY - game.ball.height / 2 <= 0 || predictedY + game.ball.height / 2 >= boardHeight) {
            velocityY *= -1;
        }
        if (predictedX <= 0) {
            break;
        }
    }
    return predictedY;
}


function moveAI() {
    if (getACookie('game_running') === 'false') {
        return;
    }
    if (game.player2.isAi) {
        if (game.ball.x > canvas.width / 2) {
            const predictedY = predictBallYAtX(game.player2.x);
            if (predictedY > game.player2.y + game.player2.height / 2 && game.player2.y < canvas.height - game.player2.height) {
                keys['40'] = true; // DOWN
                keys['38'] = false; // UP
            } else if (predictedY < game.player2.y + game.player2.height / 2 && game.player2.y > 0) {
                keys['38'] = true; // UP
                keys['40'] = false; // DOWN
            } else {
                keys['38'] = false; // UP
                keys['40'] = false; // DOWN
            }
        } else {
            keys['38'] = false; // UP
            keys['40'] = false; // DOWN
        }
    }
}


function movePlayers() {
    if (getACookie('game_running') === 'false') {
        return;
    }
    moveAI();
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
    // if (keys['32']) { // SPACE
    //     // PRESS SPACE if you want to make a user won (debug purpose)
    //     console.log("SPACE PRESSED")
    //     game.player1.score = 5
    // }
}

async function moveBall() {
    if (game.ball.y + game.ball.radius > canvas.height || game.ball.y - game.ball.radius < 0) {
        playSound(collisionSound_PING);
        game.ball.velocity.y = -game.ball.velocity.y
    }
    if (game.ball.x + game.ball.radius > canvas.width || game.ball.x - game.ball.radius < 0) {
        let player_win = 0;
        playSound(pointSound);
        if (game.ball.x + game.ball.radius > game.player2.x) {
            hitEffect();
            player_win = 1;
            game.player1.score += 1
            shoot(3)
            powerUp = new PowerUp();
        } else if (game.ball.x - game.ball.radius < game.player1.x + game.player1.width) {
            hitEffect();
            player_win = 2;
            game.player2.score += 1
            shoot(2);
            powerUp = new PowerUp();
        }
        const angleRange = Math.PI / 2;
        const baseAngle = player_win === 1 ? Math.PI : 0;
        const randomAngle = baseAngle + (Math.random() * angleRange - angleRange / 2);
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.ball.velocity.x = 3 * Math.cos(randomAngle);
        game.ball.velocity.y = 3 * Math.sin(randomAngle);
        player_win = 0;
        first_hit = 0;
        game.ball.speed = 2;
    }

    if (game.ball.x + game.ball.radius > game.player2.x && game.ball.y > game.player2.y && game.ball.y < game.player2.y + game.player2.height) {
        if (first_hit === 0) {
            game.ball.speed += 3;
            first_hit = 1;
        }
        else if (first_hit === 1 && game.ball.speed < 6) {
            game.ball.speed += 0.2;
        }
        game.ball.velocity.x = -game.ball.velocity.x
        playSound(collisionSound_PONG);
    }
    if (game.ball.x - game.ball.radius < game.player1.x + game.player1.width && game.ball.y > game.player1.y && game.ball.y < game.player1.y + game.player1.height) {
        if (first_hit === 0) {
            game.ball.speed += 3;
            first_hit = 1;
        }
        else if (first_hit === 1 && game.ball.speed < 8) {
            game.ball.speed += 0.2;
        }
        game.ball.velocity.x = -game.ball.velocity.x
        playSound(collisionSound_PONG);
    }

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

    if (powerUp.collision(game.ball)) {
        game.ball.speed += 2;
        powerUp = new PowerUp();
    }

    game.ball.x += game.ball.velocity.x * game.ball.speed
    game.ball.y += game.ball.velocity.y * game.ball.speed
}

function GameEnd() {
    if (game.player1.score >= 5 || game.player2.score >= 5) {
        game.ball.reset()
        keys = {};
        return true
    }
    return false
}

function getWinner(p1, p2) {
    if (p1.score >= 4) {
        return p1.name
    } else if (p2.score >= 5) {
        return p2.name
    } else {
        return null
    }
}

function linkPause(pong, resolve) {
    if (getACookie('game_running') === 'false') {
        return;
    }
    const pauseButton = document.getElementById('pause_button');
    const pause = document.querySelector('.bi-pause-fill');
    if (pauseButtonHandler) {
        pauseButton.removeEventListener('click', pauseButtonHandler);
    }
    let isPaused = false;
    pauseButtonHandler = () => {
        isPaused = !isPaused;

        if (isPaused) {
            pause.classList.remove('bi-pause-fill');
            pause.classList.add('bi-play-fill');
            cancelAnimationFrame(animationFrameId);
        } else {
            pause.classList.remove('bi-play-fill');
            pause.classList.add('bi-pause-fill');
            animationFrameId = requestAnimationFrame(() => animate(pong, resolve));
        }
    };
    pauseButton.addEventListener('click', pauseButtonHandler);
}



async function animate(pong, resolve) {
    if (getACookie('game_running') === 'false') {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        return;
    }

    if (GameEnd()) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        const scores = { p1: game.player1.score, p2: game.player2.score };
        set1v1victory(game.player1, game.player2, scores, game.player2.isAi, false);
        const winner = getWinner(game.player1, game.player2);
        game.player1.reset();
        game.player2.reset();
        playSound(victorySound);
        alert(`${winner} won!`);
        clearCanvas();
        hideElementsByClass('game');
        showElementsByClass('menu', 'flex');
        addClassToElementsByClass('menu', 'center');

        if (pauseButtonHandler) {
            const pauseButton = document.getElementById('pause_button');
            pauseButton.removeEventListener('click', pauseButtonHandler);
            pauseButtonHandler = null;
        }

        resolve(winner);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.table.update();
    game.player1.update();
    game.player2.update();
    game.ball.update();
    powerUp.update();
    animationFrameId = requestAnimationFrame(() => animate(pong, resolve));
}

// UTILS
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkKeyDown(e) {
    keys[e.keyCode] = true;
}

function checkKeyUp(e) {
    keys[e.keyCode] = false;
}

function playSound(sound) {
    sound.currentTime = 0;
    getACookie('game_running') === 'true' ? sound.play() : sound.pause();
}

window.addEventListener('keydown', checkKeyDown, false);
window.addEventListener('keyup', checkKeyUp, false);

export function startGame(gamemode, playerNames) {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    if (pauseButtonHandler) {
        const pauseButton = document.getElementById('pause_button');
        pauseButton.removeEventListener('click', pauseButtonHandler);
        pauseButtonHandler = null;
    }

    const randomNumber = Math.floor(Math.random() * 100);
    console.log('Starting game:', gamemode, " seed :", randomNumber);

    if (getACookie('game_running') === 'true') {
        playSound(coutdownSound);
        return new Promise((resolve) => {
            let count = ["3", "2", "1", "GO !"];
            let i = 0;
            const interval = setInterval(() => {
                ctx.clearRect(canvas.width / 2 - 50, canvas.height / 2 - 100, 100, 150);
                ctx.font = "50px Arial";
                ctx.fillStyle = "white";
                const textSize = ctx.measureText(count[i]).width;
                ctx.fillText(count[i], (canvas.width - textSize) / 2, canvas.height / 2);
                i++;
                if (i > 4) {
                    clearInterval(interval);
                    if (gamemode === 'pvp' || gamemode === 'vsa') {
                        const pong = new Pong(gamemode);
                        game = pong.game;
                        linkPause(pong, resolve);
                        animate(pong, resolve);
                    }
                    else if (gamemode === 'tour') {
                        const pong = new Pong(gamemode);
                        game = pong.game;
                        linkPause(pong, resolve);
                        startTournament(playerNames, resolve);
                    }
                }
            }, 700);
        });
    }
}
export function startTournament(playerNames, resolve) {
    const tournament = new Tournament(playerNames);
    tournament.startTournament(resolve);
}