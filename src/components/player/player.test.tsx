import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Player } from './player'
import React from 'react'
import * as deck from '../../services/deck'
import { CardSuit, CardValue } from '../../interfaces/card.interface'
import { initializeBettingState } from '../../services/betting'

describe('Player Component', () => {
    afterEach(cleanup)

    function mockInitialDeal(cards: any[]) {
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: cards,
            finished: false,
            bet: 0,
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
                bettingState={initializeBettingState()}
                onBettingStateChange={jest.fn()}
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
                bettingState={initializeBettingState()}
                onBettingStateChange={jest.fn()}
            />
        )

        fireEvent.click(screen.getByText('STAND'))

        expect(onFinished).toHaveBeenCalled()
    })

    test('bankroll increases when player wins', () => {
        // Mock dealHand to return a player hand with total 18 (winning against dealer's 15)
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: [
                { value: CardValue.TEN, suit: CardSuit.CLUBS },
                { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS }, // Player total: 18
            ],
            finished: false,
            bet: 10,
        })

        const onFinished = jest.fn()
        const onBankrollUpdate = jest.fn()
        const dealerHand = [
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.FIVE, suit: CardSuit.DIAMONDS }, // Dealer total: 15
        ]

        // Start the game (player gets a hand)
        const { rerender } = render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(100, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Simulate player standing (finishing their hand)
        fireEvent.click(screen.getByText('STAND'))

        // Simulate dealer's turn with the dealer's hand
        rerender(
            <Player
                name="PLAYER"
                dealerHand={dealerHand}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(100, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Verify bankroll update was called with the correct winnings (bet amount)
        expect(onBankrollUpdate).toHaveBeenCalledWith(10)
    })

    test('bankroll decreases when player loses', () => {
        // Mock dealHand to return a player hand with total 14 (losing to dealer's 18)
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: [
                { value: CardValue.TEN, suit: CardSuit.CLUBS },
                { value: CardValue.FOUR, suit: CardSuit.DIAMONDS }, // Player total: 14
            ],
            finished: false,
            bet: 10,
        })

        const onFinished = jest.fn()
        const onBankrollUpdate = jest.fn()
        const dealerHand = [
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS }, // Dealer total: 18
        ]

        // Start the game (player gets a hand)
        const { rerender } = render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(100, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Simulate player standing (finishing their hand)
        fireEvent.click(screen.getByText('STAND'))

        // Simulate dealer's turn with the dealer's hand
        rerender(
            <Player
                name="PLAYER"
                dealerHand={dealerHand}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(100, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Verify bankroll update was called with the correct loss (-bet amount)
        expect(onBankrollUpdate).toHaveBeenCalledWith(-10)
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
                bettingState={initializeBettingState()}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={jest.fn()}
            />
        )

        rerender(
            <Player
                name="PLAYER"
                dealerHand={dealerHand}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(90, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={jest.fn()}
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
                bettingState={initializeBettingState()}
                onBettingStateChange={jest.fn()}
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
                bettingState={initializeBettingState()}
                onBettingStateChange={jest.fn()}
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

    test('pays 3:2 for blackjack win', () => {
        // Mock dealHand to return a blackjack hand (Ace + King = 21)
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.KING, suit: CardSuit.DIAMONDS }, // Blackjack: 21 with 2 cards
            ],
            finished: false,
            bet: 10,
        })

        const onFinished = jest.fn()
        const onBankrollUpdate = jest.fn()
        const dealerHand = [
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.SIX, suit: CardSuit.DIAMONDS }, // Dealer total: 16
        ]

        // Start the game (player gets a blackjack hand)
        const { rerender } = render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(100, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Simulate dealer's turn with the dealer's hand
        rerender(
            <Player
                name="PLAYER"
                dealerHand={dealerHand}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(90, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Verify bankroll update was called with the correct winnings (3:2 payout = 15 for a $10 bet)
        expect(onBankrollUpdate).toHaveBeenCalledWith(15)
    })

    test('pays 1:1 for regular win', () => {
        // Mock dealHand to return a regular winning hand (e.g., 19)
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: [
                { value: CardValue.TEN, suit: CardSuit.CLUBS },
                { value: CardValue.NINE, suit: CardSuit.DIAMONDS }, // Player total: 19
            ],
            finished: false,
            bet: 10,
        })

        const onFinished = jest.fn()
        const onBankrollUpdate = jest.fn()
        const dealerHand = [
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.SIX, suit: CardSuit.DIAMONDS }, // Dealer total: 16
        ]

        // Start the game (player gets a regular winning hand)
        const { rerender } = render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(100, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Simulate player standing (finishing their hand)
        fireEvent.click(screen.getByText('STAND'))

        // Simulate dealer's turn with the dealer's hand
        rerender(
            <Player
                name="PLAYER"
                dealerHand={dealerHand}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(90, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Verify bankroll update was called with the correct winnings (1:1 payout = 10 for a $10 bet)
        expect(onBankrollUpdate).toHaveBeenCalledWith(10)
    })

    test('returns original bet for push', () => {
        // Mock dealHand to return a hand that ties with the dealer
        jest.spyOn(deck, 'dealHand').mockReturnValue({
            cards: [
                { value: CardValue.TEN, suit: CardSuit.CLUBS },
                { value: CardValue.SIX, suit: CardSuit.DIAMONDS }, // Player total: 16
            ],
            finished: false,
            bet: 10,
        })

        const onFinished = jest.fn()
        const onBankrollUpdate = jest.fn()
        const dealerHand = [
            { value: CardValue.TEN, suit: CardSuit.CLUBS },
            { value: CardValue.SIX, suit: CardSuit.DIAMONDS }, // Dealer total: 16 (push)
        ]

        // Start the game (player gets a hand that will push)
        const { rerender } = render(
            <Player
                name="PLAYER"
                dealerHand={[]}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(100, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Simulate player standing (finishing their hand)
        fireEvent.click(screen.getByText('STAND'))

        // Simulate dealer's turn with the dealer's hand
        rerender(
            <Player
                name="PLAYER"
                dealerHand={dealerHand}
                onHasFinishedActions={onFinished}
                bettingState={initializeBettingState(90, 10)}
                onBettingStateChange={jest.fn()}
                onBankrollUpdate={onBankrollUpdate}
            />
        )

        // Verify bankroll update was called with 0 (push, no net change)
        expect(onBankrollUpdate).toHaveBeenCalledWith(0)
    })
})
