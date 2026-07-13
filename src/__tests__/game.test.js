"use strict";

const { doubleDown, startGame, playerHand } = require('../js/game');

// Mock DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <div id="result"></div>
        <div id="action-buttons"></div>
        <div id="visualDealerHand"></div>
        <div id="dealerTotal"></div>
        <div id="visualPlayerHand"></div>
        <div id="playerTotal"></div>
        <button id="double-down" disabled></button>
        <button id="restart-game" class="hidden"></button>
    `;
});

describe('doubleDown', () => {
    beforeEach(() => {
        startGame();
    });

    it('should not call playForDealer if the player busts after doubling down', () => {
        // Force the player to have a hand that will bust on the next hit
        playerHand.length = 0; // Clear existing hand
        playerHand.push(['10', 'hearts'], ['10', 'diamonds']); // Total: 20
        
        // Mock dealOneCard to return a card that will bust the player
        const originalDealOneCard = window.dealOneCard;
        window.dealOneCard = () => ['2', 'spades']; // Total: 22 (bust)
        
        // Spy on playForDealer
        const playForDealerSpy = jest.fn();
        window.playForDealer = playForDealerSpy;
        
        doubleDown();
        
        // Verify playForDealer was not called
        expect(playForDealerSpy).not.toHaveBeenCalled();
        expect(document.getElementById('result').textContent).toBe('YOU LOSE');
        
        // Restore original function
        window.dealOneCard = originalDealOneCard;
    });

    it('should call playForDealer if the player does not bust after doubling down', () => {
        // Force the player to have a hand that will not bust on the next hit
        playerHand.length = 0; // Clear existing hand
        playerHand.push(['5', 'hearts'], ['5', 'diamonds']); // Total: 10
        
        // Mock dealOneCard to return a card that will not bust the player
        const originalDealOneCard = window.dealOneCard;
        window.dealOneCard = () => ['5', 'spades']; // Total: 15
        
        // Spy on playForDealer
        const playForDealerSpy = jest.fn();
        window.playForDealer = playForDealerSpy;
        
        doubleDown();
        
        // Verify playForDealer was called
        expect(playForDealerSpy).toHaveBeenCalled();
        expect(document.getElementById('result').textContent).toBe('');
        
        // Restore original function
        window.dealOneCard = originalDealOneCard;
    });
});