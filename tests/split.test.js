// tests/split.test.js

describe('Blackjack Split Functionality', () => {
    test('split function creates two hands from a pair', () => {
        // Mock playerHand to be a pair
        const gameModule = require('../src/js/game');
        gameModule.playerHand = [['A', 'hearts'], ['A', 'spades']];
        
        // Mock global functions
        global.dealOneCard = jest.fn(() => ['K', 'diamonds']);
        global.visualizePlayerHandAndTotal = jest.fn();
        global.enableSplitIfPlayerHasPair = jest.fn();
        global.convertCardValueToBlackjackValue = jest.fn((val) => val === 'A' ? 1 : 10);
        global.stringifyHand = jest.fn((hand) => hand.map(card => `${card[0]} of ${card[1]}`).join(' + '));

        document.body.innerHTML = `
            <div id="visualPlayerHand"></div>
            <div id="playerTotal"></div>
            <div id="visualDealerHand"></div>
            <div id="dealerTotal"></div>
            <div id="result"></div>
            <div id="action-buttons"></div>
        `;

        const { split } = gameModule;
        split();

        const playerHandElement = document.getElementById('visualPlayerHand');
        expect(playerHandElement.innerHTML).toContain('active-hand');
        expect(playerHandElement.innerHTML).toContain('inactive-hand');
    });
});