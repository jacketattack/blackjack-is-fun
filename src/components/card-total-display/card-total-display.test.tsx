import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { CardTotalDisplay } from './card-total-display';
import { BlackjackHand } from '../../interfaces/card.interface';
import { Card, CardSuit, CardValue } from '../../interfaces/card.interface';

// Mock the hook module
const mockUseHandOfCardsTotal = jest.fn();

jest.mock('../../hooks/useHandOfCardsTotal', () => ({
    __esModule: true,
    default: jest.fn(),
}));

// Re-import to get the mocked version
const useHandOfCardsTotalMock = require('../../hooks/useHandOfCardsTotal') as {
    default: jest.Mock;
};

describe('CardTotalDisplay Component', () => {
    const mockHand: BlackjackHand = {
        cards: [
            { value: CardValue.TEN, suit: CardSuit.HEARTS },
            { value: CardValue.SEVEN, suit: CardSuit.DIAMONDS },
        ],
        finished: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useHandOfCardsTotalMock.default.mockReturnValue({
            total: 17,
            isSoft: false,
            blackjack: false,
        });
    });

    it('displays BLACKJACK when hand is blackjack', () => {
        useHandOfCardsTotalMock.default.mockReturnValue({
            total: 21,
            isSoft: false,
            blackjack: true,
        });
        const blackjackHand: BlackjackHand = {
            cards: [
                { value: CardValue.ACE, suit: CardSuit.SPADES },
                { value: CardValue.KING, suit: CardSuit.HEARTS },
            ],
            finished: false,
        };

        render(<CardTotalDisplay blackjackHand={blackjackHand} />);
        expect(screen.getByText('BLACKJACK')).toBeInTheDocument();
    });

    it('displays BUST when total is over 21', () => {
        useHandOfCardsTotalMock.default.mockReturnValue({
            total: 22,
            isSoft: false,
            blackjack: false,
        });

        render(<CardTotalDisplay blackjackHand={mockHand} />);
        expect(screen.getByText('BUST')).toBeInTheDocument();
    });

    it('displays total when under 21', () => {
        useHandOfCardsTotalMock.default.mockReturnValue({
            total: 17,
            isSoft: false,
            blackjack: false,
        });

        render(<CardTotalDisplay blackjackHand={mockHand} />);
        expect(screen.getByText('Total: 17')).toBeInTheDocument();
    });

    it('displays Soft when hand is soft', () => {
        useHandOfCardsTotalMock.default.mockReturnValue({
            total: 17,
            isSoft: true,
            blackjack: false,
        });

        render(<CardTotalDisplay blackjackHand={mockHand} />);
        expect(screen.getByText(/Soft/)).toBeInTheDocument();
    });

    it('calls onBust callback when total is over 21', () => {
        const onBust = jest.fn();
        useHandOfCardsTotalMock.default.mockReturnValue({
            total: 22,
            isSoft: false,
            blackjack: false,
        });

        render(<CardTotalDisplay blackjackHand={mockHand} onBust={onBust} />);
        expect(onBust).toHaveBeenCalled();
    });

    it('calls onTotalTwentyOne callback when total is 21', () => {
        const onTotalTwentyOne = jest.fn();
        useHandOfCardsTotalMock.default.mockReturnValue({
            total: 21,
            isSoft: false,
            blackjack: false,
        });

        render(<CardTotalDisplay blackjackHand={mockHand} onTotalTwentyOne={onTotalTwentyOne} />);
        expect(onTotalTwentyOne).toHaveBeenCalled();
    });
});
