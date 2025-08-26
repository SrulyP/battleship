import { Ship, Gameboard, Player } from './classes';

const beginningUI = {
    init: function () {
        this.cache();
        this.bind();
        this.render();
    },

    cache: function () {
        this.setupSection = document.querySelector('.setup');
        this.playingSection = document.querySelector('.playing');
        this.startBtn = document.querySelector('.start-game');
        this.resetBtn = document.querySelector('.reset');
        this.playerGrid = this.setupSection.querySelector('.player-grid');
        this.pcGrid = this.playingSection.querySelector('.pc-grid');
    },

    bind: function () {
        this.startBtn.addEventListener('click', () => {
            this.startGame();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
    },
    render: function () {},
    renderBoard: function () {},

    startGame: function () {
        this.setupSection.classList.add('hidden');
        this.playingSection.classList.remove('hidden');
        gameManager.init();
    },
    resetGame: function () {
        this.playingSection.classList.add('hidden');
        // reset game state
        this.setupSection.classList.remove('hidden');
    },
};

const gameManager = {
    init: function () {
        this.cache();
        this.bind();
        this.render();
    },

    cache: function () {
        this.main = document.querySelector('main');
    },

    bind: function () {},
    render: function () {},
    renderBoard: function () {},
};

document.addEventListener('DOMContentLoaded', function () {
    beginningUI.init();
});
