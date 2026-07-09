"use strict";

const { doubleDown, hit, isGameOver, playForDealer, startGame, playerHand, dealerHand } = require('../src/js/game');

// Mock DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <div id="result"></div>
        <div id="visualPlayerHand"></div>
        <div id="visualDealerHand"></div>
        <div id="playerTotal"></div>
        <div id="dealerTotal"></div>
        <div id="action-buttons"></div>
        <button id="double-down" disabled></button>
    `;
    startGame();
});

describe('doubleDown', () => {
    it('should not call playForDealer if the game is over after hit', () => {
        // Force player to bust after hit
        jest.spyOn(global.Math, 'random').mockReturnValue(0.9); // Force high cards
        
        // Mock hit to force a bust
        const originalHit = hit;
        jest.spyOn(global, 'hit').mockImplementation(() => {
            originalHit();
            if (calculateTotal(getCardValuesFromPlayerHand()).hardValue > 21) {
                document.getElementById('result').textContent = 'YOU LOSE';
            }
        });
        
        const playForDealerSpy = jest.spyOn(global, 'playForDealer');
        doubleDown();
        
        expect(isGameOver()).toBe(true);
        expect(playForDealerSpy).not.toHaveBeenCalled();
        
        // Restore mocks
        jest.restoreAllMocks();
    });
    
    it('should call playForDealer if the game is not over after hit', () => {
        // Force player to not bust after hit
        jest.spyOn(global.Math, 'random').mockReturnValue(0.1); // Force low cards
        
        const playForDealerSpy = jest.spyOn(global, 'playForDealer');
        doubleDown();
        
        expect(isGameOver()).toBe(false);
        expect(playForDealerSpy).toHaveBeenCalled();
        
        // Restore mocks
        jest.restoreAllMocks();
    });
});

// Helper functions from game.js
function getCardValuesFromPlayerHand() {
    return playerHand.map((cardData) => cardData[0]);
}

function calculateTotal(cardValues) {
    let hardTotal = 0;
    let softTotal = null;
    
    for (const cardValue of cardValues) {
        let blackjackValue = convertCardValueToBlackjackValue(cardValue);
        hardTotal += blackjackValue;
    }
    
    if (handContainsAce(cardValues)) {
        softTotal = hardTotal; // aces are 1 valued here
        hardTotal += 10;
    }
    
    return {
        hardValue: hardTotal,
        softValue: softTotal
    };
}

function handContainsAce(blackJackValues) {
    return blackJackValues.includes(1);
}

function convertCardValueToBlackjackValue(cardValue) {
    if (cardValue === 'A') {
        return 1;
    } else if (isNaN(Number(cardValue))) {
        return 10;
    } else {
        return Number(cardValue);
    }
}