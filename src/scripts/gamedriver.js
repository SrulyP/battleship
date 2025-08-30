import { Ship, Gameboard, Player } from './classes.js';

export const gameApp = {
    state: 'setup', // 'setup' and 'playing'
    currentTurn: null,
    player1: null,
    player2: null,
    beingDragged: null, // the ship object being dragged, using in
    horizontal: true,

    // ============================================= Initialization and Setup =============================================

    init: function () {
        this.cache();
        this.setupPlayers();
        this.createGrids();
        this.bind();
        this.render();

        // Initial grid updates to show player's ships
        this.updateGrid(this.player1);
        this.updateGrid(this.player2);
    },

    cache: function () {
        this.setupSection = document.querySelector('.setup');
        this.playingSection = document.querySelector('.playing');
        this.rotateBtn = document.querySelector('.rotate-btn');
        this.startBtn = document.querySelector('.start-game');
        this.resetBtn = document.querySelector('.reset');
        this.playerGrid = document.querySelector('.player-grid');
        this.playerGridSetup = document.querySelector('.player-grid-setup');
        this.pcGrid = document.querySelector('.pc-grid');
        this.whoseTurn = document.querySelector('.whose-turn');
        this.hitMessage = document.querySelector('.hit-message');
        this.shipsSection = document.querySelector('.ships');
    },

    setupPlayers: function () {
        this.player1 = new Player('me');
        this.player2 = new Player('computer');
        this.currentTurn = this.player1;

        this.setupUserShips();
        this.setupComputerShips();

        this.whoseTurn.textContent = 'Your turn';
        this.hitMessage.textContent =
            "To start the game, click a square in the enemy's grid.";
    },

    createGrids: function () {
        this.createGrid(this.playerGrid, this.player1);
        this.createGrid(this.playerGridSetup, this.player1);
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
        // Bind button events
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.rotateBtn.addEventListener('click', () => this.toggleHorizontal());

        // Bind grid events
        this.bindPCGridEvents();
        this.bindSetupEvents();
    },

    bindPCGridEvents() {
        const gridSquares = this.pcGrid.querySelectorAll(
            '.grid-piece.computer'
        );
        gridSquares.forEach((square) => {
            const x = Number(square.dataset.x);
            const y = Number(square.dataset.y);
            square.style.cursor = 'pointer';

            square.addEventListener('click', () => {
                // if the game isn't over: take the cords and attack enemy ship
                if (
                    this.currentTurn === this.player1 &&
                    !this.player1.gameBoard.allShipsSunk() &&
                    !this.player2.gameBoard.allShipsSunk()
                ) {
                    const cords = [
                        Number(square.dataset.x),
                        Number(square.dataset.y),
                    ];
                    try {
                        this.player2.gameBoard.receiveAttack(cords);
                        this.updateGrid(this.player2);
                        this.displayHitMessage(this.player2, cords);
                        this.takeTurn();
                    } catch (error) {
                        this.hitMessage.textContent = error.message;
                    }
                }
            });
        });
    },

    bindSetupEvents: function () {
        // bind events to the setup grid (where ships are dragged and dropped)
        const gridSquares =
            this.playerGridSetup.querySelectorAll('.grid-piece.me');
        gridSquares.forEach((square) => {
            square.addEventListener('dragover', (e) => this.dragOver(e));
            square.addEventListener('dragenter', (e) => this.dragEnter(e));
            square.addEventListener('dragleave', (e) => this.dragLeave(e));
            square.addEventListener('drop', (e) => this.dragDrop(e));
        });
    },

    dragEnter: function (e) {
        e.preventDefault();
        e.target.classList.add('highlight');
    },

    dragOver: function (e) {
        e.preventDefault();
    },

    dragLeave: function (e) {
        e.target.classList.remove('highlight');
    },

    dragDrop: function (e) {
        e.preventDefault();
        e.target.classList.remove('highlight');

        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);
        const shipLength = this.beingDragged.children.length;
        try {
            // try to place the ship on the player's board
            const cords = [shipLength, x, y, this.horizontal]; // [length, x, y, horizontal]
            this.player1.gameBoard.placeShip(cords);

            // remove the ship from the ships section
            this.beingDragged.style.display = 'none';
            this.beingDragged = null;

            // update the grid and start button
            this.updateGrid(this.player1);
            this.updateStartButton();
        } catch (error) {
            // if there is an error during placement, say why
            this.hitMessage.textContent = error.message;
        }
    },

    toggleHorizontal: function () {
        this.horizontal = !this.horizontal;

        const ships = this.shipsSection.querySelectorAll('.ship-piece');
        ships.forEach((ship) => {
            if (this.horizontal) {
                ship.classList.remove('vertical');
            } else {
                ship.classList.add('vertical');
            }
        });
    },

    render: function () {
        if (this.state === 'setup') {
            this.setupSection.classList.remove('hidden');
            this.playingSection.classList.add('hidden');
        } else {
            this.setupSection.classList.add('hidden');
            this.playingSection.classList.remove('hidden');
        }
    },

    setupUserShips: function () {
        let shipLengths = [5, 4, 3, 3, 2];
        // clear existing ships
        this.shipsSection.innerHTML = '';

        // for each length in the list, create [length] segments of the ship
        // and then add it to the ships section
        for (let i = 0; i < shipLengths.length; i++) {
            const ship = document.createElement('div');
            ship.classList.add('ship-piece');
            ship.setAttribute('draggable', true);

            for (let j = 0; j < shipLengths[i]; j++) {
                const shipSegment = document.createElement('div');
                shipSegment.classList.add('ship-segment');
                ship.appendChild(shipSegment);
            }

            this.bindShipDrag(ship);
            this.shipsSection.appendChild(ship);
        }

        this.updateStartButton();
    },

    bindShipDrag: function (ship) {
        ship.addEventListener('dragstart', (e) => this.dragStart(e));
        ship.addEventListener('dragend', (e) => this.dragEnd(e));
    },

    dragStart: function (e) {
        this.beingDragged = e.target;
        e.target.style.opacity = '0.5';
    },

    dragEnd: function (e) {
        e.target.style.opacity = '1';
        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach((highlight) =>
            highlight.classList.remove('highlight')
        );
    },

    setupComputerShips: function () {
        let shipLengths = [5, 4, 3, 3, 2];

        for (let i = 0; i < shipLengths.length; i++) {
            const length = shipLengths[i];
            let shipPlaced = false;
            while (!shipPlaced) {
                try {
                    // get the cords and horizontal-ness
                    const x = Math.floor(Math.random() * 10);
                    const y = Math.floor(Math.random() * 10);
                    const horizontal = Math.random() < 0.5;
                    const cords = [length, x, y, horizontal];

                    // try to place the ship on the board
                    this.player2.gameBoard.placeShip(cords);
                    shipPlaced = true;
                } catch {
                    continue;
                }
            }
        }
    },

    updateStartButton() {
        if (this.allShipsPlaced()) {
            this.startBtn.classList.remove('grayed-out');
            this.startBtn.disabled = false;
        } else {
            this.startBtn.classList.add('grayed-out');
            this.startBtn.disabled = true;
        }
    },

    startGame: function () {
        if (!this.allShipsPlaced()) return;
        this.state = 'playing';
        this.render();
        this.updateGrid(this.player1);
    },

    allShipsPlaced: function () {
        return this.player1.gameBoard.activeShips.length === 5;
    },

    // ============================================= Gameplay =============================================

    takeTurn: function () {
        if (
            this.player2.gameBoard.allShipsSunk() ||
            this.player1.gameBoard.allShipsSunk()
        ) {
            this.displayTurnMessage();
            return;
        }

        if (this.currentTurn === this.player1) {
            this.currentTurn = this.player2;
            this.displayTurnMessage();
            this.computerMove();
        } else {
            this.currentTurn = this.player1;
            this.displayTurnMessage();
        }
    },

    computerMove: function () {
        setTimeout(() => {
            let attacked = false;
            while (!attacked) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const cords = [x, y];
                try {
                    this.player1.gameBoard.receiveAttack(cords);
                    this.updateGrid(this.player1);
                    this.displayHitMessage(this.player1, cords);
                    attacked = true;
                    this.takeTurn();
                } catch (error) {
                    continue;
                }
            }
        }, 1000);
    },

    // ============================================= Dynamic Display Based on Gameplay =============================================

    // Put classes to display if cell is a ship, was hit, was a miss, or is untouched
    updateGrid(player) {
        let grid = null;
        if (player === this.player1) {
            // during setup, update the setup grid and during play, update the player grid
            grid =
                this.state === 'setup' ? this.playerGridSetup : this.playerGrid;
        } else {
            grid = this.pcGrid;
        }

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
        const squareData = playerBoard[y][x];
        const hasShip = squareData instanceof Ship;

        // Check if the square was shot at
        let wasShot = false;
        for (let i = 0; i < player.gameBoard.shots.length; i++) {
            // take the cords of the current shot
            const [sx, sy] = player.gameBoard.shots[i];
            // check if the cords of the shot are equal to the cords of the passed square
            if (sx === x && sy === y) {
                wasShot = true;
                break;
            }
        }

        // If it was shot at, check if it was a miss
        let isMiss = false;
        for (let i = 0; i < player.gameBoard.misses.length; i++) {
            const [mx, my] = player.gameBoard.misses[i];
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

    displayHitMessage: function (player, cords) {
        const board = player.gameBoard;
        const [x, y] = cords;
        const square = board.getBoard()[y][x];
        const isShip = square instanceof Ship;
        const isSunk = isShip && square.isSunk();

        if (!isShip) {
            this.hitMessage.textContent =
                player.name === 'computer'
                    ? 'You shot and missed.'
                    : 'The enemy shot and missed.';
        } else if (isSunk) {
            this.hitMessage.textContent =
                player.name === 'computer'
                    ? "You hit and sunk the enemy's ship!"
                    : 'The enemy hit and sunk your ship!';
        } else {
            this.hitMessage.textContent =
                player.name === 'computer'
                    ? "You hit the enemy's ship!"
                    : 'The enemy hit your ship!';
        }
    },

    displayTurnMessage: function () {
        if (this.player2.gameBoard.allShipsSunk()) {
            this.whoseTurn.textContent = 'Game Over: You Win!';
            this.hitMessage.textContent = '';
            return;
        }
        if (this.player1.gameBoard.allShipsSunk()) {
            this.whoseTurn.textContent = 'Game Over: Enemy Wins!';
            this.hitMessage.textContent = '';
            return;
        }

        if (this.currentTurn === this.player1) {
            this.whoseTurn.textContent = 'Your turn';
        } else {
            this.whoseTurn.textContent = "Enemy's turn";
        }
    },

    // ============================================= Reset Game =============================================

    resetGame: function () {
        // reset everything
        this.state = 'setup';
        this.currentTurn = null;
        this.player1 = null;
        this.player2 = null;
        this.beingDragged = null;
        if (this.hitMessage) this.hitMessage.textContent = '';
        if (this.whoseTurn) this.whoseTurn.textContent = '';

        // set up again
        this.cache();
        this.setupPlayers();
        this.createGrids();
        this.bindPCGridEvents();
        this.bindSetupEvents();
        this.updateGrid(this.player1);
        this.updateGrid(this.player2);
        this.render();
    },
};

// ============================================= Initialize App =============================================

document.addEventListener('DOMContentLoaded', () => {
    gameApp.init();
});
