import { Ship, Gameboard, Player } from './classes';

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
        this.renderPlayerGrid();
        this.renderPCGrid();
    },

    startGame() {
        this.state = 'playing';
        this.setupSection.classList.add('hidden');
        this.playingSection.classList.remove('hidden');
        this.render();
        this.initGame();
    },

    resetGame() {
        this.state = 'setup';
        this.playingSection.classList.add('hidden');
        this.setupSection.classList.remove('hidden');
        // reset the game state
        this.render();
    },

    renderPlayerGrid() {
        this.renderGrid(
            this.player,
            this.playerGrid,
            'player-grid-row',
            'player-grid-col'
        );
    },

    renderPCGrid() {
        this.renderGrid(this.pc, this.pcGrid, 'pc-grid-row', 'pc-grid-col');
    },

    renderGrid(player, grid, rowClass, colClass) {
        grid.innerHTML = '';

        for (let y = 0; y < 10; y++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = rowClass;

            for (let x = 0; x < 10; x++) {
                const colDiv = document.createElement('div');
                colDiv.className = colClass;
                colDiv.dataset.x = x;
                colDiv.dataset.y = y;

                const tag = this.checkCellData(player, x, y);
                colDiv.textContent = tag;

                rowDiv.appendChild(colDiv);
            }
            grid.appendChild(rowDiv);
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

        if (wasShot && hasShip) return 'h';
        if (isMiss || (wasShot && !hasShip)) return 'm';
        if (hasShip && player.name !== 'Computer') return 's';
        return '-';
    },

    bindPlayerGrid() {},
    bindPCGrid() {},
    initGame() {},
};

document.addEventListener('DOMContentLoaded', function () {
    gameApp.init();
});
