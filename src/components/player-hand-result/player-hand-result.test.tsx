import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlayerHandResult } from './player-hand-result'

describe('PlayerHandResult', () => {
    it('should display PUSH when dealer and player totals are equal', () => {
        render(<PlayerHandResult dealerFinalTotal={20} playerFinalTotal={20} />)
        expect(screen.getByText('PUSH')).toBeInTheDocument()
    })

    it('should display WINNER when player total is greater than dealer total', () => {
        render(<PlayerHandResult dealerFinalTotal={19} playerFinalTotal={20} />)
        expect(screen.getByText('WINNER')).toBeInTheDocument()
    })

    it('should display LOSER when player total is less than dealer total', () => {
        render(<PlayerHandResult dealerFinalTotal={20} playerFinalTotal={19} />)
        expect(screen.getByText('LOSER')).toBeInTheDocument()
    })

    it('should display LOSER when player busts', () => {
        render(<PlayerHandResult dealerFinalTotal={20} playerFinalTotal={22} />)
        expect(screen.getByText('LOSER')).toBeInTheDocument()
    })

    it('should display WINNER when dealer busts', () => {
        render(<PlayerHandResult dealerFinalTotal={22} playerFinalTotal={20} />)
        expect(screen.getByText('WINNER')).toBeInTheDocument()
    })

    it('should display PUSH when both have blackjack', () => {
        render(<PlayerHandResult dealerFinalTotal={21} playerFinalTotal={21} />)
        expect(screen.getByText('PUSH')).toBeInTheDocument()
    })
})
