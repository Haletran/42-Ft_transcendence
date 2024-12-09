import { set1v1victory } from "../src/scoreTable.js";

const canvas = document.getElementById("pong_canvas");
const ctx = canvas.getContext("2d");



// DO NOT TOUCH USEFUL STUFF HERE
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas() {
    const canvas = document.getElementById('pong_canvas');
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 200;
    updatePlayerLayout();
    resetBallPosition();
}

// EVENTS
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('keydown', checkKeyDown, false);
window.addEventListener('keyup', checkKeyUp, false);