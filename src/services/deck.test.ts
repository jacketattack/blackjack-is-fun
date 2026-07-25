import {
    dealHand,
    drawCard,
    getShoeStatus,
    resetShoe,
    getPenetrationLimit,
    getNumberOfDecks,
} from './deck'
import { CardValue, CardSuit } from '../interfaces/card.interface'

describe('Deck Service', () => {
    beforeEach(() => {
        resetShoe()
    })

    describe('getNumberOfDecks', () => {
        it('should return the number of decks in the shoe', () => {
            expect(getNumberOfDecks()).toBe(6)
        })
    })

    describe('getPenetrationLimit', () => {
        it('should return the penetration limit', () => {
            expect(getPenetrationLimit()).toBe(0.75)
        })
    })

    describe('getShoeStatus', () => {
        it('should return initial shoe status', () => {
            const status = getShoeStatus()
            expect(status.totalCards).toBe(6 * 52) // 6 decks
            expect(status.remainingCards).toBe(6 * 52)
            expect(status.penetrationPercentage).toBe(0)
            expect(status.decksRemaining).toBe(6)
            expect(status.reshuffleCount).toBe(0)
            expect(status.wasJustReshuffled).toBe(false)
        })

        it('should update remaining cards after drawing', () => {
            drawCard()
            const status = getShoeStatus()
            expect(status.remainingCards).toBe(6 * 52 - 1)
            expect(status.penetrationPercentage).toBeCloseTo(
                (1 / (6 * 52)) * 100,
                2
            )
        })

        it('should update decks remaining after drawing', () => {
            // Draw 52 cards (1 deck)
            for (let i = 0; i < 52; i++) {
                drawCard()
            }
            const status = getShoeStatus()
            expect(status.decksRemaining).toBeCloseTo(5, 1)
        })
    })

    describe('dealHand', () => {
        it('should return a hand with 2 cards', () => {
            const hand = dealHand()
            expect(hand.cards.length).toBe(2)
            expect(hand.finished).toBe(false)
        })

        it('should reduce remaining cards by 2', () => {
            const initialStatus = getShoeStatus()
            dealHand()
            const newStatus = getShoeStatus()
            expect(newStatus.remainingCards).toBe(
                initialStatus.remainingCards - 2
            )
        })

        it('should not be finished', () => {
            const hand = dealHand()
            expect(hand.finished).toBe(false)
        })
    })

    describe('drawCard', () => {
        it('should return a card', () => {
            const card = drawCard()
            expect(card).toHaveProperty('value')
            expect(card).toHaveProperty('suit')
        })

        it('should reduce remaining cards by 1', () => {
            const initialStatus = getShoeStatus()
            drawCard()
            const newStatus = getShoeStatus()
            expect(newStatus.remainingCards).toBe(
                initialStatus.remainingCards - 1
            )
        })

        it('should reshuffle when penetration limit is reached', () => {
            const initialStatus = getShoeStatus()

            // Draw enough cards to reach penetration limit (75%)
            const cardsToDraw = Math.floor(6 * 52 * 0.75) + 1
            for (let i = 0; i < cardsToDraw; i++) {
                drawCard()
            }

            const statusAfterDrawing = getShoeStatus()
            expect(statusAfterDrawing.reshuffleCount).toBeGreaterThan(
                initialStatus.reshuffleCount
            )
        })

        it('should increment reshuffle count when shoe is rebuilt', () => {
            const initialStatus = getShoeStatus()

            // Draw all cards to force reshuffle
            for (let i = 0; i < 6 * 52; i++) {
                drawCard()
            }

            // Draw one more to trigger reshuffle
            drawCard()

            const finalStatus = getShoeStatus()
            expect(finalStatus.reshuffleCount).toBeGreaterThan(
                initialStatus.reshuffleCount
            )
        })
    })

    describe('resetShoe', () => {
        it('should reset the shoe', () => {
            drawCard()
            resetShoe()
            const status = getShoeStatus()
            expect(status.remainingCards).toBe(6 * 52)
            expect(status.reshuffleCount).toBe(0)
        })
    })

    describe('Card Distribution', () => {
        it('should return valid cards', () => {
            resetShoe()
            const card = drawCard()
            expect(card).toHaveProperty('value')
            expect(card).toHaveProperty('suit')
            expect(Object.values(CardValue)).toContain(card.value)
            expect(Object.values(CardSuit)).toContain(card.suit)
        })

        it('should return different cards on subsequent draws', () => {
            resetShoe()
            const card1 = drawCard()
            const card2 = drawCard()
            // Cards should be different objects (though they might have same value/suit)
            expect(card1).not.toBe(card2)
        })
    })
})
