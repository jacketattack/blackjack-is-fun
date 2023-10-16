import { useEffect } from 'react'

import useHandOfCardsTotal from '../../hooks/useHandOfCardsTotal'
import { BlackjackHand } from '../../interfaces/card.interface'
import { CardTotal } from '../../services/handOfCardsCalculation'
import * as styles from './card-total-display.module.css'

interface CardTotalProps {
    blackjackHand: BlackjackHand
    onBust?(): void
    onTotalTwentyOne?(): void
}

export const CardTotalDisplay = (props: CardTotalProps) => {
    const cardTotal: CardTotal = useHandOfCardsTotal(props.blackjackHand.cards)
    const isBlackjack: boolean =
        cardTotal.total === 21 && props.blackjackHand.cards.length == 2

    useEffect(() => {
        if (cardTotal.total === 21) {
            props.onTotalTwentyOne ? props.onTotalTwentyOne() : null
        } else if (cardTotal.total > 21) {
            props.onBust ? props.onBust() : null
        }
    }, [cardTotal])

    return (
        <>
            {isBlackjack && (
                <div className={`${styles.blackjack} ${styles.leftSpacing}`}>
                    BLACKJACK
                </div>
            )}
            {!isBlackjack && cardTotal.total < 22 && (
                <div className={`${styles.standard} ${styles.leftSpacing}`}>
                    <span className={styles.total}>Total:</span>{' '}
                    {cardTotal.isSoft && cardTotal.total !== 21
                        ? 'Soft '
                        : null}{' '}
                    {cardTotal.total}
                </div>
            )}
            {!isBlackjack && cardTotal.total >= 22 && (
                <div className={`${styles.bust} ${styles.leftSpacing}`}>
                    BUST
                </div>
            )}
        </>
    )
}
