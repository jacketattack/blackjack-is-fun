import { fireEvent, render, screen } from '@testing-library/react'
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
    mockDealHand(CardValue.ACE, CardValue.TEN)

    render(<App />)

    playerStands()

    expect(screen.getByText('WINNER')).toBeInTheDocument()
})

describe('New hand button', () => {
    test('Player wins', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.ACE, CardValue.TEN)

        render(<App />)

        playerStands()

        assertDealerHand([CardValue.SEVEN, CardValue.TEN])
        assertPlayerHand([CardValue.TEN, CardValue.ACE])
        expect(screen.getByText('WINNER')).toBeInTheDocument()

        mockDealHand(CardValue.THREE, CardValue.TWO)
        mockDealHand(CardValue.FOUR, CardValue.FIVE)

        newHand()

        assertDealerHand([CardValue.THREE])
        assertPlayerHand([CardValue.FOUR, CardValue.FIVE])
    })

    test('Dealer wins with higher score', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.SIX, CardValue.TEN)

        render(<App />)

        playerStands()

        assertDealerHand([CardValue.SEVEN, CardValue.TEN])
        assertPlayerHand([CardValue.SIX, CardValue.TEN])
        expect(screen.getByText('LOSER')).toBeInTheDocument()

        mockDealHand(CardValue.THREE, CardValue.TWO)
        mockDealHand(CardValue.FOUR, CardValue.FIVE)

        newHand()

        assertDealerHand([CardValue.THREE])
        assertPlayerHand([CardValue.FOUR, CardValue.FIVE])
        expect(screen.queryByText('LOSER')).not.toBeInTheDocument()
    })

    //not moving to next game state
    test.skip('Player loses to bust', () => {
        mockDealHand(CardValue.SEVEN, CardValue.TEN)
        mockDealHand(CardValue.TEN, CardValue.TEN)

        render(<App />)
        playerHits(CardValue.TEN)

        assertDealerHand([CardValue.SEVEN])
        assertPlayerHand([CardValue.TEN, CardValue.TEN, CardValue.TEN])

        newHand()
        // expect(screen.queryByText('LOSER')).toBeInTheDocument()
    })

    //not moving to next game state
    test.skip('Player loses to blackjack', () => {
        mockDealHand(CardValue.ACE, CardValue.TEN)
        mockDealHand(CardValue.TEN, CardValue.TEN)

        render(<App />)

        assertDealerHand([CardValue.ACE, CardValue.TEN])
        assertPlayerHand([CardValue.TEN, CardValue.TEN])

        expect(screen.getByText('WINNER')).toBeInTheDocument()
    })

    //not going to next game state in test but does in app
    test('Player wins with blackjack', () => {
        mockDealHand(CardValue.TEN, CardValue.SEVEN)
        mockDealHand(CardValue.ACE, CardValue.TEN)

        render(<App />)

        assertDealerHand([CardValue.TEN, CardValue.SEVEN])
        assertPlayerHand([CardValue.ACE, CardValue.TEN])

        expect(screen.getByText('WINNER')).toBeInTheDocument()
    })

    //not going to next game state in test but does in app
    test('Push due to both having blackjack', () => {
        mockDealHand(CardValue.ACE, CardValue.TEN)
        mockDealHand(CardValue.ACE, CardValue.TEN)

        render(<App />)

        assertDealerHand([CardValue.ACE, CardValue.TEN])
        assertPlayerHand([CardValue.ACE, CardValue.TEN])

        expect(screen.getByText('PUSH')).toBeInTheDocument()
    })

    test('Push due to non-blackjack tie', () => {
        mockDealHand(CardValue.ACE, CardValue.SEVEN)
        mockDealHand(CardValue.ACE, CardValue.SEVEN)

        render(<App />)

        playerStands()

        assertDealerHand([CardValue.ACE, CardValue.SEVEN])
        assertPlayerHand([CardValue.ACE, CardValue.SEVEN])

        expect(screen.getByText('PUSH')).toBeInTheDocument()
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
    finished: boolean = true,
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
        .getAllByRole('img')
        .slice(-2)
        .map((img) => {
            const src = img.getAttribute('src') || ''
            return src.substring(src.lastIndexOf('/') + 1)
        })

    srcs.sort()
    expectedValueOfCards.sort()

    srcs.forEach((src, index) => {
        expect(src).toContain(expectedValueOfCards[index])
    })
}

function assertDealerHand(expectedValueOfCards: CardValue[]) {
    const srcs = screen
        .getAllByRole('img')
        .slice(0, 2)
        .map((img) => {
            const src = img.getAttribute('src') || ''
            return src.substring(src.lastIndexOf('/') + 1)
        })
        .filter((imageName) => imageName !== 'back_of_card.png')

    srcs.sort()
    expectedValueOfCards.sort()

    srcs.forEach((src, index) => {
        expect(src).toContain(expectedValueOfCards[index])
    })
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
