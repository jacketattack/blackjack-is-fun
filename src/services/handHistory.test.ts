import {
    getHandHistory,
    addHandHistoryEntry,
    clearHandHistory,
    createHandHistoryEntry,
    HandOutcome,
} from './handHistory'
import { Card, CardSuit, CardValue } from '../interfaces/card.interface'

describe('Hand History Service', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    describe('getHandHistory', () => {
        it('should return empty array when localStorage is empty', () => {
            const history = getHandHistory()
            expect(history).toEqual([])
        })

        it('should return parsed history from localStorage', () => {
            const mockHistory = [
                {
                    id: '1',
                    timestamp: '2024-01-01T00:00:00.000Z',
                    dealerCards: [],
                    dealerTotal: 0,
                    playerCards: [],
                    playerTotal: 0,
                    outcome: HandOutcome.WIN,
                },
            ]
            localStorage.setItem(
                'blackjackHandHistory',
                JSON.stringify(mockHistory)
            )
            const history = getHandHistory()
            expect(history).toEqual(mockHistory)
        })

        it('should return empty array when localStorage contains invalid JSON', () => {
            localStorage.setItem('blackjackHandHistory', 'invalid json')
            const history = getHandHistory()
            expect(history).toEqual([])
        })
    })

    describe('addHandHistoryEntry', () => {
        it('should add entry with generated id and timestamp', () => {
            const entry = addHandHistoryEntry({
                dealerCards: [],
                dealerTotal: 20,
                playerCards: [],
                playerTotal: 21,
                outcome: HandOutcome.WIN,
            })

            expect(entry.id).toBeDefined()
            expect(entry.timestamp).toBeDefined()
            expect(new Date(entry.timestamp).getTime()).not.toBeNaN()
        })

        it('should add entry to the beginning of history', () => {
            const firstEntry = addHandHistoryEntry({
                dealerCards: [],
                dealerTotal: 20,
                playerCards: [],
                playerTotal: 21,
                outcome: HandOutcome.WIN,
            })

            const secondEntry = addHandHistoryEntry({
                dealerCards: [],
                dealerTotal: 18,
                playerCards: [],
                playerTotal: 17,
                outcome: HandOutcome.LOSS,
            })

            const history = getHandHistory()
            expect(history[0].id).toBe(secondEntry.id)
            expect(history[1].id).toBe(firstEntry.id)
        })

        it('should limit history to MAX_HISTORY_ENTRIES', () => {
            // Add more than MAX_HISTORY_ENTRIES entries
            for (let i = 0; i < 25; i++) {
                addHandHistoryEntry({
                    dealerCards: [],
                    dealerTotal: 20,
                    playerCards: [],
                    playerTotal: i % 2 === 0 ? 21 : 19,
                    outcome: i % 2 === 0 ? HandOutcome.WIN : HandOutcome.LOSS,
                })
            }

            const history = getHandHistory()
            expect(history.length).toBeLessThanOrEqual(20)
        })
    })

    describe('clearHandHistory', () => {
        it('should remove hand history from localStorage', () => {
            addHandHistoryEntry({
                dealerCards: [],
                dealerTotal: 20,
                playerCards: [],
                playerTotal: 21,
                outcome: HandOutcome.WIN,
            })

            clearHandHistory()
            expect(localStorage.getItem('blackjackHandHistory')).toBeNull()
        })
    })

    describe('createHandHistoryEntry', () => {
        it('should create entry with calculated totals', () => {
            const dealerCards = [
                { value: CardValue.TEN, suit: CardSuit.HEARTS },
                { value: CardValue.SEVEN, suit: CardSuit.DIAMONDS },
            ]
            const playerCards = [
                { value: CardValue.KING, suit: CardSuit.CLUBS },
                { value: CardValue.NINE, suit: CardSuit.SPADES },
            ]

            const entry = createHandHistoryEntry(
                dealerCards,
                playerCards,
                HandOutcome.WIN,
                10,
                10
            )

            expect(entry.dealerTotal).toBe(17)
            expect(entry.playerTotal).toBe(19)
            expect(entry.outcome).toBe(HandOutcome.WIN)
            expect(entry.betAmount).toBe(10)
            expect(entry.bankrollChange).toBe(10)
        })

        it('should handle empty cards array', () => {
            const entry = createHandHistoryEntry([], [], HandOutcome.PUSH)

            expect(entry.dealerTotal).toBe(0)
            expect(entry.playerTotal).toBe(0)
        })
    })
})
