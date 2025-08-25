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
        return this.hitsAmount === this.length;
    }
}

export default Ship;
