import {
    checkInsuranceOffered,
    calculateInsuranceBet,
    calculateInsurancePayout,
    shouldDealerCheckForBlackjack,
    dealerHasBlackjack,
} from './insurance'
import { Card, CardSuit, CardValue } from '../interfaces/card.interface'

describe('Insurance Service', () => {
    describe('checkInsuranceOffered', () => {
        it('should return true when dealer card is Ace', () => {
            const aceCard: Card = {
                value: CardValue.ACE,
                suit: CardSuit.SPADES,
            }
            expect(checkInsuranceOffered(aceCard)).toBe(true)
        })

        it('should return false when dealer card is not Ace', () => {
            const tenCard: Card = {
                value: CardValue.TEN,
                suit: CardSuit.HEARTS,
            }
            expect(checkInsuranceOffered(tenCard)).toBe(false)
        })

        it('should return false for King', () => {
            const kingCard: Card = {
                value: CardValue.KING,
                suit: CardSuit.DIAMONDS,
            }
            expect(checkInsuranceOffered(kingCard)).toBe(false)
        })
    })

    describe('calculateInsuranceBet', () => {
        it('should return half of original bet for even amounts', () => {
            expect(calculateInsuranceBet(100)).toBe(50)
            expect(calculateInsuranceBet(50)).toBe(25)
        })

        it('should return floor of half for odd amounts', () => {
            expect(calculateInsuranceBet(101)).toBe(50)
            expect(calculateInsuranceBet(99)).toBe(49)
        })

        it('should handle zero bet', () => {
            expect(calculateInsuranceBet(0)).toBe(0)
        })
    })

    describe('calculateInsurancePayout', () => {
        it('should return 2:1 payout', () => {
            expect(calculateInsurancePayout(50)).toBe(100)
            expect(calculateInsurancePayout(25)).toBe(50)
        })

        it('should handle zero bet', () => {
            expect(calculateInsurancePayout(0)).toBe(0)
        })
    })

    describe('shouldDealerCheckForBlackjack', () => {
        it('should return true when dealer has Ace as first card and at least 2 cards', () => {
            const cards: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.KING, suit: CardSuit.HEARTS },
            ]
            expect(shouldDealerCheckForBlackjack(cards)).toBe(true)
        })

        it('should return false when dealer has less than 2 cards', () => {
            const cards: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
            ]
            expect(shouldDealerCheckForBlackjack(cards)).toBe(false)
        })

        it('should return false when dealer does not have Ace as first card', () => {
            const cards: Card[] = [
                { value: CardValue.KING, suit: CardSuit.SPADES },
                { value: CardValue.ACE, suit: CardSuit.HEARTS },
            ]
            expect(shouldDealerCheckForBlackjack(cards)).toBe(false)
        })
    })

    describe('dealerHasBlackjack', () => {
        it('should return true when dealer has Ace and 10-value card', () => {
            const aceFirst: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.KING, suit: CardSuit.HEARTS },
            ]
            expect(dealerHasBlackjack(aceFirst)).toBe(true)

            const aceSecond: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.QUEEN, suit: CardSuit.DIAMONDS },
            ]
            expect(dealerHasBlackjack(aceSecond)).toBe(true)

            const aceThird: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.JACK, suit: CardSuit.CLUBS },
            ]
            expect(dealerHasBlackjack(aceThird)).toBe(true)

            const aceFourth: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.TEN, suit: CardSuit.HEARTS },
            ]
            expect(dealerHasBlackjack(aceFourth)).toBe(true)
        })

        it('should return false when dealer has Ace but non-10-value second card', () => {
            const cards: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.NINE, suit: CardSuit.HEARTS },
            ]
            expect(dealerHasBlackjack(cards)).toBe(false)
        })

        it('should return false when dealer has less than 2 cards', () => {
            const cards: Card[] = [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
            ]
            expect(dealerHasBlackjack(cards)).toBe(false)
        })

        it('should return false when dealer has 10-value first but Ace second', () => {
            const cards: Card[] = [
                { value: CardValue.KING, suit: CardSuit.SPADES },
                { value: CardValue.ACE, suit: CardSuit.HEARTS },
            ]
            expect(dealerHasBlackjack(cards)).toBe(false)
        })
    })
})
