export interface BettingState {
    bankroll: number
    currentBet: number
    betAmount: number // Parameterizable bet amount
}

export const DEFAULT_BET_AMOUNT = 10
export const DEFAULT_STARTING_BANKROLL = 100
