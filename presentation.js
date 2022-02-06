const board = document.getElementById(`board`);
const start_btn = document.getElementById(`start-btn`);
const game_info = document.getElementById(`game-info`);
const close_btn = document.getElementById(`close-btn`);
const again_btn = document.getElementById(`play-again-btn`);
const game_level = document.getElementById(`game-level`);
document.addEventListener('keydown', keyboardArrows);

const cls = {
    head: `head`,
    tail: `tail`,
    blank: `blank`,
    rat: `rat`,
    wall: `wall`
}
const endReason = {
    lose: {
        main: `GAME OVER`,
        p: `play again?`
    },
    winLvl: {
        main: `Amazing!`,
        p: `go to next level?`
    },
    winGame: {
        main: `GAME OVER`,
        p: `you are a snake master! <br> start over?`
    },
    reasons: {
        lose: `lose`,
        winLvl: `winLvl`,
        winGame: `winGame`
    }
}

const game_settings = {
    row: 8, // best not touch
    col: 11, // best 10-15
    snakeHead_init: [3,0],// set snake initial position/length
    snakeTail_init: [[2,0],[1,0],[0,0]],
    tempo: 600, //initial interval rate
    tempoRatio: 15, // every  rat eatten => snake tempo increase by 1/tempoRatio 
    total_levels: 3,
    wall: []
};

gameBoard(game_settings);
start_btn.addEventListener(`click`,startGame,{once: true});

function startGame(){
    lvl++;
    game_level.innerHTML = `LEVEL ${lvl}`;
    copyInitSnkPos();
    tempo = game_settings.tempo;
    gameBoard(game_settings);
    ratCounter = 0;
    snakeDirection = "down";
    setRat();
    snakeInterval = setInterval(movesnake,tempo);
}

function level(){
    
    function level1(){
        game_settings.wall = [];
        game_settings.goal = 10;
    }
    function level2(){
        game_settings.wall = setWall().centerBlock();
        game_settings.goal = 10;
    }
    function level3(){
        game_settings.wall = setWall().centerLine();
        game_settings.goal = 10;
    }
    
    return {
        level1: level1,
        level2: level2,
        level3: level3
    }
}

function closeMessage(){
    document.querySelector(`.app`).style.opacity = 1;
    document.querySelector(`#game-over`).classList.remove(`endGame`);
    start_btn.addEventListener(`click`,startGame,{once: true});
}
function playAgnBtn(){
    document.querySelector(`.app`).style.opacity = 1;
    document.querySelector(`#game-over`).classList.remove(`endGame`);
    startGame();
}

function gameBoard (Settings){
    if(lvl !== 0){
        level()[`level${lvl}`]();
        game_info.innerHTML = `${game_settings.goal} rats till win`;
    }
    boardSpots = [];
    const row = Settings.row;
    const col = Settings.col;
    let boardHTML = ``
    for(i=0; i<row; i++){
        boardHTML += `<div class="rows">`;
        for(a=0; a<col; a++){
            boardHTML += `<div class="box" data-box="${[i,a]}" data-name="blank"></div>`;
            boardSpots.push([i,a]);
        };
        boardHTML += `</div>`
    };
    board.innerHTML = boardHTML;

    initialSettings(Settings);
    function initialSettings (Settings) {
        const snkeHead = getHTMLBox(Settings.snakeHead_init)
        snkeHead.classList.add(`head`);
        snkeHead.dataset.name = `snake-head`;
    
        Settings.snakeTail_init.forEach(e => {
            const tail = getHTMLBox(e);
            tail.classList.add(`tail`);
            tail.dataset.name = `tail`;
        })
        if(Settings.wall.length> 0){
            Settings.wall.forEach(e => {
                getHTMLBox(e).classList.add(`wall`);
                getHTMLBox(e).dataset.name = `wall`;
            });
        }
    }
};

function showArrowBtn(){
    const btn = document.getElementById(snakeDirection);
    btn.classList.add(`active-btn`)
    setTimeout(function(){
        btn.classList.remove(`active-btn`)
    }, 300);
}

function endGame(reason){
    if(reason == endReason.reasons.lose || reason == endReason.reasons.winGame ){
        lvl = 0;
    }
    document.getElementById(`end-title`).innerHTML = endReason[reason].main;
    document.getElementById(`end-p`).innerHTML = endReason[reason].p;
    document.querySelector(`.app`).style.opacity = `10%`;
    document.querySelector(`#game-over`).classList.add(`endGame`);
    clearInterval(snakeInterval);
    close_btn.addEventListener(`click`,closeMessage,{once:true});
    again_btn.addEventListener(`click`,playAgnBtn,{once:true});

}
