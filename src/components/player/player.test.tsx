import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Player } from './player'
import React from 'react'
import * as deck from '../../services/deck'
import { CardSuit, CardValue } from '../../interfaces/card.interface'

describe('Player Component', () => {
    afterEach(cleanup)

    function mockInitialDeal(cards: any[]) {
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: cards,
            finished: false,
        })
    }

    test('renders player name', () => {
        mockInitialDeal([
            { value: CardValue.TWO, suit: CardSuit.CLUBS },
            { value: CardValue.THREE, suit: CardSuit.CLUBS },
        ])
        render(
            <Player
                name="TEST PLAYER"
                dealerHand={[]}
                onHasFinishedActions={jest.fn()}
            />
        )
        expect(screen.getByText('TEST PLAYER')).toBeInTheDocument()
    })

    test('calls onHasFinishedActions when standing', () => {
        const onFinished = jest.fn()
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
        ])

        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        fireEvent.click(screen.getByText('STAND'))

        expect(onFinished).toHaveBeenCalled()
    })

    test('draws card when hitting', () => {
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.TWO, suit: CardSuit.CLUBS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.FIVE,
            suit: CardSuit.SPADES,
        })

        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={jest.fn()}
            />
        )

        fireEvent.click(screen.getByText('HIT'))

        // Check for the new total display
        expect(screen.getByText(/Total: 17/)).toBeInTheDocument()
    })

    test('splits hand when requested', () => {
        // Mock dealing two 8s
        mockInitialDeal([
            { value: CardValue.EIGHT, suit: CardSuit.CLUBS },
            { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS },
        ])
        // Mock drawCard for the two new hands
        jest.spyOn(deck, 'drawCard')
            .mockReturnValueOnce({
                value: CardValue.TEN,
                suit: CardSuit.HEARTS,
            })
            .mockReturnValueOnce({
                value: CardValue.TWO,
                suit: CardSuit.SPADES,
            })

        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={jest.fn()}
            />
        )

        fireEvent.click(screen.getByText('SPLIT'))

        // Should now see two hands
        const hands = screen.getAllByTestId('hand-of-cards')
        expect(hands.length).toBe(2)

        // Alternatively check for total displays
        expect(screen.getByText(/Total: 18/)).toBeInTheDocument() // 8 + 10
        expect(screen.getByText(/Total: 10/)).toBeInTheDocument() // 8 + 2
    })
})
