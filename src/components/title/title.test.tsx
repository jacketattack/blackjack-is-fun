import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { Title } from './title';

describe('Title Component', () => {
    it('renders the title text', () => {
        render(<Title />);
        expect(screen.getByText("Let's Play Blackjack!")).toBeInTheDocument();
    });

    it('renders an h1 element', () => {
        render(<Title />);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
});
