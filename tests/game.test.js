// tests/game.test.js

const { doubleDown, isGameOver, playerLoses, playerWins, restartGame } = require('../src/js/game');

describe('Blackjack Game Logic', () => {
    beforeEach(() => {
        // Reset the game state before each test
        restartGame();
        document.body.innerHTML = `
            <div id="result"></div>
            <div id="action-buttons"></div>
        `;
    });

    test('isGameOver returns true if the game is over', () => {
        expect(isGameOver()).toBe(false);
        playerLoses();
        expect(isGameOver()).toBe(true);
    });

    test('doubleDown does not call playForDealer if game is over', () => {
        playerLoses();
        const playForDealerSpy = jest.spyOn(window, 'playForDealer');
        doubleDown();
        expect(playForDealerSpy).not.toHaveBeenCalled();
        playForDealerSpy.mockRestore();
    });
});