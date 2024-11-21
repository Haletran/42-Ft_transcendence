function start_game() {
    let ball = document.getElementById("circle");
    ball.style.position = "absolute"; // Ensure the ball is positioned absolutely
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let randomX = Math.floor(Math.random() * (windowWidth - 120)); // Random horizontal position
    let randomY = Math.floor(Math.random() * (windowHeight - 120)); // Random vertical position
    ball.style.left = randomX + "px"; // Set the horizontal position
    ball.style.top = randomY + "px"; // Set the vertical position
}
let dx = 2; // Horizontal velocity
let dy = 2; // Vertical velocity

function move_ball() {
    let ball = document.getElementById("circle");
    let x = parseInt(ball.style.left);
    let y = parseInt(ball.style.top);
    let ballWidth = ball.offsetWidth;
    let ballHeight = ball.offsetHeight;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Check for collision with the borders
    if (x + dx > windowWidth - ballWidth || x + dx < 0) {
        dx = -dx; // Reverse horizontal direction
    }
    if (y + dy > windowHeight - ballHeight || y + dy < 0) {
        dy = -dy; // Reverse vertical direction
    }

    // Update ball position
    ball.style.left = x + dx + "px";
    ball.style.top = y + dy + "px";
}
// Move the ball every 10 milliseconds
setInterval(move_ball, 10);

window.onload = start_game;