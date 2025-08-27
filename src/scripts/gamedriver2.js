import { Ship, Gameboard, Player } from './classes.js';

const gameApp = {
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
        this.createGrids(this.playerGrid, this.player1);
        this.createGrids(this.pcGrid, this.player2);
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
        const gridSquares = this.pcGrid.querySelectorAll('.grid-square');

        gridSquares.forEach((square) => {
            square.addEventListener('click', () => {
                if (this.currentTurn === this.player1) {
                }
                // evaluate click
            });
        });
    },

    render: function () {},

    setupPlayers: function () {
        // for now, setup players w/ ships on their boards:
        const player1 = new Player('Me');
        const player2 = new Player('Computer');
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
        if (this.player === this.player2) {
            computerMove();
            this.player = this.player1;
        }
        // user turn
        this.player = this.player2;
    },

    computerMove: function () {
        this.whoseTurn.textContent = "Computer's turn";
        // while pc has not attacked:
        // choose attack cords
        // try to attack
        setTimeout(() => {}, 3000);
    },
};
