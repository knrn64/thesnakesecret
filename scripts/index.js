const startscreen = document.querySelector(".startscreen");
const canvas = document.getElementById("game");
const youlostscreen = document.querySelector(".youlostscreen");
const ctx = canvas.getContext("2d");

let failSound;
let eatSound;
let bgmMusic;

const ground = new Image();
ground.src = "img/background.gif";

const headImg = new Image();
headImg.src = "img/head-front.gif";

const foodImg = new Image();
foodImg.src = "img/food.gif";

// const bananaImg = new Image();
// bananaImg.src = "img/banana.gif";

// const gumImg = new Image();
// gumImg.src = "img/gum.gif";

// const cherryImg = new Image();
// cherryImg.src = "img/cherry.gif";

// const peachImg = new Image();
// peachImg.src = "img/peach.gif";

// const foodArray = ["bananaImg", "gumImg", "cherryImg", "peachImg"];

//let randomFoodImg = foodArray[Math.floor(Math.random() * foodArray.length)];

let box = 22;

let score = 0;

let food = {
    x: Math.floor((Math.random() * 17 + 1)) * box, // почему не работает Math.random() * (max - min)
    y: Math.floor((Math.random() * 15 + 3)) * box,
};

let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

let dir;

let game_speed = 100;

class sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "none");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        };
        this.stopSound = function () {
            this.sound.pause();
            this.sound.currentTime = 0;
        };
    }
}

failSound = new sound("audio/fail-sound.mp3");
eatSound = new sound("audio/eat-sound.mp3");
bgmMusic = new sound("audio/bgm-music.mp3");

function startGame(e) {
    if (e.key === 'Enter') {
        startscreen.style.display = "none";
        canvas.style.display = "block";

        bgmMusic.volume = "0.1";
        bgmMusic.play();
        bgmMusic.sound.setAttribute("loop", "");
        //bgmMusic.sound.setAttribute("volume", "0.1");

        document.removeEventListener('keypress', startGame);
    };
}

document.addEventListener('keypress', startGame);

function changeDirection(event) {
    if (event.key === "ArrowLeft" && dir != "right")
        dir = "left";
    else if (event.key === "ArrowUp" && dir != "down")
        dir = "up";
    else if (event.key === "ArrowRight" && dir != "left")
        dir = "right";
    else if (event.key === "ArrowDown" && dir != "up")
        dir = "down";
}

document.addEventListener("keydown", changeDirection);

function generateRandomColor() {
    return "#" +
        (Math.floor(Math.random() * 0x1000000) + 0x1000000)
            .toString(16)
            .substr(1);
}

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            restart();
            //youlostscreen.style.display = "block";
        }
    }
}

function drawGame() {
    ctx.drawImage(ground, 0, 0, 418, 418);

    ctx.drawImage(foodImg, food.x, food.y);

    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Score: " + score, box * 1, 40);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    for (let i = 0; i < snake.length; i++) {
        // ctx.fillStyle = i == 0 ? "green" : "red";
        if (i == 0) {
            ctx.drawImage(headImg, snakeX, snakeY);
        }
        else if (i !== 0) {

            drawBorder(snake[i].x, snake[i].y, box, box)

            function drawBorder(xPos, yPos, width, height, thickness = 1) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
            }
            
            ctx.fillStyle = generateRandomColor();
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }
    }

    if (snakeX == food.x && snakeY == food.y) {
        eatSound.play();
        score++;
		game_speed--;
        food = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        };
    } else
        snake.pop();

    if (snakeX < box || snakeX > box * 17
        || snakeY < 3 * box || snakeY > box * 17) {
        //youlostscreen.style.display = "block";
        restart()
    }

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    eatTail(newHead, snake);

    snake.unshift(newHead);
}

function restart() {
	game_speed = 100;

	alert("your score: " + score);
    failSound.play();

    //console.log("function has been executed");

    score = 0;
    dir = "";

    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };

    food = {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box,
    };

    ctx.clearRect(0, 0, canvas.context.width, canvas.context.height);
    clearInterval(game);

// тут наверное можно показвыать you lost экран, потом по enter вызывать drawGame()

    drawGame();
}

let game = setInterval(drawGame, game_speed);