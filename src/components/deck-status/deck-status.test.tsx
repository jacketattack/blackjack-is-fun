import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom'
import { DeckStatus } from './deck-status'
import { resetShoe } from '../../services/deck'

describe('DeckStatus Component', () => {
    beforeEach(() => {
        resetShoe()
    })

    it('should display deck status information', () => {
        render(<DeckStatus />)
        expect(screen.getByText(/Decks:/)).toBeInTheDocument()
        expect(screen.getByText(/Cards:/)).toBeInTheDocument()
        expect(screen.getByText(/Penetration:/)).toBeInTheDocument()
    })

    it('should display initial deck values after reset', () => {
        render(<DeckStatus />)
        // After reset, we should have full shoe
        expect(screen.getByText(/6\.0/)).toBeInTheDocument()
        expect(screen.getByText(/312/)).toBeInTheDocument()
        expect(screen.getByText(/0\.0%/)).toBeInTheDocument()
    })

    it('should display penetration level', () => {
        render(<DeckStatus />)
        expect(screen.getByText(/Low/)).toBeInTheDocument()
    })

    it('should have proper styling classes', () => {
        render(<DeckStatus />)
        const deckStatus = screen.getByText(/Decks:/)
        // Just verify the element exists and has some class
        expect(deckStatus).toBeInTheDocument()
        expect(deckStatus.className).toBeTruthy()
    })
})
