// tests/split.test.js

describe('Blackjack Split Functionality', () => {
    test('split function creates two hands from a pair', () => {
        // Mock playerHand to be a pair
        global.playerHand = [['A', 'hearts'], ['A', 'spades']];
        global.dealOneCard = jest.fn(() => ['K', 'diamonds']);
        global.visualizePlayerHandAndTotal = jest.fn();
        global.enableSplitIfPlayerHasPair = jest.fn();
        global.convertCardValueToBlackjackValue = jest.fn((val) => val === 'A' ? 1 : 10);
        global.stringifyHand = jest.fn((hand) => hand.map(card => `${card[0]} of ${card[1]}`).join(' + '));

        document.body.innerHTML = '<div id="visualPlayerHand"></div>';

        const { split } = require('../src/js/game');
        split();

        const playerHandElement = document.getElementById('visualPlayerHand');
        expect(playerHandElement.innerHTML).toContain('active-hand');
        expect(playerHandElement.innerHTML).toContain('inactive-hand');
    });
});