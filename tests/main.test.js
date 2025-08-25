import Ship from '../src/scripts/main';

it('Ship has a length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
});

it('Ship can be hit', () => {
    const ship = new Ship(3, 2, false);
    expect(ship.hitsAmount).toBe(2);
});

it('Ship can be sunk', () => {
    const ship = new Ship(3, 3, true);
    expect(ship.sunk).toBe(true);
});

it('Ship hit method increases ship hits amount', () => {
    const ship = new Ship(3, 1, false);
    ship.hit();
    expect(ship.hitsAmount).toBe(2);
});

it('Ship isSunk method correctly evaluates if ship is sunk', () => {
    const ship = new Ship(3, 3, true);
    expect(ship.isSunk()).toBe(true);
});

