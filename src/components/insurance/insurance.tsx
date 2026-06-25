import { useState } from 'react'
import {
    calculateInsuranceBet,
    calculateInsurancePayout,
} from '../../services/insurance'
import * as styles from './insurance.module.css'

interface InsuranceProps {
    originalBet: number
    onAccept: () => void
    onDecline: () => void
}

export const Insurance = (props: InsuranceProps) => {
    const insuranceBet = calculateInsuranceBet(props.originalBet)
    const potentialPayout = calculateInsurancePayout(insuranceBet)

    return (
        <div className={styles.insuranceOverlay}>
            <div className={styles.insuranceModal}>
                <h2 className={styles.insuranceTitle}>Insurance Offered</h2>
                <p className={styles.insuranceMessage}>
                    Dealer has an Ace. Would you like to take insurance for $
                    {insuranceBet}?
                    <br />
                    If dealer has blackjack, you win ${potentialPayout} (2:1
                    payout).
                </p>
                <div className={styles.insuranceButtons}>
                    <button
                        className={styles.insuranceButton}
                        onClick={props.onAccept}
                    >
                        Accept (${insuranceBet})
                    </button>
                    <button
                        className={styles.insuranceButton}
                        onClick={props.onDecline}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}
