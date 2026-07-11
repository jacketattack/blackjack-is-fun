// game.test.js
// Unit tests for game.js logic

const {
    isGameOver,
    doubleDown,
    hit,
    playForDealer,
    startGame,
    dealerHand,
    playerHand,
    splitHands,
    activeHandIndex,
    calculateTotal,
    getCardValuesFromPlayerHand,
    getCardValuesFromDealerHand,
    setEndCondition,
    clearEndCondition,
    split
} = require('./game');

// Mock DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <div id="result"></div>
        <div id="visualDealerHand"></div>
        <div id="dealerTotal"></div>
        <div id="visualPlayerHand"></div>
        <div id="playerTotal"></div>
        <div id="action-buttons">
            <button id="double-down" disabled></button>
            <button id="hit"></button>
            <button id="stand"></button>
            <button id="split" disabled></button>
        </div>
        <button id="restart-game" class="hidden"></button>
    `;
    
    // Reset hands
    dealerHand = [];
    playerHand = [];
    splitHands = [];
    activeHandIndex = 0;
    clearEndCondition();
});

// Test isGameOver function
describe('isGameOver', () => {
    test('returns true if result element has text', () => {
        setEndCondition('YOU LOSE');
        expect(isGameOver()).toBe(true);
    });
    
    test('returns true if player busts', () => {
        playerHand = [['K', 'hearts'], ['Q', 'diamonds'], ['J', 'spades']]; // Hard total = 30
        expect(isGameOver()).toBe(true);
    });
    
    test('returns true if player has blackjack', () => {
        playerHand = [['A', 'hearts'], ['K', 'diamonds']]; // Blackjack
        expect(isGameOver()).toBe(true);
    });
    
    test('returns true if dealer has blackjack', () => {
        dealerHand = [['A', 'hearts'], ['K', 'diamonds']]; // Blackjack
        expect(isGameOver()).toBe(true);
    });
    
    test('returns false if game is not over', () => {
        playerHand = [['K', 'hearts'], ['5', 'diamonds']]; // Hard total = 15
        dealerHand = [['7', 'hearts'], ['10', 'diamonds']]; // Hard total = 17
        expect(isGameOver()).toBe(false);
    });
});

// Test split function
describe('split', () => {
    test('does not split if player does not have exactly 2 cards', () => {
        playerHand = [['K', 'hearts'], ['5', 'diamonds'], ['2', 'spades']]; // 3 cards
        split();
        expect(splitHands.length).toBe(0);
    });
    
    test('does not split if cards are not a pair', () => {
        playerHand = [['K', 'hearts'], ['5', 'diamonds']]; // Not a pair
        split();
        expect(splitHands.length).toBe(0);
    });
    
    test('splits player hand into two hands if they have a pair', () => {
        playerHand = [['K', 'hearts'], ['K', 'diamonds']]; // Pair of Kings
        split();
        expect(splitHands.length).toBe(2);
        expect(splitHands[0].length).toBe(2); // Each hand has 2 cards (original + new card)
        expect(splitHands[1].length).toBe(2);
    });
});

// Test doubleDown function
describe('doubleDown', () => {
    test('does not call playForDealer if game is over after hit', () => {
        // Mock hit to force a bust
        const originalHit = hit;
        hit = jest.fn(() => {
            playerHand.push(['K', 'hearts']); // Force bust
        });
        
        // Mock playForDealer to track calls
        const originalPlayForDealer = playForDealer;
        playForDealer = jest.fn();
        
        playerHand = [['K', 'hearts'], ['5', 'diamonds']]; // Hard total = 15
        doubleDown();
        
        expect(hit).toHaveBeenCalled();
        expect(playForDealer).not.toHaveBeenCalled();
        
        // Restore original functions
        hit = originalHit;
        playForDealer = originalPlayForDealer;
    });
    
    test('calls playForDealer if game is not over after hit', () => {
        // Mock hit to add a card without busting
        const originalHit = hit;
        hit = jest.fn(() => {
            playerHand.push(['2', 'hearts']); // Hard total = 17
        });
        
        // Mock playForDealer to track calls
        const originalPlayForDealer = playForDealer;
        playForDealer = jest.fn();
        
        playerHand = [['K', 'hearts'], ['5', 'diamonds']]; // Hard total = 15
        doubleDown();
        
        expect(hit).toHaveBeenCalled();
        expect(playForDealer).toHaveBeenCalled();
        
        // Restore original functions
        hit = originalHit;
        playForDealer = originalPlayForDealer;
    });
});
