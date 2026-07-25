import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { PlayerHandResult } from './player-hand-result';

describe('PlayerHandResult Component', () => {
    it('displays WINNER when player wins', () => {
        render(<PlayerHandResult dealerFinalTotal={17} playerFinalTotal={19} />);
        expect(screen.getByText('WINNER')).toBeInTheDocument();
        expect(screen.queryByText('LOSER')).not.toBeInTheDocument();
        expect(screen.queryByText('PUSH')).not.toBeInTheDocument();
    });

    it('displays LOSER when player loses', () => {
        render(<PlayerHandResult dealerFinalTotal={20} playerFinalTotal={17} />);
        expect(screen.getByText('LOSER')).toBeInTheDocument();
        expect(screen.queryByText('WINNER')).not.toBeInTheDocument();
        expect(screen.queryByText('PUSH')).not.toBeInTheDocument();
    });

    it('displays PUSH when player and dealer have same total', () => {
        render(<PlayerHandResult dealerFinalTotal={17} playerFinalTotal={17} />);
        expect(screen.getByText('PUSH')).toBeInTheDocument();
        expect(screen.queryByText('WINNER')).not.toBeInTheDocument();
        expect(screen.queryByText('LOSER')).not.toBeInTheDocument();
    });

    it('displays LOSER when player busts', () => {
        render(<PlayerHandResult dealerFinalTotal={17} playerFinalTotal={22} />);
        expect(screen.getByText('LOSER')).toBeInTheDocument();
        expect(screen.queryByText('WINNER')).not.toBeInTheDocument();
    });

    it('displays LOSER when dealer has higher valid total', () => {
        render(<PlayerHandResult dealerFinalTotal={20} playerFinalTotal={18} />);
        expect(screen.getByText('LOSER')).toBeInTheDocument();
    });

    it('displays WINNER when player has blackjack and dealer does not', () => {
        render(<PlayerHandResult dealerFinalTotal={17} playerFinalTotal={21} />);
        expect(screen.getByText('WINNER')).toBeInTheDocument();
    });

    it('displays PUSH when both have same valid total under 21', () => {
        render(<PlayerHandResult dealerFinalTotal={20} playerFinalTotal={20} />);
        expect(screen.getByText('PUSH')).toBeInTheDocument();
    });
});
