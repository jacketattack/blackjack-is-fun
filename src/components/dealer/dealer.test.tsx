import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Dealer } from './dealer'
import React from 'react'
import * as dealerStrategy from '../../services/dealerStrategy'
import { CardSuit, CardValue } from '../../interfaces/card.interface'
import * as deck from '../../services/deck'

describe('Dealer Component', () => {
    afterEach(cleanup)

    function mockDealHand(cards: {value: string; suit: string}[]) {
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: cards,
            finished: false,
        })
    }

    test('renders dealer name', () => {
        render(
            <Dealer playerFinalTotals={[]} onHasFinishedPlaying={jest.fn()} />
        )
        expect(screen.getByText('DEALER')).toBeInTheDocument()
    })

    test('hides one card when game is active', () => {
        mockDealHand([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.FIVE, suit: CardSuit.DIAMONDS },
        ])

        render(
            <Dealer playerFinalTotals={[]} onHasFinishedPlaying={jest.fn()} />
        )

        // Should only show one card (Total: 10) initially
        expect(screen.getByText(/Total: 10/)).toBeInTheDocument()
    })

    test('plays hand when player finishes', () => {
        const onFinished = jest.fn()
        const initialCards = [
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.SIX, suit: CardSuit.DIAMONDS },
        ]
        const finalCards = [
            ...initialCards,
            { value: CardValue.FIVE, suit: CardSuit.HEARTS },
        ]

        mockDealHand(initialCards)
        jest.spyOn(dealerStrategy, 'playDealerHand').mockReturnValue(finalCards)

        const { rerender } = render(
            <Dealer playerFinalTotals={[]} onHasFinishedPlaying={onFinished} />
        )

        // Simulate player finishing with a total of 18
        rerender(
            <Dealer
                playerFinalTotals={[18]}
                onHasFinishedPlaying={onFinished}
            />
        )

        expect(dealerStrategy.playDealerHand).toHaveBeenCalled()
        expect(onFinished).toHaveBeenCalledWith(finalCards)
    })

    test('does not play if player busted all hands', () => {
        const onFinished = jest.fn()
        mockDealHand([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.SIX, suit: CardSuit.DIAMONDS },
        ])
        // Reset the spy to clear the call from the initial render's useEffect
        const playSpy = jest
            .spyOn(dealerStrategy, 'playDealerHand')
            .mockReturnValue([])

        const { rerender } = render(
            <Dealer playerFinalTotals={[]} onHasFinishedPlaying={onFinished} />
        )

        playSpy.mockClear()

        // Player busted (total 22)
        rerender(
            <Dealer
                playerFinalTotals={[22]}
                onHasFinishedPlaying={onFinished}
            />
        )

        expect(playSpy).not.toHaveBeenCalled()
    })
})
