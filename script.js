`use strict`;
var lvl = 0;
var snake = {};
var ratCounter = 0;
var snakeDirection;
var snakeInterval;
var boardSpots;
var tempo;



function getHTMLBox(box){
    return document.querySelector(`[data-box="${box}"]`);
}


function rotateImg(event){
    switch(event){
        case `up`:
            return `rotate(180deg)`
            break;
        case `down`:
            return `rotate(0deg)`
            break;
        case `right`:
            return `rotate(270deg)`
            break;
        case `left`:
            return `rotate(90deg)`
            break;
    }
}

function movesnake(){
    let targetBox = setDirection();
    let targetData = getHTMLBox(targetBox);
    let headBox = getHTMLBox(snake.head);
    
    if(targetData == null || targetData.dataset.name == cls.wall || targetData.dataset.name == cls.tail){
        console.log(`game over`);
        return endGame(endReason.reasons.lose);
    }
    else{
        headBox.classList.remove(cls.head);
        headBox.style.transform = `rotate(0deg)`;
        headBox.classList.add(cls.tail);
        headBox.dataset.name = cls.tail;
    } 

    if(targetData.dataset.name == cls.blank){
        setTail(true);
        snake.head = targetBox;
        
        targetData.classList.remove(cls.blank);
        targetData.classList.add(cls.head);
        targetData.dataset.name = cls.head;
    }
    else if(targetData.dataset.name == cls.rat){
        setTail(false);
        snake.head = targetBox;
        targetData.classList.remove(cls.rat);
        targetData.classList.add(cls.head);
        targetData.dataset.name = cls.head;
        clearInterval(snakeInterval);
        snakeInterval = setInterval(movesnake, tempo -= tempo/game_settings.tempoRatio);
        ratCounter++;
        if(ratCounter == game_settings.goal){
            if(lvl === game_settings.total_levels){
                return endGame(endReason.reasons.winGame);
            }
            else{
                return endGame(endReason.reasons.winLvl);
            }
        }
        game_info.innerHTML = `${game_settings.goal - ratCounter} rats till win`;
        setRat();
    }

    document.querySelector(`.${cls.head}`).style.transform = rotateImg(snakeDirection);
}

function setDirection(){
    let boxData;
    switch(snakeDirection){
        case `up`:
            boxData = [-1,0]
            break;
        case `down`:
            boxData = [1,0]
            break;
        case `left`:
            boxData = [0,-1]
            break;
        case `right`:
            boxData = [0,1]
            break;
    }
    boxData[0] += snake.head[0];
    boxData[1] += snake.head[1];
    return boxData;
}

function keyboardArrows(e){
    switch (e.keyCode) {
        case 37:
            if(snakeDirection == `right`){
                return;
            }
            else{
                snakeDirection= `left`;
            }
            break;
        case 38:
            if(snakeDirection == `down`){
                return;
            }
            else{
                snakeDirection= `up`;
            }
            break;
        case 39:
            if(snakeDirection == `left`){
                return;
            }
            else{
                snakeDirection = `right`;
            }
            break;
        case 40:
            if(snakeDirection == `up`){
                return;
            }
            else{
                snakeDirection = `down`;
            }
            break;
    }
    showArrowBtn();
}

function btnArrows(event){
    let direction = event.target.id;
    if(direction == ``){
        direction = event.target.parentElement.id
    };
    switch (direction) {
        case `left`:
            if(snakeDirection == `right`){
                return;
            }
            break;
        case `up`:
            if(snakeDirection == `down`){
                return;
            }
            break;
        case `right`:
            if(snakeDirection == `left`){
                return;
            }
            break;
        case `down`:
            if(snakeDirection == `up`){
                return;
            }
            break;
    }
    snakeDirection = direction;
}

function copyInitSnkPos(){
    snake.tail = [];
    snake.head = [game_settings.snakeHead_init[0],game_settings.snakeHead_init[1]];

    game_settings.snakeTail_init.forEach(e => {
        let tail = [];
        tail[0] = e[0];
        tail[1] = e[1];
        snake.tail.push(tail);
    })
}

function setTail(removeLastTail){
    let lastTail = snake.tail[snake.tail.length -1];
    if(removeLastTail){
        lastTailBox = getHTMLBox(lastTail);
        lastTailBox.classList.remove(cls.tail);
        lastTailBox.classList.add(cls.blank);
        lastTailBox.dataset.name = cls.blank;
        snake.tail.pop();
    }
    let swipping = []
    swipping[0] = [snake.head[0],snake.head[1]];
    snake.tail.forEach(e => swipping.push([e[0],e[1]]));
    snake.tail = swipping;
}

function setRat(){
    const availableSpot = [];
    boardSpots.forEach( e => {
        const spotStatus = getHTMLBox(e).dataset.name;
        if(spotStatus == cls.blank){
            availableSpot.push(e);
        }
    })
    let newRat = Math.floor(Math.random() * (availableSpot.length -1));
    newRat = availableSpot[newRat];
    getHTMLBox(newRat).dataset.name = cls.rat;
    getHTMLBox(newRat).classList.add(cls.rat);
}

function setWall(){

    
    function centerBlock(){
        let col = Math.floor(game_settings.col/2);
        let row = Math.floor(game_settings.row/2);
        if(game_settings.col%2 == 0){
            return [[row, col],[row-1,col],[row,col-1],[row-1,col-1]];
        }
        else{
            return [[row, col],[row-1,col],[row,col-1],[row-1,col-1],[row-1,col+1],[row,col+1]];
        }
    }

    function centerLine(){
        let col = game_settings.col;
        let row = game_settings.row;
        let maxRow = row-4;
        let wall = [];
        for(i=0;i<maxRow;i++){
            wall.push([2+i,2],[(row-maxRow-2)+i,col-3])
        }
        return wall;
        
    }
    return {
        centerLine: centerLine,
        centerBlock: centerBlock
    }
}
