import { Ship, Gameboard, Player } from './classes';

const gameApp = {
    state: 'setup', // 'setup' initially, then 'playing'

    cache() {
        this.setupSection = document.querySelector('.setup');
        this.playingSection = document.querySelector('.playing');
        this.startBtn = document.querySelector('.start-game');
        this.resetBtn = document.querySelector('.reset');
        this.playerGrid = document.querySelector('.player-grid');
        this.pcGrid = document.querySelector('.pc-grid');
    },

    bind() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    },

    init() {
        this.cache();
        this.bind();
        this.render();
    },

    render() {
        if (this.state === 'setup') {
            this.renderPlayerSetupGrid();
        } else if (this.state === 'playing') {
            this.renderPlayerGrid();
            this.renderPCGrid();
        }
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

    renderPlayerSetupGrid() {
        for (let row = 0; row < 10; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'player-grid-row';

            for (let col = 0; col < 10; col++) {
                const colDiv = document.createElement('div');
                colDiv.className = 'player-grid-col';
                colDiv.dataset.x = col;
                colDiv.dataset.y = row;
                rowDiv.appendChild(colDiv);
            }
            this.playerGrid.appendChild(rowDiv);
        }
    },
    
    renderPlayerGrid() {},
    renderPCGrid() {},
    initGame() {},
};

document.addEventListener('DOMContentLoaded', function () {
    gameApp.init();
});
