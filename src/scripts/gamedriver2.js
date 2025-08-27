import { Ship, Gameboard, Player } from './classes.js';

export const gameApp = {
    state: 'setup', // 'setup' and 'playing'
    currentTurn: null,
    player1: null,
    player2: null,

    init: function () {
        this.setupPlayers();
        this.cache();
        this.createGrids();
        this.bind();
        this.render();
    },

    cache: function () {
        this.setupSection = document.querySelector('.setup');
        this.playingSection = document.querySelector('.playing');
        this.startBtn = document.querySelector('.start-game');
        this.resetBtn = document.querySelector('.reset');
        this.playerGrid = document.querySelector('.player-grid');
        this.playerGridSetup = document.querySelector('.player-grid-setup');
        this.pcGrid = document.querySelector('.pc-grid');
        this.whoseTurn = document.querySelector('.whose-turn');
        this.hitMessage = document.querySelector('.hit-message');
    },

    createGrids: function () {
        this.createGrid(this.playerGrid, this.player1);
        this.createGrid(this.pcGrid, this.player2);
    },

    createGrid: function (grid, player) {
        grid.innerHTML = '';
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const gridPiece = document.createElement('div');
                gridPiece.classList.add('grid-piece');
                gridPiece.classList.add(`${player.name}`);
                gridPiece.dataset.x = x;
                gridPiece.dataset.y = y;
                grid.appendChild(gridPiece);
            }
        }
    },

    bind: function () {
        const gridSquares = this.pcGrid.querySelectorAll(
            '.grid-piece.computer'
        );

        gridSquares.forEach((square) => {
            square.addEventListener('click', () => {
                if (this.currentTurn === this.player1) {
                    const cords = [
                        Number(square.dataset.x),
                        Number(square.dataset.y),
                    ];
                    try {
                        this.player2.gameBoard.receiveAttack(cords);
                        this.takeTurn();
                    } catch (error) {
                        // receiveAttack throws error if grid-piece was already attacked,
                        // so display the error
                        this.hitMessage.textContent = error.message;
                    }
                }
            });
        });
    },

    render: function () {},

    setupPlayers: function () {
        // for now, setup players w/ ships on their boards:
        const player1 = new Player('me');
        const player2 = new Player('computer');
        this.currentTurn = player1;

        player1.gameBoard.placeShip([3, 0, 4, true]); // length, x, y, horizontal
        player1.gameBoard.placeShip([4, 4, 2, false]);
        player1.gameBoard.placeShip([2, 6, 2, true]);
        player2.gameBoard.placeShip([3, 0, 4, true]);
        player2.gameBoard.placeShip([4, 4, 2, false]);
        player2.gameBoard.placeShip([2, 6, 2, true]);

        console.log(player1.gameBoard.getBoard());
    },

    takeTurn: function () {
        if (this.currentTurn === this.player2) {
            this.computerMove();
            this.currentTurn = this.player1;
        } else {
            // user turn
            this.currentTurn = this.player2;
        }
    },

    computerMove: function () {
        this.whoseTurn.textContent = "Computer's turn";
        setTimeout(() => {
            let attacked = false;
            while (!attacked) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const cords = [x, y];
                try {
                    this.player1.gameBoard.receiveAttack(cords);
                    attacked = true;
                    this.whoseTurn.textContent = 'Your turn';
                } catch (error) {
                    // receiveAttack throws error if grid-piece was already attacked, so re-run in this case
                    continue;
                }
            }
        }, 1500);
    },

    // Put classes to display if cell is a ship, was hit, was a miss, or is untouched
    updateGrid(player, grid) {
        // get all squares (pc's or player's)
        const squares = grid.querySelectorAll(`.grid-piece.${player.name}`);

        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            const x = Number(square.dataset.x);
            const y = Number(square.dataset.y);

            // check if the square has been hit, missed, or has not been attacked yet.
            const tag = this.checkSquareData(player, x, y);

            // reset and apply classes
            square.classList.remove('hit', 'miss', 'ship', 'empty');

            if (tag === 'hit') {
                square.classList.add('hit');
            } else if (tag === 'miss') {
                square.classList.add('miss');
            } else if (tag === 'ship') {
                square.classList.add('ship');
            } else {
                square.classList.add('empty');
            }
        }
    },

    checkSquareData(player, x, y) {
        const playerBoard = player.gameBoard.getBoard();
        const squareData = playerBoard[x][y];
        const hasShip = squareData instanceof Ship;

        // Check if the square was shot at
        let wasShot = false;
        for (let i = 0; i < board.shots.length; i++) {
            // take the cords of the current shot
            const [sx, sy] = board.shots[i];
            // check if the cords of the shot are equal to the cords of the passed square
            if (sx === x && sy === y) {
                wasShot = true;
                break;
            }
        }

        // If it was shot at, check if it was a miss
        let isMiss = false;
        for (let i = 0; i < board.misses.length; i++) {
            const [mx, my] = board.misses[i];
            if (mx === x && my === y) {
                isMiss = true;
                break;
            }
        }

        if (wasShot && hasShip) return 'hit';
        if (isMiss || (wasShot && !hasShip)) return 'miss';
        if (hasShip && player.name !== 'computer') return 'ship';
        return 'empty';
    },
};
