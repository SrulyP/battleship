class Ship {
    constructor(length, hitsAmount = 0, sunk = false) {
        this.length = length;
        this.hitsAmount = hitsAmount;
        this.sunk = sunk;
    }
}

export default Ship;
