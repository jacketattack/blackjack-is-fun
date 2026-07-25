import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom'
import { PlayerActions } from './player-actions'
import { CardSuit, CardValue } from '../../interfaces/card.interface'

describe('PlayerActions Component', () => {
    const mockHit = jest.fn()
    const mockDoubleDown = jest.fn()
    const mockSplit = jest.fn()
    const mockStand = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders all action buttons', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('HIT')).toBeInTheDocument()
        expect(screen.getByText('DOUBLE DOWN')).toBeInTheDocument()
        expect(screen.getByText('SPLIT')).toBeInTheDocument()
        expect(screen.getByText('STAND')).toBeInTheDocument()
    })

    test('enables Double Down button when hand has exactly 2 cards', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('DOUBLE DOWN')).not.toBeDisabled()
    })

    test('disables Double Down button when hand has more than 2 cards', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
                    { value: CardValue.TWO, suit: CardSuit.HEARTS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('DOUBLE DOWN')).toBeDisabled()
    })

    test('enables Split button when hand has exactly 2 cards of same value', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.EIGHT, suit: CardSuit.CLUBS },
                    { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('SPLIT')).not.toBeDisabled()
    })

    test('disables Split button when hand has exactly 2 cards of different values', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.TEN, suit: CardSuit.CLUBS },
                    { value: CardValue.NINE, suit: CardSuit.DIAMONDS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('SPLIT')).toBeDisabled()
    })

    test('disables Split button when hand has more than 2 cards', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.EIGHT, suit: CardSuit.CLUBS },
                    { value: CardValue.EIGHT, suit: CardSuit.DIAMONDS },
                    { value: CardValue.TWO, suit: CardSuit.HEARTS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('SPLIT')).toBeDisabled()
    })

    test('disables Split button when hand has less than 2 cards', () => {
        render(
            <PlayerActions
                handOfCards={[{ value: CardValue.EIGHT, suit: CardSuit.CLUBS }]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('SPLIT')).toBeDisabled()
    })

    test('enables Split button for pair of Aces', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.ACE, suit: CardSuit.CLUBS },
                    { value: CardValue.ACE, suit: CardSuit.DIAMONDS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('SPLIT')).not.toBeDisabled()
    })

    test('enables Split button for pair of face cards', () => {
        render(
            <PlayerActions
                handOfCards={[
                    { value: CardValue.KING, suit: CardSuit.CLUBS },
                    { value: CardValue.KING, suit: CardSuit.DIAMONDS },
                ]}
                onHit={mockHit}
                onDoubleDown={mockDoubleDown}
                onSplit={mockSplit}
                onStand={mockStand}
            />
        )

        expect(screen.getByText('SPLIT')).not.toBeDisabled()
    })
})
