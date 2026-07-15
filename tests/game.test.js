// tests/game.test.js

// Mock DOM setup before requiring game.js
beforeAll(() => {
    document.body.innerHTML = `
        <div id="result"></div>
        <div id="visualPlayerHand"></div>
        <div id="playerTotal"></div>
        <div id="visualDealerHand"></div>
        <div id="dealerTotal"></div>
        <div id="action-buttons"></div>
        <button id="split" disabled></button>
        <button id="double-down" disabled></button>
        <button id="restart-game" class="hidden"></button>
    `;
});

const gameModule = require('../src/js/game');

describe('Blackjack Game Logic', () => {
    beforeEach(() => {
        // Setup DOM before each test
        document.body.innerHTML = `
            <div id="result"></div>
            <div id="visualPlayerHand"></div>
            <div id="playerTotal"></div>
            <div id="visualDealerHand"></div>
            <div id="dealerTotal"></div>
            <div id="action-buttons"></div>
            <button id="split" disabled></button>
            <button id="double-down" disabled></button>
            <button id="restart-game" class="hidden"></button>
        `;
        // Mock card dealing to prevent dealer from getting blackjack
        global.dealOneCard = jest.fn(() => ['2', 'hearts']);
        // Reset the game state
        gameModule.restartGame();
        // Clean up mocks
        jest.clearAllMocks();
    });

    test('isGameOver returns true if the game is over', () => {
        expect(gameModule.isGameOver()).toBe(false);
        gameModule.playerLoses();
        expect(gameModule.isGameOver()).toBe(true);
    });

    test('doubleDown does not call playForDealer if game is over', () => {
        gameModule.playerLoses();
        const playForDealerSpy = jest.spyOn(gameModule, 'playForDealer');
        gameModule.doubleDown();
        expect(playForDealerSpy).not.toHaveBeenCalled();
        playForDealerSpy.mockRestore();
    });

    describe('checkForPlayerBust', () => {
        test('correctly identifies bust with hard total > 21', () => {
            // Set player hand to have a hard total > 21
            gameModule.playerHand = [['K', 'hearts'], ['Q', 'diamonds'], ['2', 'spades']]; // K=10, Q=10, 2=2 = 22
            
            // Call checkForPlayerBust
            gameModule.checkForPlayerBust();
            
            // Check that the result text was set to YOU LOSE
            expect(document.getElementById('result').textContent).toBe('YOU LOSE');
        });

        test('correctly identifies bust with soft total > 21 when hard also > 21', () => {
            // Set player hand: Ace + King + King + 2
            // hard = 1 + 10 + 10 + 2 = 23, soft = 11 + 10 + 10 + 2 = 33
            // getTrueHandValue should use soft (33) since hard >= 22, so it IS a bust
            gameModule.playerHand = [['A', 'hearts'], ['K', 'diamonds'], ['K', 'spades'], ['2', 'clubs']];
            
            // Call checkForPlayerBust
            gameModule.checkForPlayerBust();
            
            // Check that the result text was set to YOU LOSE
            expect(document.getElementById('result').textContent).toBe('YOU LOSE');
        });

        test('does not call playerLoses for valid hand', () => {
            // Set player hand to a valid total
            gameModule.playerHand = [['10', 'hearts'], ['5', 'diamonds']]; // 15
            const playerLosesSpy = jest.spyOn(gameModule, 'playerLoses');
            
            gameModule.checkForPlayerBust();
            
            expect(playerLosesSpy).not.toHaveBeenCalled();
            
            playerLosesSpy.mockRestore();
        });

        test('does not call playerLoses for soft hand that is not busted', () => {
            // Set player hand: Ace + King + 5
            // hard = 1 + 10 + 5 = 16, soft = 11 + 10 + 5 = 26
            // getTrueHandValue should use hard (16) since hard < 22, so NOT a bust
            gameModule.playerHand = [['A', 'hearts'], ['K', 'diamonds'], ['5', 'spades']];
            const playerLosesSpy = jest.spyOn(gameModule, 'playerLoses');
            
            gameModule.checkForPlayerBust();
            
            expect(playerLosesSpy).not.toHaveBeenCalled();
            
            playerLosesSpy.mockRestore();
        });
    });

    describe('getTrueHandValue', () => {
        test('returns hard value when soft is null', () => {
            expect(gameModule.getTrueHandValue(20, null)).toBe(20);
        });

        test('returns hard value when hard < 22', () => {
            expect(gameModule.getTrueHandValue(18, 28)).toBe(18);
        });

        test('returns soft value when hard >= 22', () => {
            expect(gameModule.getTrueHandValue(22, 12)).toBe(12);
        });

        test('returns soft value when hard >= 22 and soft < 22', () => {
            expect(gameModule.getTrueHandValue(22, 12)).toBe(12);
        });
    });
});
