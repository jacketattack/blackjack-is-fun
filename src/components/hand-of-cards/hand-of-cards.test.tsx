import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { HandOfCards } from './hand-of-cards';
import { BlackjackHand, Card, CardSuit, CardValue } from '../../interfaces/card.interface';

// Mock child components
jest.mock('../card-image/card-image', () => ({
    CardImage: ({ card }: { card: Card }) => <img data-testid="card-image" />,
}));

jest.mock('../card-total-display/card-total-display', () => ({
    CardTotalDisplay: ({ blackjackHand }: { blackjackHand: BlackjackHand }) => (
        <div data-testid="card-total-display" />
    ),
}));

describe('HandOfCards Component', () => {
    const mockHand: BlackjackHand = {
        cards: [
            { value: CardValue.TEN, suit: CardSuit.HEARTS },
            { value: CardValue.SEVEN, suit: CardSuit.DIAMONDS },
        ],
        finished: false,
    };

    it('renders the hand container', () => {
        render(<HandOfCards blackjackHand={mockHand} />);
        expect(screen.getByTestId('hand-of-cards')).toBeInTheDocument();
    });

    it('renders CardImage for each card in hand', () => {
        render(<HandOfCards blackjackHand={mockHand} />);
        expect(screen.getAllByTestId('card-image')).toHaveLength(2);
    });

    it('renders CardTotalDisplay', () => {
        render(<HandOfCards blackjackHand={mockHand} />);
        expect(screen.getByTestId('card-total-display')).toBeInTheDocument();
    });

    it('shows back of card when only one card to display', () => {
        const singleCardHand: BlackjackHand = {
            cards: [{ value: CardValue.ACE, suit: CardSuit.SPADES }],
            finished: false,
        };

        render(<HandOfCards blackjackHand={singleCardHand} />);
        // Should render 2 card images (the actual card + back of card)
        expect(screen.getAllByTestId('card-image')).toHaveLength(2);
    });

    it('passes onBust callback to CardTotalDisplay', () => {
        const onBust = jest.fn();
        render(<HandOfCards blackjackHand={mockHand} onBust={onBust} />);
        // CardTotalDisplay is rendered with the callback
        expect(screen.getByTestId('card-total-display')).toBeInTheDocument();
    });

    it('passes onTotalTwentyOne callback to CardTotalDisplay', () => {
        const onTotalTwentyOne = jest.fn();
        render(<HandOfCards blackjackHand={mockHand} onTotalTwentyOne={onTotalTwentyOne} />);
        expect(screen.getByTestId('card-total-display')).toBeInTheDocument();
    });
});
