import { Card } from "../../interfaces/card.interface";

interface PlayerActionsProps {
    handOfCards: Card[];
    onHit(): void;
    onDoubleDown(): void;
    onSplit(): void;
    onStand(): void;
}

export const PlayerActions: React.FC<PlayerActionsProps> = (props: PlayerActionsProps) => {
    return (
        <div>
            <button onClick={props.onHit}>HIT</button>
            <button onClick={props.onDoubleDown} disabled={!canDoubleDown(props.handOfCards)}>DOUBLE DOWN</button>
            <button onClick={props.onSplit} disabled={!canSplit(props.handOfCards)}>SPLIT</button>
            <button onClick={props.onStand}>STAND</button>
        </div>
    );
}

function canDoubleDown(handOfCards: Card[]): boolean {
    return handOfCards.length === 2;
}

function canSplit(handOfCards: Card[]): boolean {
    return handOfCards.length === 2 && handOfCards[0].value === handOfCards[1].value;
}