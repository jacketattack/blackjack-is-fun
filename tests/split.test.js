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
    });

    test('split function does nothing if not a pair', () => {
        // Set player hand to NOT be a pair
        gameModule.playerHand = [['A', 'hearts'], ['K', 'spades']];
        
        // Call split
        gameModule.split();
        
        // Check that splitHands is still empty
        expect(gameModule.splitHands.length).toBe(0);
        
        // Check that playerHand is unchanged
        expect(gameModule.playerHand).toEqual([['A', 'hearts'], ['K', 'spades']]);
    });

    test('split function creates splitHands array when called with a pair', () => {
        // Set player hand to be a pair
        gameModule.playerHand = [['A', 'hearts'], ['A', 'spades']];
        
        // Call split
        gameModule.split();
        
        // Check that splitHands has 2 hands
        expect(gameModule.splitHands.length).toBe(2);
        
        // Check that current hand is the first one
        expect(gameModule.currentHandIndex).toBe(0);
        
        // Check that playerHand is set to the first hand
        // Note: We can't test the exact cards because dealOneCard uses random
        expect(gameModule.playerHand.length).toBe(2);
        expect(gameModule.splitHands[0].length).toBe(2);
        expect(gameModule.splitHands[1].length).toBe(2);
        
        // Check that visual indicators are present
        const playerHandElement = document.getElementById('visualPlayerHand');
        expect(playerHandElement.innerHTML).toContain('active-hand');
        expect(playerHandElement.innerHTML).toContain('inactive-hand');
    });

    test('split function stores original cards in split hands', () => {
        // Set player hand to be a pair
        const originalHand = [['5', 'hearts'], ['5', 'spades']];
        gameModule.playerHand = [...originalHand];
        
        // Call split
        gameModule.split();
        
        // Check that the first card of each hand is from the original hand
        expect(gameModule.splitHands[0][0]).toEqual(originalHand[0]);
        expect(gameModule.splitHands[1][0]).toEqual(originalHand[1]);
        
        // Check that each hand has 2 cards (original + new card)
        expect(gameModule.splitHands[0].length).toBe(2);
        expect(gameModule.splitHands[1].length).toBe(2);
    });

    test('switchToHand changes the current hand', () => {
        // Setup split hands manually for testing
        gameModule.splitHands = [
            [['A', 'hearts'], ['K', 'diamonds']],
            [['A', 'spades'], ['Q', 'clubs']]
        ];
        gameModule.currentHandIndex = 0;
        gameModule.playerHand = gameModule.splitHands[0];
        
        // Switch to second hand
        gameModule.switchToHand(1);
        
        // Check that current hand index changed
        expect(gameModule.currentHandIndex).toBe(1);
        
        // Check that playerHand is now the second hand
        expect(gameModule.playerHand).toEqual([['A', 'spades'], ['Q', 'clubs']]);
    });

    test('switchToHand does nothing for invalid index', () => {
        // Setup split hands manually for testing
        gameModule.splitHands = [
            [['A', 'hearts'], ['K', 'diamonds']],
            [['A', 'spades'], ['Q', 'clubs']]
        ];
        gameModule.currentHandIndex = 0;
        gameModule.playerHand = gameModule.splitHands[0];
        
        // Try to switch to invalid index
        gameModule.switchToHand(5);
        
        // Check that current hand index didn't change
        expect(gameModule.currentHandIndex).toBe(0);
    });

    test('switchToHand does nothing for same index', () => {
        // Setup split hands manually for testing
        gameModule.splitHands = [
            [['A', 'hearts'], ['K', 'diamonds']],
            [['A', 'spades'], ['Q', 'clubs']]
        ];
        gameModule.currentHandIndex = 0;
        gameModule.playerHand = gameModule.splitHands[0];
        
        // Try to switch to same index
        gameModule.switchToHand(0);
        
        // Check that current hand index didn't change
        expect(gameModule.currentHandIndex).toBe(0);
    });

    test('startGame resets split hands state', () => {
        // Setup split hands manually
        gameModule.splitHands = [
            [['A', 'hearts'], ['K', 'diamonds']],
            [['A', 'spades'], ['Q', 'clubs']]
        ];
        gameModule.currentHandIndex = 1;
        
        // Restart game
        gameModule.restartGame();
        
        // Check that split hands are reset
        expect(gameModule.splitHands.length).toBe(0);
        expect(gameModule.currentHandIndex).toBe(0);
    });

    test('displayAllHands shows all hands with correct classes', () => {
        // Setup split hands manually
        gameModule.splitHands = [
            [['A', 'hearts'], ['K', 'diamonds']],
            [['A', 'spades'], ['Q', 'clubs']]
        ];
        gameModule.currentHandIndex = 0;
        
        gameModule.displayAllHands();
        
        const playerHandElement = document.getElementById('visualPlayerHand');
        expect(playerHandElement.innerHTML).toContain('active-hand');
        expect(playerHandElement.innerHTML).toContain('inactive-hand');
    });
});
