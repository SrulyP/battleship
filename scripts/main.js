class Ship {
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

export default Ship;
