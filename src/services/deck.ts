import sample from 'lodash/sample'
import {
    BlackjackHand,
    Card,
    CardSuit,
    CardValue,
} from '../interfaces/card.interface'

export function dealHand(): BlackjackHand {
    return {
        cards: [drawCard(), drawCard()],
        finished: false,
    }
}

export function drawCard(): Card {
    return {
        value: sample(Object.values(CardValue)) as CardValue,
        suit: sample(Object.values(CardSuit)) as CardSuit,
    }
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
