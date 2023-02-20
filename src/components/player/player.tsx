import { Card } from "../../interfaces/card.interface";
import { HandOfCards } from "../hand-of-cards/hand-of-cards";
import * as styles from './player.module.css';

interface PlayerProps {
    name: string;
    cards: Card[];
}

export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
    return (
        <div className={styles.player}>
            <div className={styles.name}>{props.name}</div>
            <HandOfCards cards={props.cards} />
        </div>
    );
} 