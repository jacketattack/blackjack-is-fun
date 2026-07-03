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

    test('automatically stands when dealer has blackjack', () => {
        const onFinished = jest.fn()
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
        ])

        // Dealer has Blackjack (Ace + King)
        const dealerHand = [
            { value: CardValue.ACE, suit: CardSuit.SPADES },
            { value: CardValue.KING, suit: CardSuit.SPADES },
        ]

        const { rerender } = render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        rerender(
            <Player
                name="PLAYER"
                dealerHand={dealerHand}
                onHasFinishedActions={onFinished}
            />
        )

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

    test('doubles down when requested', () => {
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.TWO,
            suit: CardSuit.SPADES,
        })

        const onFinished = jest.fn()
        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        fireEvent.click(screen.getByText('DOUBLE DOWN'))

        // Should have drawn one card (now has 3 cards total)
        expect(screen.getByText(/Total: 21/)).toBeInTheDocument() // 10 + 9 + 2
        // Should have finished the hand and called onHasFinishedActions
        expect(onFinished).toHaveBeenCalled()
    })

    test('cannot double down with more than 2 cards', () => {
        // Start with a hand that won't bust or reach 21 when hitting
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.TWO, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.THREE,
            suit: CardSuit.SPADES,
        })

        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={jest.fn()}
            />
        )

        // Hit first to get 3 cards (10 + 2 + 3 = 15, won't auto-stand)
        fireEvent.click(screen.getByText('HIT'))

        // Double Down button should now be disabled
        expect(screen.getByText('DOUBLE DOWN')).toBeDisabled()
    })

    test('cannot split with more than 2 cards', () => {
        // Start with a pair that won't bust or reach 21 when hitting
        mockInitialDeal([
            { value: CardValue.EIGHT, suit: CardSuit.CLUBS },
            { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
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

        // Hit first to get 3 cards (8 + 8 + 2 = 18, won't auto-stand)
        fireEvent.click(screen.getByText('HIT'))

        // Split button should now be disabled (find it by role to avoid text matching issues)
        const splitButton = screen.getByText('SPLIT')
        expect(splitButton).toBeDisabled()
    })

    test('cannot split non-pair hands', () => {
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
        ])

        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={jest.fn()}
            />
        )

        // Split button should be disabled for non-pair
        expect(screen.getByText('SPLIT')).toBeDisabled()
    })

    test('splitting creates two independent hands that can be played', () => {
        mockInitialDeal([
            { value: CardValue.EIGHT, suit: CardSuit.CLUBS },
            { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS },
        ])
        // Mock drawCard for split and subsequent hits
        jest.spyOn(deck, 'drawCard')
            .mockReturnValueOnce({
                value: CardValue.TEN,
                suit: CardSuit.HEARTS,
            }) // First split card
            .mockReturnValueOnce({
                value: CardValue.TWO,
                suit: CardSuit.SPADES,
            }) // Second split card
            .mockReturnValueOnce({ value: CardValue.TWO, suit: CardSuit.CLUBS }) // Hit on first hand (8 + 10 + 2 = 20, won't bust)

        const onFinished = jest.fn()
        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        // Split the hand
        fireEvent.click(screen.getByText('SPLIT'))

        // Should have two hands
        const hands = screen.getAllByTestId('hand-of-cards')
        expect(hands.length).toBe(2)

        // Hit on the first hand
        fireEvent.click(screen.getByText('HIT'))

        // Should still have two hands, first hand should have 3 cards (8 + 10 + 2 = 20)
        expect(screen.getByText(/Total: 20/)).toBeInTheDocument()
        expect(screen.getByText(/Total: 10/)).toBeInTheDocument() // 8 + 2
    })

    test('doubling down finishes the hand immediately', () => {
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.TWO,
            suit: CardSuit.SPADES,
        })

        const onFinished = jest.fn()
        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        fireEvent.click(screen.getByText('DOUBLE DOWN'))

        // onHasFinishedActions should be called since the hand is finished
        expect(onFinished).toHaveBeenCalled()

        // The hand should be marked as finished, so we should see the result
        // (though we need dealer hand to see the actual result)
        const hands = screen.getAllByTestId('hand-of-cards')
        expect(hands.length).toBe(1)
    })

    test('splitting Aces creates two hands with one Ace each', () => {
        mockInitialDeal([
            { value: CardValue.ACE, suit: CardSuit.CLUBS },
            { value: CardValue.ACE, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard')
            .mockReturnValueOnce({
                value: CardValue.TEN,
                suit: CardSuit.HEARTS,
            })
            .mockReturnValueOnce({
                value: CardValue.KING,
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

        // Should have two hands with Ace + 10 and Ace + King
        // Both should show BLACKJACK since they have 2 cards totaling 21
        expect(screen.getAllByText('BLACKJACK')).toHaveLength(2)
    })

    test('doubles down and busts', () => {
        mockInitialDeal([
            { value: CardValue.KING, suit: CardSuit.CLUBS },
            { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.THREE,
            suit: CardSuit.SPADES,
        })

        const onFinished = jest.fn()
        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        fireEvent.click(screen.getByText('DOUBLE DOWN'))

        // Should have drawn one card (King + 9 + 3 = 22, bust)
        // When player busts, UI shows "BUST" instead of the total
        expect(screen.getByText('BUST')).toBeInTheDocument()
        // Should have finished the hand and called onHasFinishedActions
        expect(onFinished).toHaveBeenCalled()
    })

    test('doubles down with soft hand containing ace', () => {
        mockInitialDeal([
            { value: CardValue.ACE, suit: CardSuit.CLUBS },
            { value: CardValue.FIVE, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.FIVE,
            suit: CardSuit.SPADES,
        })

        const onFinished = jest.fn()
        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        fireEvent.click(screen.getByText('DOUBLE DOWN'))

        // Should have drawn one card (Ace + 5 + 5)
        // Hard total = 1 + 5 + 5 = 11, soft total = 11 + 10 = 21
        // The UI shows "Total: 21" because when total is 21, it doesn't show "Soft" prefix
        expect(screen.getByText('Total: 21')).toBeInTheDocument()
        // Should have finished the hand and called onHasFinishedActions
        expect(onFinished).toHaveBeenCalled()
    })

    test('doubles down to exactly 21', () => {
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.TWO,
            suit: CardSuit.SPADES,
        })

        const onFinished = jest.fn()
        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        fireEvent.click(screen.getByText('DOUBLE DOWN'))

        // Should have drawn one card (10 + 9 + 2 = 21)
        expect(screen.getByText(/Total: 21/)).toBeInTheDocument()
        // Should have finished the hand and called onHasFinishedActions
        expect(onFinished).toHaveBeenCalled()
    })

    test('doubling down finishes the hand immediately', () => {
        mockInitialDeal([
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS },
        ])
        jest.spyOn(deck, 'drawCard').mockReturnValue({
            value: CardValue.TWO,
            suit: CardSuit.SPADES,
        })

        const onFinished = jest.fn()
        render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
            />
        )

        fireEvent.click(screen.getByText('DOUBLE DOWN'))

        // After doubling down, the hand should be finished
        // The double down button should be disabled for the next hand (if any)
        expect(onFinished).toHaveBeenCalled()
    })
})
