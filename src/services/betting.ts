import {
    BettingState,
    DEFAULT_BET_AMOUNT,
    DEFAULT_STARTING_BANKROLL,
} from '../interfaces/betting.interface'

/**
 * Creates a new betting state with the default starting bankroll and bet amount
 */
export function initializeBettingState(
    startingBankroll: number = DEFAULT_STARTING_BANKROLL,
    betAmount: number = DEFAULT_BET_AMOUNT
): BettingState {
    return {
        bankroll: startingBankroll,
        currentBet: 0,
        betAmount,
    }
}

/**
 * Places a bet and deducts it from the bankroll
 * Returns true if bet was successful, false if insufficient funds
 */
export function placeBet(state: BettingState): BettingState {
    if (state.bankroll < state.betAmount) {
        return state
    }

    return {
        ...state,
        bankroll: state.bankroll - state.betAmount,
        currentBet: state.betAmount,
    }
}

/**
 * Adds winnings to the bankroll (for wins)
 * @param state - Current betting state
 * @param payoutMultiplier - Payout multiplier (default 2 for regular win, 2.5 for blackjack)
 */
export function addWinnings(
    state: BettingState,
    payoutMultiplier: number = 2
): BettingState {
    return {
        ...state,
        bankroll: state.bankroll + state.currentBet * payoutMultiplier,
        currentBet: 0,
    }
}

/**
 * Adds half the bet back (for push/tie)
 */
export function addPush(state: BettingState): BettingState {
    return {
        ...state,
        bankroll: state.bankroll + state.currentBet,
        currentBet: 0,
    }
}

/**
 * Loses the current bet (currentBet is already deducted)
 */
export function resetBet(state: BettingState): BettingState {
    return {
        ...state,
        currentBet: 0,
    }
}

/**
 * Check if player can place a bet
 */
export function canPlaceBet(state: BettingState): boolean {
    return state.bankroll >= state.betAmount
}

/**
 * Check if player can double down (has enough bankroll for additional bet)
 */
export function canDoubleDown(state: BettingState): boolean {
    return state.bankroll >= state.currentBet
}

/**
 * Check if player can split (has enough bankroll for additional bet)
 */
export function canSplit(state: BettingState): boolean {
    return state.bankroll >= state.currentBet
}

/**
 * Double down: add current bet amount to bankroll deduction
 */
export function doubleDownBet(state: BettingState): BettingState {
    if (!canDoubleDown(state)) {
        return state
    }

    return {
        ...state,
        bankroll: state.bankroll - state.currentBet,
        currentBet: state.currentBet * 2,
    }
}

/**
 * Split: add bet amount to bankroll deduction (for the split hand)
 */
export function splitBet(state: BettingState): BettingState {
    if (!canSplit(state)) {
        return state
    }

    return {
        ...state,
        bankroll: state.bankroll - state.currentBet,
        // currentBet stays the same - each hand will have the same bet
    }
}
