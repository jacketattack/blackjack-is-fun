import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Card, CardSuit, CardValue } from '../../interfaces/card.interface';
import { playDealerHand } from '../../services/dealerStrategy';
import { dealHand } from '../../services/deck';
import { HandOfCards } from '../hand-of-cards/hand-of-cards';
import * as styles from './dealer.module.css';

interface DealerProps {
    playerFinalTotal: number;
    onHasFinishedPlaying(dealerFinalHandOfCards: Card[]): void;
    onDrewBlackjack(): void;
}


export const Dealer: React.FC<DealerProps> = (props: DealerProps) => {
    let blackjack: Card[] = [
        {
            value: CardValue.ACE,
            suit: CardSuit.CLUBS
        },
        {
            value: CardValue.JACK,
            suit: CardSuit.CLUBS
        }
    ]
    let [handOfCards, setHandOfCards]: [Card[], Dispatch<SetStateAction<Card[]>>] = useState(dealHand());
    useEffect(() => {
        if (props.playerFinalTotal) {
            if (props.playerFinalTotal && props.playerFinalTotal < 22) {
                setHandOfCards(playDealerHand(handOfCards));
            }
        }
    }, [props.playerFinalTotal]);

    useEffect(() => {
        if (props.playerFinalTotal) {
            props.onHasFinishedPlaying(handOfCards);
        }
    }, [handOfCards]);

    function onTotalTwentyOne(): void {
        if (handOfCards.length === 2) {
            // dealer drew blackjack, game over
            props.onDrewBlackjack();
        }
    }

    function isDealerOpeningHand(): boolean {
        return handOfCards.length === 2 && !props.playerFinalTotal;
    }

    return (
        <div className={styles.dealer}>
            <div className={styles.name}>DEALER</div>
            <HandOfCards cards={handOfCards} onTotalTwentyOne={onTotalTwentyOne} dealerOpeningHand={isDealerOpeningHand()}/>
        </div>
    );
} 
