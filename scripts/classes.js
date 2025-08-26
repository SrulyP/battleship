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
        this.misses = [];
        this.activeShips = [];
        this.shots = [];
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

    getBoard() {
        return this.board;
    }

    placeShip(cords) {
        const [length, x, y, horizontal] = cords;
        const ship = new Ship(length);
        const board = this.getBoard();
        this.checkBounds(cords);
        if (horizontal) {
            for (let i = 0; i < length; i++) {
                board[x][y + i] = ship;
            }
        } else {
            for (let i = 0; i < length; i++) {
                board[x + i][y] = ship;
            }
        }
        this.activeShips.push(ship);
        return ship;
    }

    checkBounds(cords) {
        const board = this.getBoard();
        const [length, x, y, horizontal] = cords;
        if (x < 0 || x >= 10 || y < 0 || y >= 10) {
            throw new Error('Out of bounds');
        }
        if (horizontal && y + length > 10) {
            throw new Error('Ship goes out of horizontal bounds');
        }
        if (!horizontal && x + length > 10) {
            throw new Error('Ship goes out of vertical bounds');
        }
        if (horizontal) {
            for (let i = 0; i < length; i++) {
                if (board[x][y + i] !== 0) {
                    throw new Error('Space not empty');
                }
            }
        }
        if (!horizontal) {
            for (let i = 0; i < length; i++) {
                if (board[x + i][y] !== 0) {
                    throw new Error('Space not empty');
                }
            }
        }
    }

    receiveAttack(attackCords) {
        const board = this.getBoard();
        if (this.duplicateHits(attackCords)) {
            throw new Error('Cannot attack same cords twice');
        }
        this.shots.push(attackCords);
        const [x, y] = attackCords;
        if (board[x][y] === 0) {
            this.misses.push(attackCords);
        } else {
            let ship = board[x][y];
            ship.hit();
            if (ship.isSunk()) {
                const index = this.activeShips.indexOf(ship);
                this.activeShips.splice(index, 1);
            }
        }
    }

    duplicateHits(attackCords) {
        const [x, y] = attackCords;

        for (let i = 0; i < this.shots.length; i++) {
            const coord = this.shots[i];
            if (coord[0] === x && coord[1] === y) {
                return true;
            }
        }
        return false;
    }

    allShipsSunk() {
        return this.activeShips.length === 0;
    }
}

export class Player {
    constructor(name) {
        this.name = name;
        this.gameBoard = new Gameboard();
    }
}
