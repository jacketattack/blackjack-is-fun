import shuffle from 'lodash/shuffle'
import {
    BlackjackHand,
    Card,
    CardSuit,
    CardValue,
} from '../interfaces/card.interface'

const NUMBER_OF_DECKS = 6
const PENETRATION_LIMIT = 0.75

let shoe: Card[] = []
let lastShoeLength = 0
let reshuffleCount = 0

// Track if we just reshuffled
let justReshuffled = false

// Initialize shoe on first use
function initializeShoe(): void {
    if (shoe.length === 0) {
        buildNewShoe()
    }
}

export interface ShoeStatus {
    totalCards: number
    remainingCards: number
    penetrationPercentage: number
    decksRemaining: number
    reshuffleCount: number
    wasJustReshuffled: boolean
}

export function dealHand(): BlackjackHand {
    initializeShoe()
    const wasReshuffled = checkShoePenetration()
    if (wasReshuffled) {
        justReshuffled = true
    }
    return {
        cards: [drawCard(), drawCard()],
        finished: false,
    }
}

export function drawCard(): Card {
    initializeShoe()
    checkShoePenetration()
    if (shoe.length === 0) {
        buildNewShoe()
        justReshuffled = true
    }

    // Reset justReshuffled flag after a card is drawn
    if (justReshuffled && shoe.length < lastShoeLength) {
        justReshuffled = false
    }

    lastShoeLength = shoe.length
    return shoe.pop()!
}

export function drawPair(): BlackjackHand {
    return {
        cards: [
            {
                value: CardValue.TWO,
                suit: CardSuit.CLUBS,
            },
            {
                value: CardValue.TWO,
                suit: CardSuit.CLUBS,
            },
        ],
        finished: false,
    }
}

function buildNewShoe(): void {
    const newShoe: Card[] = []
    for (let i = 0; i < NUMBER_OF_DECKS; i++) {
        Object.values(CardSuit).forEach((suit) => {
            Object.values(CardValue).forEach((value) => {
                newShoe.push({ suit, value })
            })
        })
    }
    shoe = shuffle(newShoe)
    reshuffleCount++
}

function checkShoePenetration(): boolean {
    const totalCards = NUMBER_OF_DECKS * 52
    const usedCards = totalCards - shoe.length
    if (shoe.length === 0 || usedCards / totalCards >= PENETRATION_LIMIT) {
        buildNewShoe()
        return true
    }
    return false
}

export function getShoeStatus(): ShoeStatus {
    const totalCards = NUMBER_OF_DECKS * 52
    const remainingCards = shoe.length
    const usedCards = totalCards - remainingCards
    const penetrationPercentage = (usedCards / totalCards) * 100
    const decksRemaining = remainingCards / 52

    return {
        totalCards,
        remainingCards,
        penetrationPercentage,
        decksRemaining,
        reshuffleCount,
        wasJustReshuffled: justReshuffled,
    }
}

export function resetShoe(): void {
    shoe = []
    lastShoeLength = 0
    reshuffleCount = 0
    justReshuffled = false
    // Rebuild the shoe immediately
    buildNewShoe()
    // Reset reshuffle count back to 0 since this is the initial build
    reshuffleCount = 0
}

export function getPenetrationLimit(): number {
    return PENETRATION_LIMIT
}

export function getNumberOfDecks(): number {
    return NUMBER_OF_DECKS
}
