import classNames from 'classnames'
import { Card } from '../../interfaces/card.interface'
import * as styles from './player-actions.module.css'

interface PlayerActionsProps {
    handOfCards: Card[]
    onHit(): void
    onDoubleDown(): void
    onSplit(): void
    onStand(): void
    canDoubleDown?: boolean
    canSplit?: boolean
}

export const PlayerActions = (props: PlayerActionsProps) => {
    const canDoubleDownCards = canDoubleDownHand(props.handOfCards)
    const canSplitCards = canSplitHand(props.handOfCards)
    const canDoubleDownBankroll = props.canDoubleDown !== false
    const canSplitBankroll = props.canSplit !== false

    return (
        <div className={styles.actionButtons}>
            <button
                onClick={props.onHit}
                className={classNames(styles.actionButton, styles.hit)}
            >
                HIT
            </button>
            <button
                onClick={props.onDoubleDown}
                disabled={!canDoubleDownCards || !canDoubleDownBankroll}
                title={
                    !canDoubleDownBankroll
                        ? 'Insufficient bankroll to double down'
                        : ''
                }
                className={classNames(styles.actionButton, styles.doubleDown)}
            >
                DOUBLE DOWN
            </button>
            <button
                onClick={props.onSplit}
                disabled={!canSplitCards || !canSplitBankroll}
                title={
                    !canSplitBankroll ? 'Insufficient bankroll to split' : ''
                }
                className={classNames(styles.actionButton, styles.split)}
            >
                SPLIT
            </button>
            <button
                onClick={props.onStand}
                className={classNames(styles.actionButton, styles.stand)}
            >
                STAND
            </button>
        </div>
    )
}

function canDoubleDownHand(handOfCards: Card[]): boolean {
    return handOfCards.length === 2
}

function canSplitHand(handOfCards: Card[]): boolean {
    return (
        handOfCards.length === 2 &&
        handOfCards[0].value === handOfCards[1].value
    )
}
