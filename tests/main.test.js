import { Ship, Gameboard, Player } from '../src/scripts/classes';

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

it('Gameboard is set up', () => {
    const game = new Gameboard();
    expect(game.board[0][0]).toBe(0);
});

it('Gameboard can place ships at specific coordinates by calling the ship class.', () => {
    const game = new Gameboard();
    const cords = [2, 2, 3, true]; // length, x, y, horizontal
    const ship = new Ship(cords[0]);
    expect(game.placeShip(cords)).toEqual(ship);
});

it('Gameboard can place ships at specific coordinates.', () => {
    const game = new Gameboard();
    const board = game.getBoard();
    const cords = [2, 2, 3, true]; // length, x, y, horizontal
    const ship = new Ship(cords[0]);
    game.placeShip(cords);
    expect(board[3][2]).toEqual(ship);
});

it('Gameboard places correct ship length on board.', () => {
    const game = new Gameboard();
    const board = game.getBoard();
    const cords = [2, 2, 3, true]; // length, x, y, horizontal
    const ship = new Ship(cords[0]);
    game.placeShip(cords);
    expect(board[3][3]).toEqual(ship);
});

it('Gameboard cannot place ships out of bounds.', () => {
    const game = new Gameboard();
    const cords = [2, 10, 11, true]; // length, x, y, horizontal
    expect(() => game.placeShip(cords)).toThrow('Out of bounds');
});

it('Gameboard cannot place ships out of vertical bounds.', () => {
    const game = new Gameboard();
    const cords = [3, 9, 9, false]; // length, x, y, horizontal
    expect(() => game.placeShip(cords)).toThrow(
        'Ship goes out of vertical bounds'
    );
});

it('Gameboard cannot place ships out of horizontal bounds.', () => {
    const game = new Gameboard();
    const cords = [3, 9, 9, true]; // length, x, y, horizontal
    expect(() => game.placeShip(cords)).toThrow(
        'Ship goes out of horizontal bounds'
    );
});

it('Gameboard receiveAttack method increases the hits of a ship', () => {
    const game = new Gameboard();
    const cords = [3, 3, 3, true];
    const ship = game.placeShip(cords);
    const attackCords = [3, 3];
    game.receiveAttack(attackCords);
    expect(ship.hitsAmount).toEqual(1);
});

it('Gameboard receiveAttack method records a miss', () => {
    const game = new Gameboard();
    const attackCords = [3, 2];
    const misses = game.misses;
    game.receiveAttack(attackCords);
    expect(misses).toContainEqual([3, 2]);
});

it('Gameboard receiveAttack method does not allow for attacking the same cords twice', () => {
    const game = new Gameboard();
    const attackCords = [3, 2];
    const attackCords2 = [3, 2];
    game.receiveAttack(attackCords);
    expect(() => game.receiveAttack(attackCords2)).toThrow(
        'Cannot attack same cords twice'
    );
});

it('Gameboard reports if all ships are sunk', () => {
    const game = new Gameboard();
    const cords = [1, 3, 2, false];
    const ship = game.placeShip(cords);
    const attackCords = [3, 2];
    game.receiveAttack(attackCords);
    expect(game.allShipsSunk()).toBeTruthy();
});

it('Gameboard reports if not all ships are sunk', () => {
    const game = new Gameboard();
    const cords = [1, 3, 2, false];
    const ship = game.placeShip(cords);
    const attackCords = [3, 3];
    game.receiveAttack(attackCords);
    expect(game.allShipsSunk()).toBeFalsy();
});

it('Player can have a gameboard', () => {
    const player = new Player('Alice');
    expect(player.gameBoard).toBeInstanceOf(Gameboard);
});

it('Gameboard is not shared by players', () => {
    const player1 = new Player('Jim');
    const player2 = new Player('Alice');
    const cords = [3, 3, 3, true];
    const ship = player1.gameBoard.placeShip(cords);
    const attackCords = [3, 3];
    player1.gameBoard.receiveAttack(attackCords);
    expect(ship.hitsAmount).toEqual(1);
});
