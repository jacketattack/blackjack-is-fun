import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PlayerActions } from './player-actions'
import { CardSuit, CardValue } from '../../interfaces/card.interface'

describe('PlayerActions Component', () => {
    test('renders all action buttons', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TWO, suit: CardSuit.DIAMONDS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('HIT')).toBeInTheDocument()
        expect(screen.getByText('DOUBLE DOWN')).toBeInTheDocument()
        expect(screen.getByText('SPLIT')).toBeInTheDocument()
        expect(screen.getByText('STAND')).toBeInTheDocument()
    })

    test('disables double down button when hand has more than 2 cards', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TWO, suit: CardSuit.DIAMONDS },
                    { value: CardValue.FIVE, suit: CardSuit.HEARTS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('DOUBLE DOWN')).toBeDisabled()
    })

    test('enables double down button when hand has exactly 2 cards', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TWO, suit: CardSuit.DIAMONDS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('DOUBLE DOWN')).not.toBeDisabled()
    })

    test('disables split button when hand has more than 2 cards', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TWO, suit: CardSuit.DIAMONDS },
                    { value: CardValue.FIVE, suit: CardSuit.HEARTS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('SPLIT')).toBeDisabled()
    })

    test('disables split button when hand has 2 cards with different values', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.TWO, suit: CardSuit.DIAMONDS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('SPLIT')).toBeDisabled()
    })

    test('enables split button when hand has 2 cards with same value', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.EIGHT, suit: CardSuit.CLUBS },
                    { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('SPLIT')).not.toBeDisabled()
    })

    test('enables split button for a pair of Aces', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.ACE, suit: CardSuit.CLUBS },
                    { value: CardValue.ACE, suit: CardSuit.DIAMONDS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('SPLIT')).not.toBeDisabled()
    })

    test('enables split button for a pair of Kings', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.KING, suit: CardSuit.CLUBS },
                    { value: CardValue.KING, suit: CardSuit.DIAMONDS },
                ]}
                onHit={jest.fn()}
                onDoubleDown={jest.fn()}
                onSplit={jest.fn()}
                onStand={jest.fn()}
            />
        )

        expect(screen.getByText('SPLIT')).not.toBeDisabled()
    })
})
