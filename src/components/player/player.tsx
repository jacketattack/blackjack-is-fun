import { Card } from "../../interfaces/card.interface";
import { HandOfCards } from "../hand-of-cards/hand-of-cards";

interface PlayerProps {
    name: string;
    cards: Card[];
}

export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
    return (
        <>
            <h3>{props.name}</h3>
            <HandOfCards cards={props.cards} />
        </>
    );
} 