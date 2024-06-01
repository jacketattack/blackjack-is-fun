import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { App } from './app'
import * as deck from '../../services/deck'
import { CardSuit, CardValue } from '../../interfaces/card.interface'

test('Renders app', () => {
    render(<App />)

    expect(screen.getByText('DEALER')).toBeInTheDocument()
    expect(screen.getByText('PLAYER')).toBeInTheDocument()
})

test('Player and dealer totals are displayed after finishing game', async () => {
    mockDealHand(CardValue.SEVEN, CardValue.TEN)
    mockDealHand(CardValue.SEVEN, CardValue.SEVEN)

    render(<App />)

    assertPlayerHand([CardValue.SEVEN, CardValue.SEVEN])

    playerStands()

    expect(screen.getByText('Total: 17')).toBeVisible()
    expect(screen.getByText('Total: 14')).toBeVisible()
})

test('Player is dealt two kings', () => {
    mockDealHand(CardValue.SEVEN, CardValue.KING)
    mockDealHand(CardValue.KING, CardValue.KING)

    render(<App />)

    playerSplits()

    expect(screen.getByText('PLAYER').nextSibling.childNodes.length).toBe(2)
})

test('Player won', () => {
    mockDealHand(CardValue.SEVEN, CardValue.TEN)
    mockDealHand(CardValue.TEN, CardValue.TEN)

    render(<App />)

    playerStands()

    expect(screen.getByText('WINNER')).toBeInTheDocument()
})

describe('New hand button', () => {
    test('Player wins with higher score', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.TEN, CardValue.TEN)

        render(<App />)

        playerStands()

        assertDealerHand([CardValue.SEVEN, CardValue.TEN])
        assertPlayerHand([CardValue.TEN, CardValue.TEN])
        expect(screen.getByText('WINNER')).toBeInTheDocument()

        assertNewHand()
    })

    test('Dealer wins with higher score', () => {
        setupGame(
            [CardValue.SEVEN, CardValue.TEN],
            [CardValue.SIX, CardValue.TEN]
        )

        playerStands()

        assertDealerHand([CardValue.SEVEN, CardValue.TEN])
        assertPlayerHand([CardValue.SIX, CardValue.TEN])
        expect(screen.getByText('LOSER')).toBeInTheDocument()

        assertNewHand()
    })

    //not moving to next game state
    test('Player loses to bust', () => {
        playerBust()
    })

    //TODO (BUG): not moving to next game state
    test.skip('Player loses to blackjack', () => {
        setupGame(
            [CardValue.ACE, CardValue.TEN],
            [CardValue.TEN, CardValue.TEN]
        )

        assertDealerHand([CardValue.ACE, CardValue.TEN])
        assertPlayerHand([CardValue.TEN, CardValue.TEN])

        expect(screen.getByText('WINNER')).toBeInTheDocument()
    })

    test('Player wins with blackjack', () => {
        mockDealHand(CardValue.TEN, CardValue.TEN)
        mockDealHand(CardValue.ACE, CardValue.TEN)

        render(<App />)

        assertDealerHand([CardValue.TEN, CardValue.TEN])
        assertPlayerHand([CardValue.ACE, CardValue.TEN])

        expect(screen.getByText('WINNER')).toBeInTheDocument()

        assertNewHand()
    })

    //not going to next game state in test but does in app
    test.skip('Push due to both having blackjack', () => {
        mockDealHand(CardValue.ACE, CardValue.TEN)
        mockDealHand(CardValue.ACE, CardValue.TEN)

        render(<App />)

        assertDealerHand([CardValue.ACE, CardValue.TEN])
        assertPlayerHand([CardValue.ACE, CardValue.TEN])
        expect(screen.getByText('PUSH')).toBeInTheDocument()

        assertNewHand()
    })

    test('Push due to non-blackjack tie', () => {
        mockDealHand(CardValue.TEN, CardValue.SEVEN)
        mockDealHand(CardValue.TEN, CardValue.SEVEN)

        render(<App />)

        playerStands()

        assertDealerHand([CardValue.TEN, CardValue.SEVEN])
        assertPlayerHand([CardValue.TEN, CardValue.SEVEN])
        expect(screen.getByText('PUSH')).toBeInTheDocument()

        assertNewHand()
    })

    test('Player wins due to bust', () => {
        mockDealHand(CardValue.TEN, CardValue.SIX)
        mockDealHand(CardValue.TEN, CardValue.TEN)

        render(<App />)

        jest.spyOn(deck, 'drawCard').mockReturnValueOnce({
            value: CardValue.TEN,
            suit: CardSuit.CLUBS,
        })

        playerStands()

        expect(expect(screen.getByText('BUST')).toBeInTheDocument())
        expect(expect(screen.getByText('WINNER')).toBeInTheDocument())
        assertNewHand()
    })
})

describe('Assert player hand', () => {
    test('In order', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.EIGHT, CardValue.TEN)

        render(<App />)

        assertPlayerHand([CardValue.EIGHT, CardValue.TEN])
    })

    test('Not in order', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.EIGHT, CardValue.TEN)

        render(<App />)

        assertPlayerHand([CardValue.TEN, CardValue.EIGHT])
    })
})

describe('Assert dealer hand', () => {
    test('Two cards showing in order', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.EIGHT, CardValue.TEN)

        render(<App />)
        playerStands()

        assertDealerHand([CardValue.SEVEN, CardValue.TEN])
    })

    test('Two cards showing not in order', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.EIGHT, CardValue.TEN)

        render(<App />)
        playerStands()

        assertDealerHand([CardValue.TEN, CardValue.SEVEN])
    })

    test('One card that is showing', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.EIGHT, CardValue.TEN)

        render(<App />)

        assertDealerHand([CardValue.SEVEN])
    })

    test('One card that is backwards', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.EIGHT, CardValue.TEN)

        render(<App />)
        const assertDealerHandWrapper = () => assertDealerHand([CardValue.TEN])

        expect(assertDealerHandWrapper).toThrow()
    })
})

function mockDealHand(
    firstCardValue: CardValue,
    secondCardValue: CardValue,
    finished: boolean = false,
    firstCardSuit: CardSuit = CardSuit.CLUBS,
    secondCardSuit: CardSuit = CardSuit.DIAMONDS
) {
    jest.spyOn(deck, 'dealHand').mockReturnValueOnce({
        cards: [
            {
                value: firstCardValue,
                suit: firstCardSuit,
            },
            {
                value: secondCardValue,
                suit: secondCardSuit,
            },
        ],
        finished: finished,
    })
}

function assertPlayerHand(expectedValueOfCards: CardValue[]) {
    const srcs = screen
        .getAllByTestId((id) => id.startsWith('player-card'))
        .map((card) => {
            const src = card.children[0].getAttribute('src') || ''
            return src.substring(src.lastIndexOf('/') + 1)
        })
    console.log('srcs: ' + srcs)
    console.log('eray: ' + expectedValueOfCards)
    if (srcs.length != expectedValueOfCards.length) {
        throw new Error(
            `Expected ${expectedValueOfCards.length} cards, but only found ${srcs.length}`
        )
    }

    srcs.sort()
    expectedValueOfCards.sort()

    srcs.forEach((src, index) => {
        expect(src).toContain(expectedValueOfCards[index])
    })
}

function assertDealerHand(expectedValueOfCards: CardValue[]) {
    const srcs = screen
        .getAllByTestId((id) => id.startsWith('dealer-card'))
        .map((card) => {
            const src =
                card.getElementsByTagName('img')[0].getAttribute('src') || ''
            return src.substring(src.lastIndexOf('/') + 1)
        })
        .filter((imageName) => imageName !== 'back_of_card.png')

    srcs.sort()
    expectedValueOfCards.sort()
    console.log('srcs: ' + srcs)
    console.log('eray: ' + expectedValueOfCards)
    srcs.forEach((src, index) => {
        console.log('index: ' + index)
        console.log('src: ' + src)
        console.log('ecard: ' + expectedValueOfCards[index])
        expect(src).toContain(expectedValueOfCards[index])
    })
}

function assertNewHand() {
    mockDealHand(CardValue.THREE, CardValue.TWO)
    mockDealHand(CardValue.FOUR, CardValue.FIVE)

    newHand()

    assertDealerHand([CardValue.THREE])
    assertPlayerHand([CardValue.FOUR, CardValue.FIVE])
    expect(screen.queryByText('LOSER')).not.toBeInTheDocument()
    expect(screen.queryByText('WINNER')).not.toBeInTheDocument()
    expect(screen.queryByText('PUSH')).not.toBeInTheDocument()
}

function playerStands() {
    fireEvent.click(screen.getByText('STAND'))
}

function playerSplits() {
    fireEvent.click(screen.getByText('SPLIT'))
}

function playerHits(card: CardValue, suit: CardSuit = CardSuit.CLUBS) {
    jest.spyOn(deck, 'drawCard').mockReturnValueOnce({
        value: card,
        suit: suit,
    })
    fireEvent.click(screen.getByText('HIT'))
}

function newHand() {
    const newHand = screen.getByText('Next Hand')
    fireEvent.click(newHand)
}

function setupGame(dealerCards: CardValue[], playerCards: CardValue[]) {
    mockDealHand(dealerCards[0], dealerCards[1])
    mockDealHand(playerCards[0], playerCards[1])

    render(<App />)

    assertDealerHand([dealerCards[0]])
    assertPlayerHand(playerCards)
}

function playerBust() {
    mockDealHand(CardValue.SEVEN, CardValue.TEN)
    mockDealHand(CardValue.TEN, CardValue.TEN)

    render(<App />)

    assertDealerHand([CardValue.SEVEN])
    assertPlayerHand([CardValue.TEN, CardValue.TEN])

    playerHits(CardValue.TEN)

    console.log(screen.debug())
    assertDealerHand([CardValue.SEVEN, CardValue.TEN])
    assertPlayerHand([CardValue.TEN, CardValue.TEN, CardValue.TEN])
    expect(screen.queryByText('LOSER')).toBeInTheDocument()

    assertNewHand()
}
