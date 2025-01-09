import { Page } from '../src/pages.js';
import { shoot } from '../src/particles.js';
import { Router } from '../src/router.js';
import { isUserLoggedIn } from '../app.js';

export class Credit extends Page {
    constructor() {
        super();
        this.template = `
        <div class="menu">
            <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: 90vh">
                <canvas id="credits_canvas" width="1200" height="800"></canvas>
                <div class="row row-cols-1 row-cols-md-3 g-4 d-none">
                    <div class="col">
                      <div class="card hover-effect">
                        <img src="https://cdn.intra.42.fr/users/60318ee34e60d4286091eae24fd06d10/medium_dboire.jpg" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title text-center text-white" >Dboire</h5>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="card hover-effect">
                        <img src="https://cdn.intra.42.fr/users/809fbf6d5204320b9be42e760c50e69a/medium_aboulore.jpg" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title text-center text-white">Aboulore</h5>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="card hover-effect">
                        <img src="https://cdn.intra.42.fr/users/ebff1d0ec01cb508b2f711208a8b44b3/medium_bapasqui.jpg" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title text-center" style="color: white;">bapasqui</h5>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    async render() {
        const loggedIn = await isUserLoggedIn();
        if (loggedIn == false) {
            Router.goTo('/login_base');
            return;
        }
        super.render();
        this.breakout();
    }

    breakout() {
        const canvas = document.getElementById('credits_canvas');
        const ctx = canvas.getContext('2d');

        let score = 0;

        const brickRowCount = 10;
        const brickColumnCount = 4;
        const delay = 500;

        const ball = {
            x: canvas.width / 2,
            y: canvas.height / 2 + 70,
            size: 10,
            speed: 8,
            dx: 4,
            dy: -4,
            visible: true
        };

        const paddle = {
            x: canvas.width / 2 - 40,
            y: canvas.height - 20,
            w: 80,
            h: 10,
            speed: 8,
            dx: 0,
            visible: true
        };

        const brickInfo = {
            w: 100,
            h: 70,
            padding: 10,
            offsetX: 45,
            offsetY: 60,
            visible: true
        };

        const bricks = [];
        for (let i = 0; i < brickRowCount; i++) {
            bricks[i] = [];
            for (let j = 0; j < brickColumnCount; j++) {
                const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
                const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
                bricks[i][j] = { x, y, ...brickInfo };
            }
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
            ctx.fillStyle = ball.visible ? 'red' : 'transparent';
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
            ctx.fillStyle = paddle.visible ? 'white' : 'transparent';
            ctx.fill();
            ctx.closePath();
        }

        function drawScore() {
            ctx.font = '20px Arial';
            if (score === brickRowCount * brickColumnCount) {
                ctx.fillText('YOU WON!', canvas.width / 2 - 50, canvas.height / 2);
                document.querySelector('.row').classList.remove('d-none');
                document.getElementById('credits_canvas').classList.add('d-none');
                shoot(4);
            } else {
                ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
            }
        }

        const AllImages = [
            "https://cdn.intra.42.fr/users/4ea572080b176a1551da67a1574e3333/small_bapasqui.jpg",
            "https://cdn.intra.42.fr/users/408819b9ecc12459e847129d20a195df/small_dboire.jpg",
            "https://cdn.intra.42.fr/users/050587c4c1cf44513fafd788720f8b4a/small_aboulore.jpg"
        ];

        const preloadedImages = AllImages.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        function drawBricks() {
            bricks.forEach(column => {
                column.forEach((brick, index) => {
                    if (brick.visible) {
                        const brickImage = preloadedImages[index % preloadedImages.length];
                        ctx.drawImage(brickImage, brick.x, brick.y, brick.w, brick.h);
                    }
                });
            });
        }


        function movePaddle() {
            paddle.x += paddle.dx;

            if (paddle.x + paddle.w > canvas.width) {
                paddle.x = canvas.width - paddle.w;
            }

            if (paddle.x < 0) {
                paddle.x = 0;
            }
        }

        // Move ball on canvas
        function moveBall() {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
                ball.dx *= -1; // ball.dx = ball.dx * -1
            }

            if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
                ball.dy *= -1;
            }

            if (
                ball.x + ball.size > paddle.x &&
                ball.x - ball.size < paddle.x + paddle.w &&
                ball.y + ball.size > paddle.y &&
                ball.y - ball.size < paddle.y + paddle.h
            ) {
                ball.dy = -ball.speed;
            }

            // Brick collision
            bricks.forEach(column => {
                column.forEach(brick => {
                    if (brick.visible) {
                        if (
                            ball.x - ball.size > brick.x && // left brick side check
                            ball.x + ball.size < brick.x + brick.w && // right brick side check
                            ball.y + ball.size > brick.y && // top brick side check
                            ball.y - ball.size < brick.y + brick.h // bottom brick side check
                        ) {
                            ball.dy *= -1;
                            brick.visible = false;

                            increaseScore();
                        }
                    }
                });
            });
        }

        function increaseScore() {
            score++;

            if (score % (brickRowCount * brickColumnCount) === 0) {

                ball.visible = false;
                paddle.visible = false;

                setTimeout(function () {
                    showAllBricks();
                    score = 0;
                    paddle.x = canvas.width / 2 - 40;
                    paddle.y = canvas.height - 20;
                    ball.x = canvas.width / 2;
                    ball.y = canvas.height / 2;
                    ball.visible = true;
                    paddle.visible = true;
                }, delay)
            }
        }

        function showAllBricks() {
            bricks.forEach(column => {
                column.forEach(brick => (brick.visible = true));
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawBall();
            drawPaddle();
            drawScore();
            drawBricks();
        }

        function update() {
            movePaddle();
            moveBall();
            draw();
            requestAnimationFrame(update);
        }

        update();

        function keyDown(e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                paddle.dx = paddle.speed;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                paddle.dx = -paddle.speed;
            }
        }

        // Keyup event
        function keyUp(e) {
            if (
                e.key === 'Right' ||
                e.key === 'ArrowRight' ||
                e.key === 'Left' ||
                e.key === 'ArrowLeft'
            ) {
                paddle.dx = 0;
            }
        }

        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
    }
}