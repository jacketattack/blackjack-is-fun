"use strict";

const { split, startGame, playerHand, enableSplitIfPlayerHasPair } = require('../js/game');

// Mock DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <div id="visualPlayerHand"></div>
        <div id="playerTotal"></div>
        <button id="split" disabled></button>
    `;
    window.splitHands = [];
});

describe('split', () => {
    beforeEach(() => {
        startGame();
    });

    it('should split the player hand if a pair is present', () => {
        // Force the player to have a pair
        playerHand.length = 0;
        playerHand.push(['5', 'hearts'], ['5', 'diamonds']);
        
        // Mock dealOneCard to return a specific card
        const originalDealOneCard = window.dealOneCard;
        window.dealOneCard = jest.fn()
            .mockReturnValueOnce(['7', 'spades'])
            .mockReturnValueOnce(['8', 'clubs']);
        
        // Enable split
        enableSplitIfPlayerHasPair();
        
        split();
        
        // Verify the player hand and split hands
        expect(playerHand).toEqual([['5', 'hearts'], ['7', 'spades']]);
        expect(window.splitHands.length).toBe(1);
        expect(window.splitHands[0]).toEqual([['5', 'diamonds'], ['8', 'clubs']]);
        
        // Restore original function
        window.dealOneCard = originalDealOneCard;
    });

    it('should not split the player hand if not a pair', () => {
        // Force the player to have a non-pair
        playerHand.length = 0;
        playerHand.push(['5', 'hearts'], ['6', 'diamonds']);
        
        // Mock dealOneCard
        const originalDealOneCard = window.dealOneCard;
        window.dealOneCard = jest.fn();
        
        split();
        
        // Verify no split occurred
        expect(playerHand).toEqual([['5', 'hearts'], ['6', 'diamonds']]);
        expect(window.splitHands.length).toBe(0);
        
        // Restore original function
        window.dealOneCard = originalDealOneCard;
    });
});