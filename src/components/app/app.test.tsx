import { fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { App } from './app'
import React from 'react'
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
    fireEvent.click(screen.getByText('New Game'))

    fireEvent.click(screen.getByText('STAND'))

    expect(screen.getByText('Total: 17')).toBeVisible()
    expect(screen.getByText('Total: 14')).toBeVisible()
})

test('Player is dealt two kings', () => {
    mockDealHand(CardValue.SEVEN, CardValue.KING)
    mockDealHand(CardValue.KING, CardValue.KING)

    render(<App />)
    fireEvent.click(screen.getByText('New Game'))

    fireEvent.click(screen.getByText('SPLIT'))

    expect(screen.getByText('PLAYER').nextSibling.childNodes.length).toBe(2)
})

test('Player won', () => {
    mockDealHand(CardValue.SEVEN, CardValue.TEN)
    mockDealHand(CardValue.ACE, CardValue.TEN)

    render(<App />)
    fireEvent.click(screen.getByText('New Game'))

    fireEvent.click(screen.getByText('STAND'))

    expect(screen.getByText('WINNER')).toBeInTheDocument()
})

test('Player lost when dealer is dealt a blackjack', () => {
    mockDealHand(CardValue.ACE, CardValue.KING) // Dealer
    mockDealHand(CardValue.TEN, CardValue.TEN) // Player

    render(<App />)
    fireEvent.click(screen.getByText('New Game'))

    expect(screen.getByText('LOSER')).toBeInTheDocument()
})

function mockDealHand(
    firstCardValue: CardValue,
    secondCardValue: CardValue,
    finished: boolean = true,
    firstCardSuit: CardSuit = CardSuit.CLUBS,
    secondCardSuit: CardSuit = CardSuit.DIAMONDS
) {
    return jest.spyOn(deck, 'dealHand').mockImplementation(() => ({
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
        bet: 10,
    }))
}
