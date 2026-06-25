import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Bankroll } from './bankroll'

describe('Bankroll Component', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('should display default bankroll amount', () => {
        render(<Bankroll />)
        expect(screen.getByText(/Bankroll: \$1,000/)).toBeInTheDocument()
    })

    it('should display stored bankroll value', () => {
        localStorage.setItem('blackjackBankroll', '1500')
        render(<Bankroll />)
        expect(screen.getByText(/Bankroll: \$1,500/)).toBeInTheDocument()
    })

    it('should have a reset button', () => {
        render(<Bankroll />)
        expect(screen.getByText('Reset Bankroll')).toBeInTheDocument()
    })

    it('should reset bankroll when reset button is clicked', () => {
        localStorage.setItem('blackjackBankroll', '2000')
        render(<Bankroll />)

        const resetButton = screen.getByText('Reset Bankroll')
        fireEvent.click(resetButton)

        expect(screen.getByText(/Bankroll: \$1,000/)).toBeInTheDocument()
        expect(localStorage.getItem('blackjackBankroll')).toBe('1000')
    })
})
