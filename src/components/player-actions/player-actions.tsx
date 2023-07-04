import classNames from "classnames";
import { Card } from "../../interfaces/card.interface";
import * as styles from './player-actions.module.css';

interface PlayerActionsProps {
    handOfCards: Card[];
    onHit(): void;
    onDoubleDown(): void;
    onSplit(): void;
    onStand(): void;
}

export const PlayerActions = (props: PlayerActionsProps) => {
    return (
        <div className={styles.actionButtons}>
            <button onClick={props.onHit} className={classNames(styles.actionButton, styles.hit)}>HIT</button>
            <button
                onClick={props.onDoubleDown}
                disabled={!canDoubleDown(props.handOfCards)}
                className={classNames(styles.actionButton, styles.doubleDown)}>
                DOUBLE DOWN
            </button>
            <button
                onClick={props.onSplit}
                disabled={!canSplit(props.handOfCards)}
                className={classNames(styles.actionButton, styles.split)}>
                SPLIT
            </button>
            <button onClick={props.onStand} className={classNames(styles.actionButton, styles.stand)}>STAND</button>
        </div>
    );
}

function canDoubleDown(handOfCards: Card[]): boolean {
    return handOfCards.length === 2;
}

function canSplit(handOfCards: Card[]): boolean {
    return handOfCards.length === 2 && handOfCards[0].value === handOfCards[1].value;
}