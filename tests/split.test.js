// tests/split.test.js

const gameModule = require('../src/js/game');

describe('Blackjack Split Functionality', () => {
    beforeEach(() => {
        // Setup DOM
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
        
        // Reset game state
        gameModule.restartGame();
        
        // Mock global functions
        global.dealOneCard = jest.fn(() => ['K', 'diamonds']);
        global.visualizePlayerHandAndTotal = jest.fn();
        global.enableSplitIfPlayerHasPair = jest.fn();
        global.convertCardValueToBlackjackValue = jest.fn((val) => val === 'A' ? 1 : 10);
        global.stringifyHand = jest.fn((hand) => hand.map(card => `${card[0]} of ${card[1]}`).join(' + '));
        jest.clearAllMocks();
    });

    test('split function does nothing if not a pair', () => {
        // Set player hand to NOT be a pair
        gameModule.playerHands = [{
            cards: [['A', 'hearts'], ['K', 'spades']],
            finished: false
        }];
        gameModule.activeHandIndex = 0;
        
        // Call split
        gameModule.split();
        
        // Check that playerHands is unchanged
        expect(gameModule.playerHands.length).toBe(1);
        expect(gameModule.playerHands[0].cards).toEqual([['A', 'hearts'], ['K', 'spades']]);
    });

    test('split function creates splitHands array when called with a pair', () => {
        // Set player hand to be a pair
        gameModule.playerHands = [{
            cards: [['A', 'hearts'], ['A', 'spades']],
            finished: false
        }];
        gameModule.activeHandIndex = 0;
        
        // Call split
        gameModule.split();
        
        // Check that playerHands now has 2 hands
        expect(gameModule.playerHands.length).toBe(2);
        expect(gameModule.activeHandIndex).toBe(0);
        
        // Check that the first card of each hand is from the original hand
        expect(gameModule.playerHands[0].cards[0]).toEqual(['A', 'hearts']);
        expect(gameModule.playerHands[1].cards[0]).toEqual(['A', 'spades']);
        
        // Check that each hand has 2 cards (original + new card)
        expect(gameModule.playerHands[0].cards.length).toBe(2);
        expect(gameModule.playerHands[1].cards.length).toBe(2);
    });

    test('split function stores original cards in split hands', () => {
        // Set player hand to be a pair
        const originalHand = [['5', 'hearts'], ['5', 'spades']];
        gameModule.playerHands = [{
            cards: [...originalHand],
            finished: false
        }];
        gameModule.activeHandIndex = 0;
        
        // Call split
        gameModule.split();
        
        // Check that the first card of each hand is from the original hand
        expect(gameModule.playerHands[0].cards[0]).toEqual(originalHand[0]);
        expect(gameModule.playerHands[1].cards[0]).toEqual(originalHand[1]);
        
        // Check that each hand has 2 cards (original + new card)
        expect(gameModule.playerHands[0].cards.length).toBe(2);
        expect(gameModule.playerHands[1].cards.length).toBe(2);
    });

    test('switchToHand changes the current hand', () => {
        // Setup split hands manually for testing
        gameModule.playerHands = [
            {
                cards: [['A', 'hearts'], ['K', 'diamonds']],
                finished: false
            },
            {
                cards: [['A', 'spades'], ['Q', 'clubs']],
                finished: false
            }
        ];
        gameModule.activeHandIndex = 0;
        
        // Switch to second hand
        gameModule.switchToHand(1);
        
        // Check that current hand index changed
        expect(gameModule.activeHandIndex).toBe(1);
    });

    test('switchToHand does nothing for invalid index', () => {
        // Setup split hands manually for testing
        gameModule.playerHands = [
            {
                cards: [['A', 'hearts'], ['K', 'diamonds']],
                finished: false
            },
            {
                cards: [['A', 'spades'], ['Q', 'clubs']],
                finished: false
            }
        ];
        gameModule.activeHandIndex = 0;
        
        // Try to switch to invalid index
        gameModule.switchToHand(5);
        
        // Check that current hand index didn't change
        expect(gameModule.activeHandIndex).toBe(0);
    });

    test('switchToHand does nothing for same index', () => {
        // Setup split hands manually for testing
        gameModule.playerHands = [
            {
                cards: [['A', 'hearts'], ['K', 'diamonds']],
                finished: false
            },
            {
                cards: [['A', 'spades'], ['Q', 'clubs']],
                finished: false
            }
        ];
        gameModule.activeHandIndex = 0;
        
        // Try to switch to same index
        gameModule.switchToHand(0);
        
        // Check that current hand index didn't change
        expect(gameModule.activeHandIndex).toBe(0);
    });

    test('startGame resets split hands state', () => {
        // Setup split hands manually
        gameModule.playerHands = [
            {
                cards: [['A', 'hearts'], ['K', 'diamonds']],
                finished: false
            },
            {
                cards: [['A', 'spades'], ['Q', 'clubs']],
                finished: false
            }
        ];
        gameModule.activeHandIndex = 1;
        gameModule.isSplitMode = true;
        
        // Restart game
        gameModule.restartGame();
        
        // Check that split hands are reset
        expect(gameModule.playerHands.length).toBe(1);
        expect(gameModule.activeHandIndex).toBe(0);
        expect(gameModule.isSplitMode).toBe(false);
    });

    test('displayAllHands shows all hands with correct classes', () => {
        // Setup split hands manually
        gameModule.playerHands = [
            {
                cards: [['A', 'hearts'], ['K', 'diamonds']],
                finished: false
            },
            {
                cards: [['A', 'spades'], ['Q', 'clubs']],
                finished: false
            }
        ];
        gameModule.activeHandIndex = 0;
        gameModule.isSplitMode = true;
        
        gameModule.visualizePlayerHandsAndTotals();
        
        const playerHandElement = document.getElementById('visualPlayerHand');
        expect(playerHandElement.innerHTML).toContain('active-hand');
        expect(playerHandElement.innerHTML).toContain('inactive-hand');
    });
});