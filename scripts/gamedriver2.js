import { Ship, Gameboard, Player } from './classes.js';

const gameApp = {
    currentTurn,

    init: function () {
        this.setupPlayers();
    },

    cache: function () {},
    bind: function () {},
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

    takeTurn: function (player) {
        if (player.name === 'computer') {
            computerMove();
        }
        // user turn
    },

    computerMove: function () {
        // delay for a few seconds
        // while not attacked:
        //  choose attack cords
        // try to attack
    },
};
