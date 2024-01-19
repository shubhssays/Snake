//html variables
const board = document.getElementById("board");
const gamePoint = document.getElementById("game-point");
const instructions = document.getElementsByClassName("instructions")[0];
const instructionText = document.getElementById("instruction-text");
const gameScoreText = document.getElementById("game-score");

//global variables
const componentType = {
    SNAKE: "snake",
    FOOD: "food"
}
const defaultInstructionText = "Press Space or Double-click To Start";
const defaultGameOverText = "Game Over";
let foodPosition;
let snakes = [{ "x": 24, "y": 9 }]

const allDirections = {
    UP: "up",
    DOWN: "down",
    RIGHT: "right",
    LEFT: "left"
}

const gameState = {
    STARTED: "started",
    OVER: "over",
    NOT_STARTED: "not_started"
}

let currentGameState = gameState.NOT_STARTED;
let isFoodEaten = false;
let gameLapse;
let gameSpeed = 190;
let currentIterator = 0;
let secondIterator = Math.floor(5000 / gameSpeed);
let direction = allDirections.RIGHT;
let currentScore = 0;

// function to add any food or snake component in game board
function addComponent(component, coordinates) {
    const div = document.createElement("div");
    div.className = component;
    div.style.gridColumn = coordinates.x;
    div.style.gridRow = coordinates.y;
    board.appendChild(div)
}

//generate random position for food
function generateFood() {
    let x, y;
    let overlapsWithSnake = false;
    do {
        x = Math.floor(Math.random() * 50) + 1;
        y = Math.floor(Math.random() * 50) + 1;
        // Check if the new coordinates overlap with the snake
        for (let s of snakes) {
            if (s.x === x && s.y === y) {
                overlapsWithSnake = true;
                break;
            }
        }
    } while (overlapsWithSnake);
    return { x, y };
}

// to generate the food at random position in board
function drawFood(coordinates = null) {
    if (!coordinates) {
        foodPosition = generateFood();
    }
    addComponent(componentType.FOOD, foodPosition);
}

// to generate the snake in board
function drawSnake() {
    board.innerHTML = '';
    if (isFoodEaten) {
        isFoodEaten = false;
        foodPosition = generateFood();
        drawFood(foodPosition);
    } else {
        drawFood(foodPosition);
    }
    for (let s of snakes) {
        addComponent(componentType.SNAKE, s);
    }
}

// to move the snake in board
function moveSnake() {
    currentIterator++;
    if (currentIterator > secondIterator) {
        currentIterator = 0;
        clearInterval(gameLapse);
        gameLapse = setInterval(function () {
            moveSnake();
        }, gameSpeed--);
    }
    const snakeHead = { ...snakes[0] };
    let x = snakeHead.x;
    let y = snakeHead.y;

    switch (direction) {
        case allDirections.UP:
            y--;
            break;
        case allDirections.DOWN:
            y++;
            break;
        case allDirections.LEFT:
            x--;
            break;
        case allDirections.RIGHT:
            x++;
            break;
    }
    if (x > 50) {
        x = 1;
    } else if (x < 1) {
        x = 50;
    }

    if (y > 50) {
        y = 1;
    } else if (y < 1) {
        y = 50;
    }

    snakes.unshift({ x, y });
    if (snakeHead.x == foodPosition.x && snakeHead.y == foodPosition.y) {
        isFoodEaten = true;
        updateScore();
        currentIterator = secondIterator;
    } else {
        snakes.pop();
    }
    for (let s = 1; s < snakes.length; s++) {
        if (x == snakes[s].x && y == snakes[s].y) {
            gameOver();
            break;
        }
    }
    drawSnake();
}

//function to start game
function startGame() {
    if (currentGameState == gameState.STARTED) {
        alert("game is already started");
        return
    } else if (currentGameState == gameState.OVER) {
        resetGame();
    }
    currentGameState = gameState.STARTED;
    drawFood();
    gameLapse = setInterval(function () {
        moveSnake();
    }, gameSpeed);
    instructions.style.display = 'none';
}

// function to end game
function gameOver() {
    currentGameState = gameState.OVER;
    if (gameLapse) {
        clearInterval(gameLapse);
    }
    updateScore();
    board.innerHTML = "";
    instructionText.innerHTML = defaultGameOverText;
    gameScoreText.innerText = `Your score - ${currentScore}. ` + defaultInstructionText
    instructions.style.display = 'flex'
}

//function to reset game and restore all the game variables
function resetGame() {
    gameScoreText.innerText = '';
    board.innerHTML = "";
    currentGameState = gameState.NOT_STARTED;
    isFoodEaten = false;
    if (gameLapse) {
        clearInterval(gameLapse);
    }
    snakes = [{ x: 10, y: 12 }];
    direction = allDirections.RIGHT;
    gameSpeed = 250;
    currentIterator = 0;
    currentScore = 0;
    gamePoint.innerText = currentScore.toString().padStart(4,"0");
    instructions.style.display = 'flex';
    gameScoreText.innerText = "";
    instructionText.innerText = defaultInstructionText;
}

//function to update score by 1
function updateScore() {
    currentScore = snakes.length - 1;
    gamePoint.innerText = currentScore.toString().padStart(4, "0")
}

board.addEventListener('dblclick', function () {
    startGame();
});

function handleKeypress(event) {
    if (event.key === ' ' || event.keyCode === 32) {
        startGame();
        return;
    }

    // Check for arrow key presses
    switch (event.key) {
        case 'ArrowUp':
            if (direction == allDirections.DOWN) {
                return;
            }
            direction = allDirections.UP;
            break;
        case 'ArrowDown':
            if (direction == allDirections.UP) {
                return;
            }
            direction = allDirections.DOWN;
            break;
        case 'ArrowLeft':
            if (direction == allDirections.RIGHT) {
                return;
            }
            direction = allDirections.LEFT;
            break;
        case 'ArrowRight':
            if (direction == allDirections.LEFT) {
                return;
            }
            direction = allDirections.RIGHT;
            break;
    }
}

document.addEventListener('keydown', handleKeypress);
