import { Card, CardSuit, CardValue } from '../interfaces/card.interface'
import calculateHandOfCardsTotal, { CardTotal } from './handOfCardsCalculation'

describe('invalid cards', () => {
    const emptyTotal: CardTotal = {
        total: 0,
        isSoft: false,
        blackjack: false,
    }

    test('null', () => {
        expect(calculateHandOfCardsTotal(null)).toStrictEqual(emptyTotal)
    })

    test('empty', () => {
        expect(calculateHandOfCardsTotal([])).toStrictEqual(emptyTotal)
    })
})

describe('hard totals', () => {
    test('single card', () => {
        const cards: Card[] = [createCard(CardValue.JACK)]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(hardHand(10))
    })

    test('two cards', () => {
        const cards: Card[] = [
            createCard(CardValue.JACK),
            createCard(CardValue.FIVE),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(hardHand(15))
    })

    test('one copy of all non-aces', () => {
        const cards: Card[] = []
        Object.values(CardValue)
            .filter((cardValue: CardValue) => cardValue !== CardValue.ACE)
            .forEach((cardValue: CardValue) => {
                cards.push(createCard(cardValue))
            })

        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(hardHand(84))
    })

    test('single, hard ace', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.JACK),
            createCard(CardValue.QUEEN),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual({
            ...hardHand(21),
            blackjack: false,
        })
    })

    test('two, hard aces', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.QUEEN),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(hardHand(12))
    })

    test('many, hard aces', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.NINE),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(hardHand(12))
    })
})

describe('soft totals', () => {
    test('single, soft ace', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.TWO),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(softHand(13))
    })

    test('single, soft ace, 21', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.JACK),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(softHand(21))
    })

    test('single, soft ace, 21 from multiple other cards', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.THREE),
            createCard(CardValue.SEVEN),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual({
            ...softHand(21),
            blackjack: false,
        })
    })

    test('soft and hard aces', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.THREE),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual(softHand(15))
    })

    test('all aces 21', () => {
        const cards: Card[] = [
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
            createCard(CardValue.ACE),
        ]
        expect(calculateHandOfCardsTotal(cards)).toStrictEqual({
            ...softHand(21),
            blackjack: false,
        })
    })
})

function createCard(value: CardValue): Card {
    return {
        value,
        suit: CardSuit.DIAMONDS,
    }
}

function hardHand(total: number): CardTotal {
    return {
        total,
        isSoft: false,
        blackjack: total === 21,
    }
}

function softHand(total: number): CardTotal {
    return {
        total,
        isSoft: true,
        blackjack: total === 21,
    }
}
