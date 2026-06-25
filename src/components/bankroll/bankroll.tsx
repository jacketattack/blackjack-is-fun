import { useState } from 'react'
import { getBankroll, resetBankroll } from '../../services/bankroll'
import * as styles from './bankroll.module.css'

export const Bankroll = () => {
    const [bankroll, setBankroll] = useState<number>(getBankroll())

    function handleReset(): void {
        resetBankroll()
        setBankroll(1000)
    }

    return (
        <div className={styles.bankrollContainer}>
            <div className={styles.bankrollAmount}>
                Bankroll: ${bankroll.toLocaleString()}
            </div>
            <button className={styles.resetButton} onClick={handleReset}>
                Reset Bankroll
            </button>
        </div>
    )
}
