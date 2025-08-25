import Ship from '../src/scripts/main';

it('Ship has a length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
});