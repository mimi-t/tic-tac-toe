//0 = empty
//1 = O (playerOne)
//2 = X (playerTwo)

//factory function for player
const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    const updateName = (newName) => name = newName;
    return {getName, getMark, updateName};
}

const Display = (() => {
    //add event listeners for reset and play again buttons
    const addReset = () =>{
        const modal_div = document.querySelector('.modal');
        const playAgain_button = document.querySelector('#announce > .reset');
        const reset_button = document.querySelector('.button-wrapper > .reset');
        
        playAgain_button.addEventListener('click', e => {
            Game.setNewRound();
            modal_div.classList.toggle('hidden');
        });
        reset_button.addEventListener('click', e => {
            Game.setNewRound();
        });
    }

    //check name given is not empty/whitespace and returns default value if it is
    const checkName = (name, num) => {
        if (name.trim().length > 0) {
            return name.trim();
        } else {
            return num === 1 ? 'Player 1' : 'Player 2';
        }
    }

    //handles form submission,  
    const submitForm = () => {
        const playerName_form = document.querySelector('.form-container');
        playerName_form.addEventListener('submit', e => {
            event.preventDefault();
            let playerOneName = checkName(playerName_form['player-one-name'].value, 1);
            let playerTwoName = checkName(playerName_form['player-two-name'].value, 2);
            playerOne.updateName(playerOneName);
            playerTwo.updateName(playerTwoName);
            document.querySelector('.form-wrapper').classList.toggle('hidden');
            document.querySelector('.content').classList.toggle('hidden');
        })
    }

    //toggle player underlined
    const toggleUnderline = () => {
        document.querySelector('#player-one').classList.toggle('current-player');
        document.querySelector('#player-two').classList.toggle('current-player');
    }

    const setUpEvents = () => {
        addReset();
        submitForm();
    }
    return {setUpEvents, toggleUnderline};
})();

Display.setUpEvents();

const playerOne = Player('Player 1', 1);
const playerTwo = Player('Player 2', 2);

//module for the game
const Game = (() => {
    const _gameContainer_div = document.querySelector('.game-container');
    let _gameboard = [[0,0,0], [0,0,0], [0,0,0]];
    let _playerOneWin = 0;
    let _playerTwoWin = 0;
    let _currentRound = 0;

    //renders the gameboard in HTML
    const renderGameboard = () => {
        for (row = 0; row < _gameboard.length; row++) {
            for (col = 0; col < _gameboard[row].length; col++) {
                let gameCell_div = document.createElement('div');
                gameCell_div.className = 'game-cell';
                gameCell_div.dataset.row = row;
                gameCell_div.dataset.col = col;

                gameCell_div.addEventListener('click', e => {
                    if (e.currentTarget.innerHTML === '') {
                        //places mark if clicked div is empty, updates gameboard array, and increments round 
                        let currentPlayer = _currentRound % 2 === 0 ? 1 : 2;
                        placeMark(e.currentTarget, currentPlayer);
                        updateArray(e.currentTarget.dataset.row, e.currentTarget.dataset.col, currentPlayer);
                        _currentRound++;
                        Display.toggleUnderline();
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
                            showRoundResult(winStatus);
                        } 
                    }
                });
                _gameContainer_div.appendChild(gameCell_div);
            }
        }
    };

    //clears the gameboard
    const setNewRound = () => {
        Array.from(_gameContainer_div.querySelectorAll('.game-cell')).forEach(cell => cell.innerHTML = '');
        _gameboard = [[0,0,0], [0,0,0], [0,0,0]];
        _currentRound = 0;
    }

    //if player is 1 place circle, else place cross in given cell
    const placeMark = (cell, player) => {
        cell.innerHTML = player === 1 ? '<img src="images/circle.svg">' : '<img src="images/cross.svg">';
    };

    //updates array with player's number in row and column provided
    const updateArray = (row, col, player) => {
        _gameboard[row][col] = player;
    };

    //returns -1 for draw, 1 for player one's win, 2 for player two's win, 0 for no win
    const checkForWin = () => {
        if (_currentRound >= 9) {
            return -1;
        }

        //checks all array values are 1 or 2
        const allEqual = arr => arr.every(val => val === arr[0] && val !== 0);
        const colArr = [];
        const diagonalArr = [];
        const antiDiagonalArr = [];

        for (i = 0; i < _gameboard.length; i++) {
            //check rows
            if (allEqual(_gameboard[i])) {
                return _gameboard[i][0];
            }

            //checks columns
            for (j = 0; j < _gameboard.length; j++){
                colArr.push(_gameboard[j][i]);
            }
            if (allEqual(colArr)) {
                return colArr[0];
            }
            colArr.length = 0;

            //adds elements on diagonal to array 
            diagonalArr.push(_gameboard[i][i]);
            antiDiagonalArr.push(_gameboard[i][_gameboard.length-1-i]);
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

    //announce the round result and provide button to play another round
    const showRoundResult = (winStatus) => {
        //toggle class hidden on div containing winner announcement with text edited to match winner/draw
        const modal_div = document.querySelector('.modal');
        const winner_p = document.querySelector('#winner');
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

    return {renderGameboard, setNewRound};
})(playerOne, playerTwo);


Game.renderGameboard();
