import { useState, useEffect } from 'react';
import * as React from 'react';
import {
    getShoeStatus,
    getPenetrationLimit,
    getNumberOfDecks,
} from '../../services/deck'
import * as styles from './deck-status.module.css'

export const DeckStatus = () => {
    const [shoeStatus, setShoeStatus] = useState(getShoeStatus())
    const [showNotification, setShowNotification] = useState(false)
    const numberOfDecks = getNumberOfDecks()

    useEffect(() => {
        const checkStatus = () => {
            const status = getShoeStatus()
            setShoeStatus(status)

            // Show notification if deck was just reshuffled
            if (status.wasJustReshuffled) {
                setShowNotification(true)
                const timer = setTimeout(() => {
                    setShowNotification(false)
                }, 3000)
                return () => clearTimeout(timer)
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 1000)

        return () => clearInterval(interval)
    }, [])

    const penetrationPercentage = shoeStatus.penetrationPercentage
    const decksRemaining = shoeStatus.decksRemaining
    const remainingCards = shoeStatus.remainingCards
    const totalCards = shoeStatus.totalCards

    // Calculate penetration level
    const getPenetrationLevel = (): string => {
        if (penetrationPercentage < 25) return 'Low'
        if (penetrationPercentage < 50) return 'Medium'
        if (penetrationPercentage < 75) return 'High'
        return 'Reshuffle Soon'
    }

    const penetrationLevel = getPenetrationLevel()

    return (
        <div className={styles.deckStatusContainer}>
            <div className={styles.deckStatusContent}>
                <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Decks:</span>
                    <span className={styles.statusValue}>
                        {decksRemaining.toFixed(1)} / {numberOfDecks}
                    </span>
                </div>
                <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Cards:</span>
                    <span className={styles.statusValue}>
                        {remainingCards} / {totalCards}
                    </span>
                </div>
                <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Penetration:</span>
                    <span
                        className={`${styles.statusValue} ${
                            styles[
                                `penetration${penetrationLevel.replace(
                                    /\s+/g,
                                    ''
                                )}`
                            ]
                        }`}
                    >
                        {penetrationPercentage.toFixed(1)}% ({penetrationLevel})
                    </span>
                </div>
            </div>

            {showNotification && (
                <div className={styles.reshuffleNotification}>
                    🔄 Deck Reshuffled!
                </div>
            )}
        </div>
    )
}
