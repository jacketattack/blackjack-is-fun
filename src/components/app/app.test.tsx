import { fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { App } from './app'
import React from 'react'
import * as deck from '../../services/deck'
import { CardSuit, CardValue } from '../../interfaces/card.interface'

// Clear mocks before each test
beforeEach(() => {
    jest.clearAllMocks()
})

test('Renders app', () => {
    render(<App />)

    expect(screen.getByText('DEALER')).toBeInTheDocument()
    expect(screen.getByText('PLAYER')).toBeInTheDocument()
})

test('Player and dealer totals are displayed after finishing game', async () => {
    // Player gets 7 + 10 = 17, Dealer gets 7 + 7 = 14
    let callCount = 0
    jest.spyOn(deck, 'dealHand').mockImplementation(() => {
        const hands = [
            {
                cards: [
                    { value: CardValue.SEVEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
            {
                cards: [
                    { value: CardValue.SEVEN, suit: CardSuit.CLUBS },
                    { value: CardValue.SEVEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
        ]
        return hands[callCount++]
    })

    render(<App />)

    fireEvent.click(screen.getByText('STAND'))

    expect(screen.getByText('Total: 17')).toBeVisible()
    expect(screen.getByText('BUST')).toBeVisible()
})

test.skip('Player is dealt two kings', () => {
    let callCount = 0
    jest.spyOn(deck, 'dealHand').mockImplementation(() => {
        const hands = [
            {
                cards: [
                    { value: CardValue.KING, suit: CardSuit.CLUBS },
                    { value: CardValue.KING, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
            {
                cards: [
                    { value: CardValue.SEVEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
        ]
        return hands[callCount++]
    })

    render(<App />)

    fireEvent.click(screen.getByText('SPLIT'))

    // After split, should have 2 hands
    const handElements = screen.getAllByTestId('hand-of-cards')
    expect(handElements.length).toBe(2)
})

test.skip('Player won', () => {
    let callCount = 0
    jest.spyOn(deck, 'dealHand').mockImplementation(() => {
        const hands = [
            {
                cards: [
                    { value: CardValue.SEVEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
            {
                cards: [
                    { value: CardValue.ACE, suit: CardSuit.CLUBS },
                    { value: CardValue.TEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
        ]
        return hands[callCount++]
    })

    render(<App />)

    fireEvent.click(screen.getByText('STAND'))

    expect(screen.getByText('WINNER')).toBeInTheDocument()
})

test('Dealer hand resets when starting a new game', () => {
    // Mock dealHand to return a player hand and a dealer hand
    let callCount = 0
    jest.spyOn(deck, 'dealHand').mockImplementation(() => {
        const hands = [
            {
                cards: [
                    { value: CardValue.SEVEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
            {
                cards: [
                    { value: CardValue.SEVEN, suit: CardSuit.CLUBS },
                    { value: CardValue.SEVEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
        ]
        return hands[callCount++]
    })

    render(<App />)

    // Simulate finishing a game (player stands)
    fireEvent.click(screen.getByText('STAND'))

    // Verify dealer has a hand (not empty)
    const dealerElement = screen.getByText('DEALER').parentElement
    const dealerHandAfterFirstGame =
        within(dealerElement).getByTestId('hand-of-cards')
    const dealerCardsAfterFirstGame = within(
        dealerHandAfterFirstGame
    ).getAllByRole('img')
    expect(dealerCardsAfterFirstGame.length).toBeGreaterThan(0)

    // Click "New Game" button
    fireEvent.click(screen.getByText('New Game'))

    // Verify dealer hand is now empty (no cards rendered)
    const dealerElementAfterNewGame = screen.getByText('DEALER').parentElement
    const dealerHandAfterNewGame = within(
        dealerElementAfterNewGame
    ).queryByTestId('hand-of-cards')
    if (dealerHandAfterNewGame) {
        const dealerCardsAfterNewGame = within(
            dealerHandAfterNewGame
        ).queryAllByRole('img')
        expect(dealerCardsAfterNewGame.length).toBe(0)
    } else {
        // If no hand-of-cards element exists, dealer has no hand
        expect(true).toBe(true)
    }
})

test.skip('Player lost when dealer is dealt a blackjack', () => {
    let callCount = 0
    jest.spyOn(deck, 'dealHand').mockImplementation(() => {
        const hands = [
            {
                cards: [
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TEN, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
            {
                cards: [
                    { value: CardValue.ACE, suit: CardSuit.CLUBS },
                    { value: CardValue.KING, suit: CardSuit.DIAMONDS },
                ],
                finished: false,
            },
        ]
        return hands[callCount++]
    })

    render(<App />)

    expect(screen.getByText('LOSER')).toBeInTheDocument()
})
