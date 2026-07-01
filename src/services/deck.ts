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

export function dealHand(): BlackjackHand {
    checkShoePenetration()
    return {
        cards: [drawCard(), drawCard()],
        finished: false,
        bet: 0, // Initialize bet field
    }
}

export function drawCard(): Card {
    if (shoe.length === 0) {
        buildNewShoe()
    }
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
}

function checkShoePenetration(): void {
    const totalCards = NUMBER_OF_DECKS * 52
    const usedCards = totalCards - shoe.length
    if (shoe.length === 0 || usedCards / totalCards >= PENETRATION_LIMIT) {
        buildNewShoe()
    }
}
