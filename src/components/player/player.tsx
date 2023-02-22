import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card } from "../../interfaces/card.interface";
import { dealHand, drawCard } from "../../services/deck";
import { HandOfCards } from "../hand-of-cards/hand-of-cards";
import { PlayerActions } from "../player-actions/player-actions";
import * as styles from './player.module.css';

interface PlayerProps {
    name: string;
    dealerDrewBlackjack: boolean;
    onHasFinishedActions(playerFinalHandOfCards: Card[]): void;
}

interface PlayerState {
    handOfCards: Card[];
    canPerformMoreActions: boolean;
}

export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
    let [playerState, setPlayerState]: [PlayerState, Dispatch<SetStateAction<PlayerState>>] = useState(
        {
            handOfCards: dealHand(),
            canPerformMoreActions: true
        });

    useEffect(() => {
        if (props.dealerDrewBlackjack) {
            stand();
        }
    }, [props.dealerDrewBlackjack]);

    function hit(): void {
        setPlayerState({
            ...playerState,
            handOfCards: [...playerState.handOfCards, drawCard()]
        });
    }

    function doubleDown(): void {
        setPlayerState({
            handOfCards: [...playerState.handOfCards, drawCard()],
            canPerformMoreActions: false
        });
        props.onHasFinishedActions(playerState.handOfCards);
    }

    function split(): void {
    }

    function stand(): void {
        setPlayerState({
            ...playerState,
            canPerformMoreActions: false
        });
        props.onHasFinishedActions(playerState.handOfCards);
    }

    function bust(): void {
        stand();
    }

    return (
        <div className={styles.player}>
            <div className={styles.name}>{props.name}</div>
            <HandOfCards cards={playerState.handOfCards} onBust={bust} onTotalTwentyOne={stand}/>
            { playerState.canPerformMoreActions && <PlayerActions handOfCards={playerState.handOfCards} onHit={hit} onDoubleDown={doubleDown} onSplit={split} onStand={stand}/> }
        </div>
    );
} 
