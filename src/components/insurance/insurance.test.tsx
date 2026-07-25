import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom'
import { Insurance } from './insurance'

describe('Insurance Component', () => {
    const mockOnAccept = jest.fn()
    const mockOnDecline = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should display insurance offered message', () => {
        render(
            <Insurance
                originalBet={100}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        expect(screen.getByText('Insurance Offered')).toBeInTheDocument()
    })

    it('should display correct insurance bet amount', () => {
        render(
            <Insurance
                originalBet={100}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        expect(screen.getByText(/Accept \(\$50\)/)).toBeInTheDocument()
    })

    it('should display correct payout amount', () => {
        render(
            <Insurance
                originalBet={100}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        expect(screen.getByText(/you win \$100/)).toBeInTheDocument()
    })

    it('should display accept and decline buttons', () => {
        render(
            <Insurance
                originalBet={100}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        expect(screen.getByText(/Accept/)).toBeInTheDocument()
        expect(screen.getByText('Decline')).toBeInTheDocument()
    })

    it('should call onAccept when accept button is clicked', () => {
        render(
            <Insurance
                originalBet={100}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        fireEvent.click(screen.getByText(/Accept/))
        expect(mockOnAccept).toHaveBeenCalledTimes(1)
    })

    it('should call onDecline when decline button is clicked', () => {
        render(
            <Insurance
                originalBet={100}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        fireEvent.click(screen.getByText('Decline'))
        expect(mockOnDecline).toHaveBeenCalledTimes(1)
    })

    it('should display correct amounts for different bet values', () => {
        render(
            <Insurance
                originalBet={50}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        expect(screen.getByText(/Accept \(\$25\)/)).toBeInTheDocument()
        expect(screen.getByText(/you win \$50/)).toBeInTheDocument()
    })

    it('should handle odd bet amounts correctly', () => {
        render(
            <Insurance
                originalBet={101}
                onAccept={mockOnAccept}
                onDecline={mockOnDecline}
            />
        )
        expect(screen.getByText(/Accept \(\$50\)/)).toBeInTheDocument()
        expect(screen.getByText(/you win \$100/)).toBeInTheDocument()
    })
})
