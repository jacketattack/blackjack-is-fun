import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { CardImage } from './card-image';
import { Card, CardSuit, CardValue } from '../../interfaces/card.interface';

describe('CardImage Component', () => {
    const mockCard: Card = {
        value: CardValue.ACE,
        suit: CardSuit.SPADES,
    };

    it('renders an img element', () => {
        render(<CardImage card={mockCard} />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders with correct dimensions', () => {
        render(<CardImage card={mockCard} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('height', '200');
        expect(img).toHaveAttribute('width', '100');
    });

    it('renders with a src attribute', () => {
        render(<CardImage card={mockCard} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src');
    });

    it('handles null card gracefully', () => {
        render(<CardImage card={null as unknown as Card} />);
        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();
    });
});
