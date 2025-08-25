export class Ship {
    constructor(length, hitsAmount = 0, sunk = false) {
        this.length = length;
        this.hitsAmount = hitsAmount;
        this.sunk = sunk;
    }

    hit() {
        this.hitsAmount++;
    }

    isSunk() {
        this.sunk = this.hitsAmount >= this.length;
        return this.sunk;
    }
}

export class Gameboard {
    constructor() {
        this.board = [];
        this.setupBoard();
    }

    setupBoard() {
        for (let row = 0; row < 10; row++) {
            const rowArray = [];
            for (let col = 0; col < 10; col++) {
                rowArray.push(0);
            }
            this.board.push(rowArray);
        }
    }
}