import { Card, CardValue } from '../interfaces/card.interface'

export interface InsuranceState {
    isOffered: boolean
    isAccepted: boolean
    betAmount: number
    payout: number | null
}

const INSURANCE_PAYOUT_RATIO = 2

export function checkInsuranceOffered(dealerCard: Card): boolean {
    return dealerCard.value === CardValue.ACE
}

export function calculateInsuranceBet(originalBet: number): number {
    return Math.floor(originalBet / 2)
}

export function calculateInsurancePayout(insuranceBet: number): number {
    return insuranceBet * INSURANCE_PAYOUT_RATIO
}

export function shouldDealerCheckForBlackjack(dealerCards: Card[]): boolean {
    // Dealer should check for blackjack if they have an Ace as first card
    return dealerCards.length >= 2 && dealerCards[0].value === CardValue.ACE
}

export function dealerHasBlackjack(dealerCards: Card[]): boolean {
    if (dealerCards.length < 2) return false

    const firstCard = dealerCards[0]
    const secondCard = dealerCards[1]

    // Check if first card is Ace and second card is 10-value
    const isAceFirst = firstCard.value === CardValue.ACE
    const secondCardValue = getCardValue(secondCard)
    const isTenValue = secondCardValue === 10

    return isAceFirst && isTenValue
}

function getCardValue(card: Card): number {
    switch (card.value) {
        case CardValue.TWO:
        case CardValue.THREE:
        case CardValue.FOUR:
        case CardValue.FIVE:
        case CardValue.SIX:
        case CardValue.SEVEN:
        case CardValue.EIGHT:
        case CardValue.NINE:
            return parseInt(card.value, 10)
        case CardValue.TEN:
        case CardValue.JACK:
        case CardValue.QUEEN:
        case CardValue.KING:
            return 10
        case CardValue.ACE:
            return 11
        default:
            return 0
    }
}
