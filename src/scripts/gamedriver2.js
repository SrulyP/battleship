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
};
