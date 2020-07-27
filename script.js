//0 = empty
//1 = O (playerOne)
//-1 = X (playerTwo)

//module for gameboard
const Gameboard = (() => {
    const _gameboard = [[1,-1,0], [0,0,0], [0,0,0]];
    const gameContainer_div = document.querySelector('.game-container');

    const getGameboard = () => _gameboard;

    const renderGameboard = () => {
        _gameboard.forEach(row => {
            row.forEach(cell => {
                let gameCell_div = document.createElement('div');
                gameCell_div.className = 'game-cell';
                switch (cell) {
                    case 1:
                        gameCell_div.innerHTML = '<img src="images/circle.svg">'
                        break;
                    case -1:
                        gameCell_div.innerHTML = '<img src="images/cross.svg">'
                        break;
                    default: 
                        break;
                }
                gameContainer_div.appendChild(gameCell_div);
            })
        })
    }

    return {getGameboard, renderGameboard};
})();

//module for the game logic
/*
to do:
    - checkWin
        -if board is full/9 moves have been made announce tie

*/
const Game = (() => {
    const playerOneWin = 0;
    const playerTwoWin = 0;
    const checkGameDone = () => {
        if (playerOneWin >= 3) {
            return 1;
        } else if (playerTwoWin >= 3) {
            return -1;
        } else {
            return 0;
        }
    }
    return {checkGameDone};
})();

//factory function for player
const Players = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark};
}


Gameboard.renderGameboard();