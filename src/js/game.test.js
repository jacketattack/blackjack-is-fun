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
    calculateTotal,
    getCardValuesFromPlayerHand,
    getCardValuesFromDealerHand,
    setEndCondition,
    clearEndCondition
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
        </div>
        <button id="restart-game" class="hidden"></button>
    `;
    
    // Reset hands
    dealerHand = [];
    playerHand = [];
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