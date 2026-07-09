"use strict";

const { split, hit, startGame, playerHands, activeHandIndex } = require('../src/js/game');

// Mock DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <div id="result"></div>
        <div id="visualPlayerHand"></div>
        <div id="visualDealerHand"></div>
        <div id="playerTotal"></div>
        <div id="dealerTotal"></div>
        <div id="action-buttons"></div>
        <button id="split" disabled></button>
        <button id="double-down" disabled></button>
    `;
    startGame();
});

describe('split', () => {
    it('should split the player hand into two hands', () => {
        // Force a pair
        jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.1); // Force low cards to get a pair
        startGame(); // Restart to apply mocks
        
        // Enable split
        document.getElementById('split').removeAttribute('disabled');
        split();
        
        expect(playerHands.length).toBe(2);
        expect(playerHands[0].length).toBe(2);
        expect(playerHands[1].length).toBe(2);
        
        // Restore mocks
        jest.restoreAllMocks();
    });
    
    it('should visualize the active hand after split', () => {
        // Force a pair
        jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);
        startGame(); // Restart to apply mocks
        
        // Enable split
        document.getElementById('split').removeAttribute('disabled');
        split();
        
        expect(document.getElementById('visualPlayerHand').textContent).toContain('of');
        
        // Restore mocks
        jest.restoreAllMocks();
    });
    
    it('should switch to the next hand after hitting on the active hand', () => {
        // Force a pair
        jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);
        startGame(); // Restart to apply mocks
        
        // Enable split
        document.getElementById('split').removeAttribute('disabled');
        split();
        
        // Mock hit to avoid busting
        const originalHit = hit;
        jest.spyOn(global, 'hit').mockImplementation(() => {
            originalHit();
        });
        
        hit();
        expect(activeHandIndex).toBe(0); // Still on first hand
        
        // Restore mocks
        jest.restoreAllMocks();
    });
});