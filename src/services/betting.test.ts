import {
    initializeBettingState,
    placeBet,
    addWinnings,
    addPush,
    resetBet,
    canPlaceBet,
    canDoubleDown,
    canSplit,
    doubleDownBet,
    splitBet,
} from './betting'
import {
    BettingState,
    DEFAULT_BET_AMOUNT,
    DEFAULT_STARTING_BANKROLL,
} from '../interfaces/betting.interface'

describe('Betting Service', () => {
    describe('initializeBettingState', () => {
        it('should create initial betting state with default values', () => {
            const state = initializeBettingState()
            expect(state.bankroll).toBe(DEFAULT_STARTING_BANKROLL)
            expect(state.betAmount).toBe(DEFAULT_BET_AMOUNT)
            expect(state.currentBet).toBe(0)
        })

        it('should create initial betting state with custom starting bankroll', () => {
            const state = initializeBettingState(500)
            expect(state.bankroll).toBe(500)
            expect(state.betAmount).toBe(DEFAULT_BET_AMOUNT)
            expect(state.currentBet).toBe(0)
        })

        it('should create initial betting state with custom bet amount', () => {
            const state = initializeBettingState(100, 25)
            expect(state.bankroll).toBe(100)
            expect(state.betAmount).toBe(25)
            expect(state.currentBet).toBe(0)
        })
    })

    describe('placeBet', () => {
        it('should deduct bet amount from bankroll', () => {
            const state = initializeBettingState(100, 10)
            const result = placeBet(state)
            expect(result.bankroll).toBe(90)
            expect(result.currentBet).toBe(10)
        })

        it('should not place bet if insufficient funds', () => {
            const state: BettingState = {
                bankroll: 5,
                betAmount: 10,
                currentBet: 0,
            }
            const result = placeBet(state)
            expect(result.bankroll).toBe(5)
            expect(result.currentBet).toBe(0)
        })

        it('should place bet when bankroll equals bet amount', () => {
            const state: BettingState = {
                bankroll: 10,
                betAmount: 10,
                currentBet: 0,
            }
            const result = placeBet(state)
            expect(result.bankroll).toBe(0)
            expect(result.currentBet).toBe(10)
        })
    })

    describe('addWinnings', () => {
        it('should add double the current bet to bankroll', () => {
            const state: BettingState = {
                bankroll: 90,
                betAmount: 10,
                currentBet: 10,
            }
            const result = addWinnings(state)
            expect(result.bankroll).toBe(110)
            expect(result.currentBet).toBe(0)
        })

        it('should reset current bet after adding winnings', () => {
            const state: BettingState = {
                bankroll: 100,
                betAmount: 10,
                currentBet: 10,
            }
            const result = addWinnings(state)
            expect(result.currentBet).toBe(0)
        })
    })

    describe('addPush', () => {
        it('should add current bet back to bankroll on push', () => {
            const state: BettingState = {
                bankroll: 90,
                betAmount: 10,
                currentBet: 10,
            }
            const result = addPush(state)
            expect(result.bankroll).toBe(100)
            expect(result.currentBet).toBe(0)
        })
    })

    describe('resetBet', () => {
        it('should reset current bet to zero on loss', () => {
            const state: BettingState = {
                bankroll: 90,
                betAmount: 10,
                currentBet: 10,
            }
            const result = resetBet(state)
            expect(result.currentBet).toBe(0)
            expect(result.bankroll).toBe(90)
        })
    })

    describe('canPlaceBet', () => {
        it('should return true when bankroll has sufficient funds', () => {
            const state: BettingState = {
                bankroll: 100,
                betAmount: 10,
                currentBet: 0,
            }
            expect(canPlaceBet(state)).toBe(true)
        })

        it('should return true when bankroll equals bet amount', () => {
            const state: BettingState = {
                bankroll: 10,
                betAmount: 10,
                currentBet: 0,
            }
            expect(canPlaceBet(state)).toBe(true)
        })

        it('should return false when bankroll is less than bet amount', () => {
            const state: BettingState = {
                bankroll: 5,
                betAmount: 10,
                currentBet: 0,
            }
            expect(canPlaceBet(state)).toBe(false)
        })
    })

    describe('canDoubleDown', () => {
        it('should return true when bankroll has enough for additional bet', () => {
            const state: BettingState = {
                bankroll: 10,
                betAmount: 10,
                currentBet: 10,
            }
            expect(canDoubleDown(state)).toBe(true)
        })

        it('should return false when bankroll is insufficient', () => {
            const state: BettingState = {
                bankroll: 5,
                betAmount: 10,
                currentBet: 10,
            }
            expect(canDoubleDown(state)).toBe(false)
        })

        it('should return true when bankroll exactly equals current bet', () => {
            const state: BettingState = {
                bankroll: 10,
                betAmount: 10,
                currentBet: 10,
            }
            expect(canDoubleDown(state)).toBe(true)
        })
    })

    describe('canSplit', () => {
        it('should return true when bankroll has enough for split bet', () => {
            const state: BettingState = {
                bankroll: 10,
                betAmount: 10,
                currentBet: 10,
            }
            expect(canSplit(state)).toBe(true)
        })

        it('should return false when bankroll is insufficient', () => {
            const state: BettingState = {
                bankroll: 5,
                betAmount: 10,
                currentBet: 10,
            }
            expect(canSplit(state)).toBe(false)
        })
    })

    describe('doubleDownBet', () => {
        it('should double the current bet', () => {
            const state: BettingState = {
                bankroll: 20,
                betAmount: 10,
                currentBet: 10,
            }
            const result = doubleDownBet(state)
            expect(result.currentBet).toBe(20)
            expect(result.bankroll).toBe(10)
        })

        it('should not double down if insufficient funds', () => {
            const state: BettingState = {
                bankroll: 5,
                betAmount: 10,
                currentBet: 10,
            }
            const result = doubleDownBet(state)
            expect(result.currentBet).toBe(10)
            expect(result.bankroll).toBe(5)
        })

        it('should deduct the additional bet from bankroll', () => {
            const state: BettingState = {
                bankroll: 100,
                betAmount: 10,
                currentBet: 10,
            }
            const result = doubleDownBet(state)
            expect(result.bankroll).toBe(90)
            expect(result.currentBet).toBe(20)
        })
    })

    describe('splitBet', () => {
        it('should deduct current bet amount from bankroll for split', () => {
            const state: BettingState = {
                bankroll: 20,
                betAmount: 10,
                currentBet: 10,
            }
            const result = splitBet(state)
            expect(result.bankroll).toBe(10)
            expect(result.currentBet).toBe(10)
        })

        it('should not split if insufficient funds', () => {
            const state: BettingState = {
                bankroll: 5,
                betAmount: 10,
                currentBet: 10,
            }
            const result = splitBet(state)
            expect(result.bankroll).toBe(5)
            expect(result.currentBet).toBe(10)
        })
    })

    describe('full game flow', () => {
        it('should handle complete win scenario', () => {
            let state = initializeBettingState(100, 10)
            expect(state.bankroll).toBe(100)

            // Place bet for first hand
            state = placeBet(state)
            expect(state.bankroll).toBe(90)
            expect(state.currentBet).toBe(10)

            // Win
            state = addWinnings(state)
            expect(state.bankroll).toBe(110)
            expect(state.currentBet).toBe(0)
        })

        it('should handle complete loss scenario', () => {
            let state = initializeBettingState(100, 10)
            state = placeBet(state)
            expect(state.bankroll).toBe(90)

            // Lose
            state = resetBet(state)
            expect(state.bankroll).toBe(90)
            expect(state.currentBet).toBe(0)
        })

        it('should handle push scenario', () => {
            let state = initializeBettingState(100, 10)
            state = placeBet(state)
            expect(state.bankroll).toBe(90)

            // Push
            state = addPush(state)
            expect(state.bankroll).toBe(100)
            expect(state.currentBet).toBe(0)
        })

        it('should handle double down scenario', () => {
            let state = initializeBettingState(100, 10)
            state = placeBet(state)
            expect(state.bankroll).toBe(90)
            expect(state.currentBet).toBe(10)

            // Double down
            state = doubleDownBet(state)
            expect(state.bankroll).toBe(80)
            expect(state.currentBet).toBe(20)

            // Win
            state = addWinnings(state)
            expect(state.bankroll).toBe(120)
            expect(state.currentBet).toBe(0)
        })

        it('should prevent new game if insufficient bankroll', () => {
            let state: BettingState = {
                bankroll: 5,
                betAmount: 10,
                currentBet: 0,
            }

            expect(canPlaceBet(state)).toBe(false)
            state = placeBet(state)
            expect(state.currentBet).toBe(0)
        })
    })
})
