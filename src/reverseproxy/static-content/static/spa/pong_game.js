// SETUP CANVAS
import { addClassToElementsByClass, hideElementsByClass, showElementsByClass, setACookie, getACookie } from '../js/utils.js';
import { set1v1victory } from '../src/scoreTable.js';
import { interactWithContract } from '../js/interact.js'
import { getProfileUsername } from '../src/fetchUser.js';
import { shoot } from '../src/particles.js';


let canvas = document.querySelector('canvas');
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

// VARIABLES
canvas.width = innerWidth - 400
canvas.height = innerHeight - 200
let keys = {};
let first_hit = 0;
let animationFrameId;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
                if (GameEnd()) {
                    const scores = { p1: game.player1.score, p2: game.player2.score };
                    set1v1victory(game.player1, game.player2, scores, false, true);
                    const winner = getWinner(game.player1, game.player2);
                    // const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
                    // interactWithContract(contractAddress, game.player1.name, game.player1.score, game.player2.name, game.player2.score); To see with Baptiste on how to implement it
                    resolve(winner === game.player1.name ? player1 : player2);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    game.table.update();
                    game.player1.update();
                    game.player2.update();
                    game.ball.update();
                    requestAnimationFrame(matchLoop);
                }
            };
            matchLoop();
        });
    }

    async startTournament(resolve) {
        // Tournament progression
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
        shoot();
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
        const player2 = new Player(canvas.width - 30, y, playerColor, 10, 100, 5, 'player2', false)
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

function movePlayers() {
    if (getACookie('game_running') === 'false') {
        return;
    }

    if (game.player2.isAi) {
        console.log("X / Y / playerx / playery : ", game.ball.x, game.ball.y, game.player2.x, game.player2.y)
        if (game.ball.x > canvas.width / 2) {
            if (game.ball.y > game.player2.y + game.player2.height / 2 && game.player2.y < canvas.height - game.player2.height) {
                keys['40'] = true; // DOWN
                keys['38'] = false; // UP
            } else if (game.ball.y < game.player2.y + game.player2.height / 2 && game.player2.y > 0) {
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

    if (game.player1.isAi) {
        if (game.ball.x < canvas.width / 2) {
            if (game.ball.y > game.player1.y + game.player1.height / 2 && game.player1.y < canvas.height - game.player1.height) {
                keys['83'] = true; // S
                keys['87'] = false; // W
            } else if (game.ball.y < game.player1.y + game.player1.height / 2 && game.player1.y > 0) {
                keys['87'] = true; // W
                keys['83'] = false; // S
            } else {
                keys['87'] = false; // W
                keys['83'] = false; // S
            }
        } else {
            keys['87'] = false; // W
            keys['83'] = false; // S
        }
    }


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
    if (keys['32']) { // SPACE
        // PRESS SPACE if you want to make a user won (debug purpose)
        console.log("SPACE PRESSED")
        game.player1.score = 5
    }
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
            setTimeout(shoot(3), 100);
        } else if (game.ball.x - game.ball.radius < game.player1.x + game.player1.width) {
            hitEffect();
            player_win = 2;
            game.player2.score += 1
            setTimeout(shoot(2), 100);
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
        else if (first_hit === 1 && game.ball.speed < 6) {
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
    let value = 0;
    const pauseButton = document.getElementById('pause_button')
    const pause = document.querySelector('.bi-pause-fill');
    pauseButton.addEventListener('click', () => {
        if (value % 2 == 0) {
            pause.classList.remove('bi-pause-fill');
            pause.classList.add('bi-play-fill');
            cancelAnimationFrame(animationFrameId)
        }
        else {
            pause.classList.remove('bi-play-fill');
            pause.classList.add('bi-pause-fill');
            animationFrameId = requestAnimationFrame(() => animate(pong, resolve))
        }
        value += 1
    })
}

async function animate(pong, resolve) {
    if (getACookie('game_running') === 'false') {
        return;
    }

    if (GameEnd()) {
        const scores = { p1: game.player1.score, p2: game.player2.score };
        set1v1victory(game.player1, game.player2, scores, game.player2.isAi, false);
        const winner = getWinner(game.player1, game.player2);
        game.player1.reset()
        game.player2.reset()
        playSound(victorySound);
        alert(`${winner} won!`);
        cancelAnimationFrame(animationFrameId);
        clearCanvas();
        hideElementsByClass('game');
        showElementsByClass('menu', 'flex');
        addClassToElementsByClass('menu', 'center');
        resolve(winner);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.table.update()
    game.player1.update()
    game.player2.update()
    game.ball.update()
    animationFrameId = requestAnimationFrame(() => animate(pong, resolve))
    console.log("Game is running, the SCORE is (1/2): ", game.player1.score, game.player2.score)
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

async function pauseGame(value) {
    setACookie('game_running', 'false', 1);
    await sleep(value);
    setACookie('game_running', 'true', 1);
}

function playSound(sound) {
    sound.currentTime = 0;
    getACookie('game_running') === 'true' ? sound.play() : sound.pause();
}

window.addEventListener('keydown', checkKeyDown, false);
window.addEventListener('keyup', checkKeyUp, false);

export function startGame(gamemode, playerNames) {
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
                    if (gamemode === 'pvp') {
                        const pong = new Pong(gamemode);
                        game = pong.game;
                        linkPause(pong, resolve);
                        animate(pong, resolve);
                    }
                    else if (gamemode === 'vsa') {
                        const pong = new Pong(gamemode);
                        game = pong.game;
                        linkPause(pong, resolve);
                        animate(pong, resolve);
                    }
                    else if (gamemode === 'tour') {
                        const pong = new Pong(gamemode);
                        game = pong.game;
                        startTournament(playerNames, resolve);
                    }
                }
            }, 700);
        });
    }
}

export function startTournament(playerNames, resolve) {
    // might need to check if there is the correct nb of players and if there have a name
    const tournament = new Tournament(playerNames);
    tournament.startTournament(resolve);
}