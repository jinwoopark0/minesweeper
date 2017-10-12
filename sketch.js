let ROWS = 13;
let COLS = 20;
let grid;
let numMines = 50;
let CANVAS_X = 800;
let CANVAS_Y = 520;
let px = CANVAS_X / COLS;
let py = CANVAS_Y / ROWS;
let minesLeft;
let mineDiv;
let minesNotRevealed;
let firstClick;
let startTime;
let endTime;
let timeDiv;
let gameFinished;
let gameNotStarted;

function makeGrid() {
    grid = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
        grid[i] = new Array(COLS);
    }
}

function initGrid() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = new Cell(i, j, px, py);
        }
    }
}

//randomly generate mines
function putMines(fi, fj) {
    let poss = new Array();
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            poss.push([i, j]);
        }
    }
    
    poss.splice(fi*COLS+fj, 1);

    for (let n = 0; n < numMines; n++) {
        let choice = random(poss);
        let i = choice[0];
        let j = choice[1];
        grid[i][j].mine = true;
        poss.splice(poss.indexOf(choice), 1);
    }
}

//calculates the numbers
function countMines() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j].countMinesNeighbour();
        }
    }
}

function startOver() {
    removeElements();
    setup();
}

function gameOver(result) {
    endTime = millis();
    gameFinished = true;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j].flagged = false;
            grid[i][j].revealed = true;
        }
    }

    if (result === "win") {
        let gameOverDiv = createDiv("YOU WON");
        let startOverButton = createButton("PLAY AGAIN");
        
        startOverButton.mousePressed(startOver);
    } else {
        let gameOverDiv = createDiv("YOU LOSE");
        let startOverButton = createButton("Start Over");
        startOverButton.mousePressed(startOver);
    }  
}

//check for solved
function checkWin() {
    minesNotRevealed = 0;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!grid[i][j].revealed) {
                minesNotRevealed++;
            }
        }
    }
    if (minesNotRevealed === numMines) {
        gameOver("win");
    }
}

function somethingPressed() {
    let j = floor(mouseX / px);
    let i = floor(mouseY / py);

    if (0 <= i && i < ROWS && 0 <= j && j < COLS) {
        if (key == 'Q' || mouseButton == LEFT) {
            console.log("LEFT");
            if (firstClick) {
                firstClick = false;
                putMines(i, j);
                countMines(); //generate mines and numbers after first click

                startTime = millis(); //counter
                gameNotStarted = false;
            }
            if (!gameFinished) {
                grid[i][j].reveal();
            }         
        } else if (key == 'W' || mouseButton == RIGHT) {
            console.log("RIGHT");
            flag_state = grid[i][j].flag();             // -1 -> invalid, 0 -> successfully unflagged, 1 -> successfully flagged
            if (flag_state === 0) {
                minesLeft++;
            }
            if (flag_state === 1) {
                minesLeft--;
            }
            mineDiv.html("Mines Remaining: ");
            mineDiv.html(minesLeft, true);
        }            
    }
    checkWin();
}

function mousePressed() {
    somethingPressed(); 
}

function keyPressed() {
    somethingPressed(); 
}

function setup() {
    createCanvas(CANVAS_X+1, CANVAS_Y+1);
    frameRate(60);
    makeGrid();
    initGrid();
    //putMines();
    //countMines();

    document.addEventListener('contextmenu', event => event.preventDefault());

    minesLeft = numMines;
    mineDiv = createDiv("Mines Remaining: ");
    mineDiv.html(numMines, true);
    minesNotRevealed = 0;

    timeDiv = createDiv(0);

    firstClick = true;

    gameNotStarted = true;
    gameFinished = false;
}

function draw() {
    background(255);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j].show();
        }
    }

    if (gameNotStarted) {
        timeDiv.html(0);
    } else if (gameFinished) {
        timeDiv.html((endTime - startTime) / 1000);
    }
    else {
        timeDiv.html((millis() - startTime) / 1000);
    }    
    mineDiv.show();
    timeDiv.show();
}