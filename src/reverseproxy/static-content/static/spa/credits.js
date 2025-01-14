import { Page } from '../src/pages.js';
import { shoot } from '../src/particles.js';
import { Router } from '../src/router.js';
import { isUserLoggedIn } from '../app.js';
import { getACookie, setACookie } from '../js/utils.js';
import { fetchMinInfo, subscribeToProfilePicture } from '../src/UserStore.js';
import { logoutUser } from '../src/logout.js';

export class Credit extends Page {
    constructor() {
        super();
        this.template = `
        <div class="header">
        <nav class="navbar bg-dark  border-body" data-bs-theme="dark">
            <div class="container-fluid">
            <a class="navbar-brand " href="/home" data-link="/home">
                <img src="/static/imgs/logo.png" alt="" width="25" class="d-inline-block align-text-top invert">
                <p class="d-inline montserrat-bold">Ft_transcendence</p>
            </a>
            <a class="nav-link active" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img alt="logo_profile_picture" width="40" height="40" class="rounded-circle" style="
                      object-fit: cover;
                    " src=""
                alt="profile_picture" />
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                <a class="dropdown-item" href="/profile" data-link="/profile">Profile</a>
                </li>
                <li>
                <a class="dropdown-item" href="/settings" data-link="/settings" >Settings</a>
                </li>
                <li>
                <a class="dropdown-item" href="/friends" data-link="/friends" >Friends</a>
                </li>
                <li>
                <a class="dropdown-item" href="/privacy" data-link="/privacy" >Privacy</a>
                </li>
                <li>
                <a class="dropdown-item fw-bold text-danger" href="/" data-link="/" id="logout-butt"><i class="bi bi-box-arrow-left"></i> Logout</a>
                </li>
            </ul>
            </div>
        </nav>
        </div>
        <div class="menu">
            <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: 90vh">
                <canvas id="credits_canvas" width="800" height="600"></canvas>
                <div class="row row-cols-1 row-cols-md-3 g-4 d-none">
                    <div id="dboire" class="col">
                      <div class="card hover-effect">
                        <img src="https://cdn.intra.42.fr/users/60318ee34e60d4286091eae24fd06d10/medium_dboire.jpg" class="card-img-top" alt="dboire">
                        <div class="card-body">
                            <h5 class="card-title text-center text-white">dboire</h5>
                        </div>
                      </div>
                    </div>
                    <div id="aboulore" class="col">
                      <div class="card hover-effect">
                        <img src="https://cdn.intra.42.fr/users/809fbf6d5204320b9be42e760c50e69a/medium_aboulore.jpg" class="card-img-top" alt="aboulore">
                        <div class="card-body">
                            <h5 class="card-title text-center text-white">aboulore</h5>
                        </div>
                      </div>
                    </div>
                    <div id="bapasqui" class="col">
                      <div class="card hover-effect">
                        <img src="https://cdn.intra.42.fr/users/ebff1d0ec01cb508b2f711208a8b44b3/medium_bapasqui.jpg" class="card-img-top" alt="bapasqui">
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
        const loggedIn = isUserLoggedIn();
        if (loggedIn == false) {
            Router.goTo('/login_base');
            return;
        }
        setACookie('game_running', 'false', 1);
        setACookie('credits', 'true', 1);
        fetchMinInfo();
        const unsubscribe = subscribeToProfilePicture((profilePictureUrl) => {
            const profilePic = document.querySelector('img[alt="logo_profile_picture"]');
            if (profilePic) profilePic.src = profilePictureUrl;
        });
        super.render();
        this.event();
        this.breakout();

        const logoutButton = document.getElementById('logout-butt');
        if (logoutButton) {
            logoutButton.addEventListener('click', function (event) {
                unsubscribe();
                logoutUser();
            });
        }
    }


    event() {
        const maker = ["dboire", "aboulore", "bapasqui"];
        for (let i = 0; i < maker.length; i++) {
            document.getElementById(maker[i]).addEventListener('click', () => {
                window.open(`https://profile.intra.42.fr/users/${maker[i]}`, '_blank');
            });
        }
    }
    breakout() {
        const canvas = document.getElementById('credits_canvas');
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');

        let score = 0;

        const brickRowCount = 7;
        const brickColumnCount = 4;
        const delay = 500;
        let start = false;

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
            ctx.fillStyle = ball.visible ? 'white' : 'transparent';
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
                const rowElement = document.querySelector('.row');
                const canvasElement = document.getElementById('credits_canvas');
                if (rowElement && canvasElement) {
                    rowElement.classList.remove('d-none');
                    canvasElement.classList.add('d-none');
                }
                shoot(4);
                setACookie('credits', 'false', 1);
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

            bricks.forEach(column => {
                column.forEach(brick => {
                    if (brick.visible) {
                        if (
                            ball.x - ball.size > brick.x &&
                            ball.x + ball.size < brick.x + brick.w &&
                            ball.y + ball.size > brick.y &&
                            ball.y - ball.size < brick.y + brick.h
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

        function startScreen() {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText('Press Enter to start', canvas.width / 2 - 100, canvas.height / 2);
        }

        function update() {
            if (getACookie('credits') == 'false') {
                return;
            }
            if (start) {
                console.log(getACookie('credits'));
                movePaddle();
                moveBall();
                draw();
                requestAnimationFrame(update);
            } else {
                startScreen();
            }
        }

        update();

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                start = true;
                requestAnimationFrame(update);
            }
        });

        function keyDown(e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                paddle.dx = paddle.speed;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                paddle.dx = -paddle.speed;
            }
        }

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