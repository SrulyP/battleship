import { Ship, Gameboard, Player } from './classes.js';

const gameApp = {
    state: 'setup', // 'setup' initially, then 'playing'
    turn: 'player',

    cache() {
        this.setupSection = document.querySelector('.setup');
        this.playingSection = document.querySelector('.playing');
        this.startBtn = document.querySelector('.start-game');
        this.resetBtn = document.querySelector('.reset');
        this.playerGrid = document.querySelector('.player-grid');
        this.playerGridSetup = document.querySelector('.player-grid-setup');
        this.pcGrid = document.querySelector('.pc-grid');
        this.whoseTurn = document.querySelector('.whose-turn');
    },

    bind() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    },

    init() {
        this.cache();
        this.bind();
        this.player = new Player('You');
        this.pc = new Player('Computer');
        this.render();
    },

    render() {
        this.initialRender(
            this.player,
            this.playerGrid,
            'player-grid-row',
            'player-grid-col'
        );
        this.initialRender(this.pc, this.pcGrid, 'pc-grid-row', 'pc-grid-col');
    },

    startGame() {
        this.state = 'playing';
        this.setupSection.classList.add('hidden');
        this.playingSection.classList.remove('hidden');
        this.render();
        this.bindPCGrid();
        this.initGame();
    },

    resetGame() {
        this.state = 'setup';
        this.playingSection.classList.add('hidden');
        this.setupSection.classList.remove('hidden');
        this.render();
    },

    initialRender(player, grid, rowClass, colClass) {
        if (grid.children.length) return;

        for (let y = 0; y < 10; y++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = rowClass;

            for (let x = 0; x < 10; x++) {
                const colDiv = document.createElement('div');
                colDiv.className = colClass;
                colDiv.classList.add('empty');
                colDiv.dataset.x = x;
                colDiv.dataset.y = y;
                rowDiv.appendChild(colDiv);
            }
            grid.appendChild(rowDiv);
        }
    },

    // Put classes to display if cell is hit, miss, ship, or -
    updateGrid(player, grid, colClass) {
        // get all columns (pc's or player's)
        const cols = grid.querySelectorAll(`.${colClass}`);

        for (let i = 0; i < cols.length; i++) {
            const colDiv = cols[i];
            const x = Number(colDiv.dataset.x);
            const y = Number(colDiv.dataset.y);

            const tag = this.checkCellData(player, x, y); // 'hit', 'miss', 'ship', '-'

            // reset and apply classes
            colDiv.classList.remove('hit', 'miss', 'ship', 'empty');

            if (tag === 'hit') {
                colDiv.classList.add('hit');
            } else if (tag === 'miss') {
                colDiv.classList.add('miss');
            } else if (tag === 'ship') {
                colDiv.classList.add('ship');
            } else {
                colDiv.classList.add('empty');
            }
        }
    },

    checkCellData(player, x, y) {
        const board = player.gameBoard;
        const cellData = board.getBoard()[x][y];
        const hasShip = cellData instanceof Ship;

        // Check if the cell was shot at
        let wasShot = false;
        for (let i = 0; i < board.shots.length; i++) {
            // take the cords of the current shot
            const [sx, sy] = board.shots[i];
            // check if the cords of the shot are equal to the cords of the passed cell
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
        if (hasShip && player.name !== 'Computer') return 'ship';
        return '-';
    },

    bindPlayerGrid() {
        // while (state === 'setup')
        // while (state === 'playing) no touching
    },

    bindPCGrid() {
        if (this.alreadyBoundPC) return;
        this.alreadyBoundPC = true;

        const cols = document.querySelectorAll('.pc-grid-col');

        cols.forEach((cell) => {
            cell.addEventListener('click', () => {
                if (this.state !== 'playing') return;

                const x = Number(cell.dataset.x);
                const y = Number(cell.dataset.y);

                try {
                    this.pc.gameBoard.receiveAttack([x, y]);
                    this.updateGrid(this.pc, this.pcGrid, 'pc-grid-col');
                } catch (e) {
                    this.whoseTurn.textContent = e.message;
                }
            });
        });
    },

    initGame() {},
};

document.addEventListener('DOMContentLoaded', function () {
    gameApp.init();
});
