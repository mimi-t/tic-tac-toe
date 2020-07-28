//0 = empty
//1 = O (playerOne)
//-1 = X (playerTwo)


//module for the game
const Game = ((playerOne, playerTwo) => {
    const _gameboard = [[1,-1,0], [0,0,0], [0,0,0]];
    const _gameContainer_div = document.querySelector('.game-container');
    const _playerOneWin = 0;
    const _playerTwoWin = 0;
    let currentRound = 0;

    //renders the gameboard in HTML
    const renderGameboard = () => {
        let counter = 0;
        for (row = 0; row < _gameboard.length; row++) {
            for (col = 0; col < _gameboard[row].length; col++) {
                let gameCell_div = document.createElement('div');
                gameCell_div.className = 'game-cell';
                gameCell_div.dataset.row = row;
                gameCell_div.dataset.col = col;
                // DELETE SWITCH STATEMENT LATER
                switch (_gameboard[row][col]) {
                    case 1:
                        gameCell_div.innerHTML = '<img src="images/circle.svg">'
                        break;
                    case -1:
                        gameCell_div.innerHTML = '<img src="images/cross.svg">'
                        break;
                    default: 
                        break;
                }
                //places mark if clicked div is empty, updates gameboard array and increments round
                gameCell_div.addEventListener('click', e => {
                    if (e.currentTarget.innerHTML === '') {
                        let currentPlayer = currentRound % 2 === 0 ? 1 : -1;
                        placeMark(e.currentTarget, currentPlayer);
                        updateArray(e.currentTarget.dataset.row, e.currentTarget.dataset.col, currentPlayer);
                        currentRound++;
                    }
                })
                _gameContainer_div.appendChild(gameCell_div);
                counter++;

            }
        }
    }

    //if player is 1 place circle, else place cross
    const placeMark = (cell, player) => {
        cell.innerHTML = player === 1 ? '<img src="images/circle.svg">' : '<img src="images/cross.svg">';
    }

    //places in given position the corresponding player number
    const updateArray = (row, col, player) => {
        _gameboard[row][col] = player;
    }

    const checkGameDone = () => {
        if (_playerOneWin >= 3) {
            return 1;
        } else if (_playerTwoWin >= 3) {
            return -1;
        } else {
            return 0;
        }
    }
    return {renderGameboard};
})();

//factory function for player
const Players = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark};
}


const playerOne = Players('Player one', 1);
const playerTwo = Players('Player two', -1);
Game.renderGameboard(playerOne, playerTwo);
