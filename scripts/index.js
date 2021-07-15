// Логика старт скрина

const startscreen = document.querySelector(".startscreen");
const canvas = document.getElementById("game");
const youlostscreen = document.querySelector(".youlostscreen");

// function startGame(e) {
//     if (e.key === 'Enter') {
//         startscreen.style.display = "none";
//         canvas.style.display = "block";
//     };
// }

// document.addEventListener('keypress', startGame);

//const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground-test3.png";

const foodImg = new Image();
foodImg.src = "img/food.gif";

const headImg = new Image();
headImg.src = "img/head-front.gif";

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

document.addEventListener("keydown", changeDirection);

let dir;

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

function generateRandomColor() {
    return "#" +
        (Math.floor(Math.random() * 0x1000000) + 0x1000000)
            .toString(16)
            .substr(1);
}

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            console.log("GAME OVER");
            clearInterval(game);
            youlostscreen.style.display = "block";

        }
    }
}

function drawGame() {
    ctx.drawImage(ground, 0, 0, 418, 418);

    ctx.drawImage(foodImg, food.x, food.y);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, box * 2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    for (let i = 0; i < snake.length; i++) {
        // ctx.fillStyle = i == 0 ? "green" : "red";
        if (i == 0) {
            ctx.drawImage(headImg, snakeX, snakeY);
        }
        else if (i !== 0) {
            ctx.fillStyle = generateRandomColor();
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }
    }

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            // сюда добавить генерацию случайной еды? выбор еды из массива
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        };
    } else
        snake.pop();

    if (snakeX < box || snakeX > box * 17
        || snakeY < 3 * box || snakeY > box * 17) {
        console.log("GAME OVER");

        //clearInterval(game);
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
    score = 0;

    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };

    dir = "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(game);

// тут наверное можно показвыать you lost экран, потом по enter вызывать drawGame()

    drawGame();
}


let game = setInterval(drawGame, 100);