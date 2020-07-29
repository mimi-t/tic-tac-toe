//factory function for player
const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark};
}

const playerOne = Player('Player one', 1);
const playerTwo = Player('Player two', 2);

const Gameboard = (() => {
    let _gameboard = [[0,0,0], [0,0,0], [0,0,0]];

    //get array
    const get = () => _gameboard;

    //updates array with player's number in row and column provided
    const update = (row, col, player) => {
        _gameboard[row][col] = player;
    };

    //reset array
    const clear = () => _gameboard = [[0,0,0], [0,0,0], [0,0,0]];

    return {get, update, clear}
})();


//module for the game
const Game = (() => {
    let _playerOneWin = 0;
    let _playerTwoWin = 0;
    let _currentRound = 0;

    //clears the gameboard
    const setNewRound = () => {
        Gameboard.clear();
        displayController.clear();
        _currentRound = 0;
    }

    const makeMove = (target) => {
        //places mark if clicked div is empty, updates gameboard array, and increments round 
        let currentPlayer = _currentRound % 2 === 0 ? 1 : 2;
        displayController.placeMark(target, currentPlayer);
        Gameboard.update(target.dataset.row, target.dataset.col, currentPlayer);
        _currentRound++;
        
        //if there is a win or draw: updates scores, and announces winner/provides replay button
        let winStatus = checkForWin();
        if (checkForWin() !== 0){
            //increment scores if not a draw
            switch (winStatus) {
                case 1:
                    _playerOneWin++;
                    break;
                case 2:
                    _playerTwoWin++;
                    break;
            }
            displayController.showRoundResult(winStatus);
        } 
    }
    //returns -1 for draw, 1 for player one's win, 2 for player two's win, 0 for no win
    const checkForWin = () => {
        if (_currentRound >= 9) {
            return -1;
        }
        //checks all array values are 1 or 2
        const gameboard = Gameboard.get();
        const allEqual = arr => arr.every(val => val === arr[0] && val !== 0);
        const colArr = [];
        const diagonalArr = [];
        const antiDiagonalArr = [];

        for (i = 0; i < gameboard.length; i++) {
            //check rows
            if (allEqual(gameboard[i])) {
                return gameboard[i][0];
            }

            //checks columns
            for (j = 0; j < gameboard.length; j++){
                colArr.push(gameboard[j][i]);
            }
            if (allEqual(colArr)) {
                return colArr[0];
            }
            colArr.length = 0;

            //adds elements on diagonal to array 
            diagonalArr.push(gameboard[i][i]);
            antiDiagonalArr.push(gameboard[i][_gameboard.length-1-i]);
        }

        //checks diagonals
        if (allEqual(diagonalArr)) {
            return diagonalArr[0];
        }
        if (allEqual(antiDiagonalArr)) {
            return antiDiagonalArr[0];
        }
        diagonalArr.length = 0;
        antiDiagonalArr.length = 0;

        //no wins
        return 0;
    }
    
    //game loop WIP
    const checkGameDone = () => {
        if (_playerOneWin >= 3) {
            return 1;
        } else if (_playerTwoWin >= 3) {
            return 2;
        } else {
            return 0;
        }
    }
    return {makeMove, setNewRound};
})();

const DisplayController = (() => {
    const _gameContainer_div = document.querySelector('.game-container');
    const modal_div = document.querySelector('.modal');
    const winner_p = document.querySelector('#winner');

    //renders the gameboard in HTML
    const render = () => {
        let gameboard = Gameboard.get();
        for (row = 0; row < gameboard.length; row++) {
            for (col = 0; col < gameboard[row].length; col++) {
                let gameCell_div = document.createElement('div');
                gameCell_div.className = 'game-cell';
                gameCell_div.dataset.row = row;
                gameCell_div.dataset.col = col;

                gameCell_div.addEventListener('click', e => {
                    if (e.currentTarget.innerHTML === '') {
                        Game.makeMove(e.currentTarget);
                    }
                });
                _gameContainer_div.appendChild(gameCell_div);
            }
        }
        const button = document.querySelector('#play-again');
        button.addEventListener('click', e => {
            Game.setNewRound();
            modal_div.classList.toggle('hidden');
        });
    };

    const clear = () => {
        Array.from(_gameContainer_div.querySelectorAll('.game-cell')).forEach(cell => cell.innerHTML = '');
    }

    //if player is 1 place circle, else place cross in given cell
    const placeMark = (cell, player) => {
        cell.innerHTML = player === 1 ? '<img src="images/circle.svg">' : '<img src="images/cross.svg">';
    };

    //announce the round result and provide button to play another round
    const showRoundResult = (winStatus) => {
        //toggle class hidden on div containing winner announcement with text edited to match winner/draw
        switch (winStatus) {
            case 1:
                winner_p.innerHTML = `${playerOne.getName()} wins`;
                break;
            case 2:
                winner_p.innerHTML = `${playerTwo.getName()} wins`;
                break;
            case -1:
                winner_p.innerHTML = `It's a draw`;
                break;
        }
        modal_div.classList.toggle('hidden');
    }

    return {render, clear, placeMark, showRoundResult};
})(playerOne, playerTwo);

DisplayController.render();
