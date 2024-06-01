import styles from './end-game-actions.module.css'

interface EndGameActionsProps {
    onNewHand?(): void
}

export const EndGameActions = (props: EndGameActionsProps) => {
    return (
        <div className={styles.nextHand}>
            <button className={styles.nextHandButton} onClick={props.onNewHand}>
                Next Hand
            </button>
        </div>
    )
}
