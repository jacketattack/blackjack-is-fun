import { Card, CardValue } from '../interfaces/card.interface'

const HARD_ACE = 1
const ZERO: CardTotal = {
    total: 0,
    isSoft: false,
    blackjack: false,
}

export interface CardTotal {
    total: number
    isSoft: boolean
    blackjack: boolean
}

function calculateHandOfCardsTotal(cards: Card[]): CardTotal {
    if (cards == null) {
        return ZERO
    }

    const hardTotal: number = calculateHardTotal(cards)
    let isSoft = false
    if (handCanBeSoft(cards, hardTotal)) {
        isSoft = true
    }

    let total: number = isSoft ? hardTotal + 10 : hardTotal
    return {
        total,
        isSoft,
        blackjack: total === 21 && cards.length === 2,
    }
}

function calculateHardTotal(cards: Card[]): number {
    return cards.reduce(addCardToTotal, 0)
}

function addCardToTotal(currentTotal: number, card: Card): number {
    return currentTotal + getBlackjackValueOfCardValue(card.value)
}

function getBlackjackValueOfCardValue(cardValue: CardValue) {
    if (cardValue === CardValue.ACE) {
        return HARD_ACE
    } else if (isNaN(Number(cardValue))) {
        return 10
    } else {
        return Number(cardValue)
    }
}

function handHasAces(cards: Card[]): boolean {
    return cards.filter((card) => card.value === CardValue.ACE).length > 0
}

function handCanBeSoft(cards: Card[], hardTotal: number): boolean {
    return handHasAces(cards) && hardTotal <= 11
}

export default calculateHandOfCardsTotal
