import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HandHistory } from './hand-history'
import { HandOutcome } from '../../services/handHistory'

describe('HandHistory Component', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('should display toggle button', () => {
        render(<HandHistory />)
        expect(screen.getByText('Show History')).toBeInTheDocument()
    })

    it('should show history panel when toggle button is clicked', () => {
        render(<HandHistory />)
        const toggleButton = screen.getByText('Show History')
        fireEvent.click(toggleButton)
        expect(screen.getByText('Hide History')).toBeInTheDocument()
        expect(screen.getByText('Hand History')).toBeInTheDocument()
    })

    it('should hide history panel when toggle button is clicked again', () => {
        render(<HandHistory />)
        const toggleButton = screen.getByText('Show History')
        fireEvent.click(toggleButton)
        fireEvent.click(screen.getByText('Hide History'))
        expect(screen.getByText('Show History')).toBeInTheDocument()
        expect(screen.queryByText('Hand History')).not.toBeInTheDocument()
    })

    it('should display empty message when no history exists', () => {
        render(<HandHistory />)
        const toggleButton = screen.getByText('Show History')
        fireEvent.click(toggleButton)
        expect(screen.getByText('No hands played yet')).toBeInTheDocument()
    })

    it('should display history entries when they exist', () => {
        const mockHistory = [
            {
                id: '1',
                timestamp: new Date().toISOString(),
                dealerCards: [
                    { value: '10', suit: 'hearts' },
                    { value: '7', suit: 'diamonds' },
                ],
                dealerTotal: 17,
                playerCards: [
                    { value: 'king', suit: 'clubs' },
                    { value: '9', suit: 'spades' },
                ],
                playerTotal: 19,
                outcome: HandOutcome.WIN,
                betAmount: 10,
                bankrollChange: 10,
            },
        ]
        localStorage.setItem(
            'blackjackHandHistory',
            JSON.stringify(mockHistory)
        )

        render(<HandHistory />)
        const toggleButton = screen.getByText('Show History')
        fireEvent.click(toggleButton)

        expect(screen.getByText('Win')).toBeInTheDocument()
        expect(screen.getByText(/Dealer:/)).toBeInTheDocument()
        expect(screen.getByText(/17/)).toBeInTheDocument()
        expect(screen.getByText(/Player:/)).toBeInTheDocument()
        expect(screen.getByText(/19/)).toBeInTheDocument()
    })

    it('should clear history when clear button is clicked', () => {
        const mockHistory = [
            {
                id: '1',
                timestamp: new Date().toISOString(),
                dealerCards: [],
                dealerTotal: 17,
                playerCards: [],
                playerTotal: 19,
                outcome: HandOutcome.WIN,
            },
        ]
        localStorage.setItem(
            'blackjackHandHistory',
            JSON.stringify(mockHistory)
        )

        render(<HandHistory />)
        const toggleButton = screen.getByText('Show History')
        fireEvent.click(toggleButton)

        const clearButton = screen.getByText('Clear')
        fireEvent.click(clearButton)

        expect(localStorage.getItem('blackjackHandHistory')).toBeNull()
        expect(screen.getByText('No hands played yet')).toBeInTheDocument()
    })

    it('should display multiple history entries', () => {
        const mockHistory = [
            {
                id: '1',
                timestamp: new Date().toISOString(),
                dealerCards: [],
                dealerTotal: 17,
                playerCards: [],
                playerTotal: 19,
                outcome: HandOutcome.WIN,
            },
            {
                id: '2',
                timestamp: new Date().toISOString(),
                dealerCards: [],
                dealerTotal: 21,
                playerCards: [],
                playerTotal: 20,
                outcome: HandOutcome.LOSS,
            },
        ]
        localStorage.setItem(
            'blackjackHandHistory',
            JSON.stringify(mockHistory)
        )

        render(<HandHistory />)
        const toggleButton = screen.getByText('Show History')
        fireEvent.click(toggleButton)

        expect(screen.getByText('Win')).toBeInTheDocument()
        expect(screen.getByText('Loss')).toBeInTheDocument()
    })
})
