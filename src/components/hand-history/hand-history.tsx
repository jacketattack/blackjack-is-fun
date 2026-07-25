import { useState } from 'react';
import * as React from 'react';
import { getHandHistory, clearHandHistory } from '../../services/handHistory'
import { HandOutcome } from '../../services/handHistory'
import * as styles from './hand-history.module.css'

export const HandHistory = () => {
    const [history, setHistory] = useState(getHandHistory())
    const [isOpen, setIsOpen] = useState(false)

    function refreshHistory(): void {
        setHistory(getHandHistory())
    }

    function handleClear(): void {
        clearHandHistory()
        refreshHistory()
    }

    function toggleHistory(): void {
        setIsOpen(!isOpen)
        if (!isOpen) {
            refreshHistory()
        }
    }

    function getOutcomeStyle(outcome: HandOutcome): string {
        switch (outcome) {
            case HandOutcome.WIN:
                return styles.outcomeWin
            case HandOutcome.LOSS:
                return styles.outcomeLoss
            case HandOutcome.PUSH:
                return styles.outcomePush
            case HandOutcome.BLACKJACK:
                return styles.outcomeBlackjack
            default:
                return ''
        }
    }

    function formatCard(card: { value: string; suit: string }): string {
        return `${card.value} of ${card.suit}`
    }

    function formatDate(timestamp: string): string {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className={styles.handHistoryContainer}>
            <button className={styles.toggleButton} onClick={toggleHistory}>
                {isOpen ? 'Hide History' : 'Show History'}
            </button>

            {isOpen && (
                <div className={styles.historyPanel}>
                    <div className={styles.panelHeader}>
                        <h3>Hand History</h3>
                        <button
                            className={styles.clearButton}
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    {history.length === 0 ? (
                        <div className={styles.emptyMessage}>
                            No hands played yet
                        </div>
                    ) : (
                        <div className={styles.historyList}>
                            {history.map((entry) => (
                                <div
                                    key={entry.id}
                                    className={styles.historyEntry}
                                >
                                    <div className={styles.entryHeader}>
                                        <span className={styles.entryTime}>
                                            {formatDate(entry.timestamp)}
                                        </span>
                                        <span
                                            className={`${
                                                styles.entryOutcome
                                            } ${getOutcomeStyle(
                                                entry.outcome
                                            )}`}
                                        >
                                            {entry.outcome}
                                        </span>
                                    </div>

                                    <div className={styles.entryDetails}>
                                        <div className={styles.handDetails}>
                                            <strong>Dealer:</strong>{' '}
                                            {entry.dealerTotal} ({' '}
                                            {entry.dealerCards
                                                .map(formatCard)
                                                .join(', ')}
                                            )
                                        </div>
                                        <div className={styles.handDetails}>
                                            <strong>Player:</strong>{' '}
                                            {entry.playerTotal} ({' '}
                                            {entry.playerCards
                                                .map(formatCard)
                                                .join(', ')}
                                            )
                                        </div>
                                        {entry.betAmount !== undefined && (
                                            <div className={styles.betDetails}>
                                                Bet: ${entry.betAmount}
                                                {entry.bankrollChange !==
                                                    undefined && (
                                                    <span>
                                                        {' -> '}
                                                        {entry.bankrollChange >=
                                                        0
                                                            ? `+$${entry.bankrollChange}`
                                                            : `-$${Math.abs(
                                                                  entry.bankrollChange
                                                              )}`}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
