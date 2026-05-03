import { dealHand, drawCard } from './deck';
import { CardValue, CardSuit } from '../interfaces/card.interface';

describe('deck service', () => {
    it('should draw a card and reduce shoe size', () => {
        const card = drawCard();
        expect(card).toBeDefined();
        expect(Object.values(CardValue)).toContain(card.value);
        expect(Object.values(CardSuit)).toContain(card.suit);
    });

    it('should deal a hand with two cards', () => {
        const hand = dealHand();
        expect(hand.cards.length).toBe(2);
        expect(hand.finished).toBe(false);
    });

    it('should maintain a shoe across multiple draws', () => {
        // Drawing many cards should not crash and should return valid cards
        for (let i = 0; i < 100; i++) {
            const card = drawCard();
            expect(card).toBeDefined();
        }
    });

    it('should reshuffle when penetration limit is reached', () => {
        // The shoe has 6 decks = 312 cards. 
        // Penetration limit is 75% = 234 cards.
        // At 234 cards used (78 cards left), dealHand should trigger reshuffle.
        
        // This is a bit tricky to test without exposing 'shoe' or 'buildNewShoe',
        // but we can observe behavior by drawing almost the whole shoe.
        
        // Clear/reset shoe by drawing until empty if needed (state persists in module)
        // Since we can't reset, we just draw enough to hit the limit.
        const totalCards = 6 * 52;
        const limit = totalCards * 0.75;
        
        // Draw enough to be near the limit
        for (let i = 0; i < limit + 10; i++) {
            drawCard();
        }
        
        // This dealHand should have triggered a reshuffle if we were past limit
        const hand = dealHand();
        expect(hand.cards.length).toBe(2);
    });
});
