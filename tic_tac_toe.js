
const boardLogic = (() => {


    //keep track of winner mark!
    const checkDiagonalWin = (board) => {
        console.table(board);
        if(board[1][1] != "" && 
        ( (board[0][0] == board[1][1] && board[1][1] == board[2][2]) ||
        (board[0][2] == board[1][1] && board[1][1] == board[2][0]) )){
            return true;
        }
        return false;
    }

    const checkVerticalWin = (board) => {
        for(let i = 0; i < 3; i++){
            if( (board[1][i] != "") &&
            (board[0][i] == board[1][i] && board[1][i] == board[2][i])){
                console.log("vert win");
                return true;
            }
        }
        return false;
    }

    const checkHorizantalWin = (board) => {
        for(let i = 0; i < 3; i++){
            if( (board[i][1] != "") &&
            (board[i][0] == board[i][1] && board[i][1] == board[i][2])){
                console.log("hoz win");
                return true;
            }
        }
        return false;
    }

    const checkBoardFull = (board) => {
        for(let i = 0; i < 3; i++){
            if(board[0][i] == "" || board[1][i] == "" || board[2][i] == ""){
                //if one piece is empty board not full
                console.log("board not full")
                return false;
            }
        }
        console.log("boardFull");
        console.log("draw!!!")
        return true;
    }
    const checkWin = (board) =>{
        const gameBoard = board;
        if(checkDiagonalWin(gameBoard) || checkVerticalWin(gameBoard)
        || checkHorizantalWin(gameBoard)){
            return 1; //win
        }
        else if(checkBoardFull(gameBoard)){
            return 0; //draw 
        }
        else{
            return -1; //in progress, no win or draw
        }
    }

    return{ checkWin, checkBoardFull};
})();

const DOMboard = (() =>{
    const board = document.querySelector("#board");
    const boxes = board.getElementsByClassName("ticBox");
    const playButton = document.querySelector("#playButton");
    

    let score = document.querySelector("#score");
    let scoreText = score.innerHTML;
    let player1Score = scoreText.split("-")[0];
    let player2Score = scoreText.split("-")[1];


    playButton.addEventListener("click",function(){
        Gameboard.turnGameOn();
        //must clear board!;
    })

    for(let i = 0; i < boxes.length;i++){//board event listener
        boxes[i].addEventListener('click', function(){
            console.log(this.getAttribute("data-index"));
            play(this.getAttribute("data-index"));
        });
    }
    
    //update innerHTML of board to match our running gameBoard
    const updateBoard = (board) =>{
        const board1d = board[0].concat(board[1]).concat(board[2]);
        console.log(board1d);
        //update all innerHTML
        for(let i = 0; i<9;i++){
            boxes[i].innerHTML =  board1d[i];
        }
    };

    const player1 = Player("mike","X");
    const player2 = Player("bob","O");

    let turns = 0;
    const currentPlayer = (player1, player2) =>{
        turns++;
        if(turns %2 != 0){//odds 
            return player1
        }
        else{
            return player2
        }
    }

    const updateWins = (mark) => {
        if(mark == "X"){ //player1
            player1Score = +player1Score + 1;
        }
        else{ //player2
            player2Score = +player2Score + 1;
        }
        score.innerHTML=(`${player1Score}-${player2Score}`);

    }

    const play = (indexValue) =>{
        let curPLayer = currentPlayer(player1,player2)
        curPLayer.placeMark(indexValue);
    }
    return{play, updateBoard, updateWins};
})();

const Gameboard = (() => {
    let gameboard = [["","",""],["","",""],["","",""]];
    let gameOn = true;

    const turnGameOn = () => {
        gameOn = true;
        //must reset Board
        gameboard = [["","",""],["","",""],["","",""]];
        DOMboard.updateBoard(gameboard);

    }

    const addMark = (mark,spot) => {

        if(gameOn){
            let markIndex = spot.split(" ");
            if(gameboard[markIndex[0]][markIndex[1]] == ""){
                gameboard[markIndex[0]][markIndex[1]] = mark;
            }
            else{
                // alert("spot taken!");
            }
    
            if(boardLogic.checkWin(gameboard) == 1){ //1 for win 0 for draw -1 for in progress
                console.log(`${mark} won game`);
                //TODO update score
                DOMboard.updateWins(mark);
                //TODO END GAME
                gameOn = false;
            } 
    
            if(boardLogic.checkWin(gameboard) == 0){ //1 for win 0 for draw -1 for in progress
                console.log(`draw`);
                //TODO END GAME
                gameOn = false;
            } 
    
            if(boardLogic.checkWin(gameboard) == 1){ //1 for win 0 for draw -1 for in progress
                console.log(`in progress`);
            } 
            DOMboard.updateBoard(gameboard);
        } 
    }



    const viewBoard = () =>{
        return gameboard;
    }
    return{addMark, viewBoard, turnGameOn};
})();


function Player(name,mark)  { //'mark' X or O
    const getName = () => name;
    const getMark = () => mark;

    const placeMark = spot => { 
        Gameboard.addMark(mark, spot);
    }
    return{placeMark};
}


