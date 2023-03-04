import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Card } from '../../interfaces/card.interface';
import { playDealerHand } from '../../services/dealerStrategy';
import { dealHand } from '../../services/deck';
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation';
import { HandOfCards } from '../hand-of-cards/hand-of-cards';
import * as styles from './dealer.module.css';

interface DealerProps {
    playerFinalTotal: number;
    onHasFinishedPlaying(dealerFinalHandOfCards: Card[]): void;
    onDrewBlackjack(): void;
}

export const Dealer: React.FC<DealerProps> = (props: DealerProps) => {
    let [handOfCards, setHandOfCards]: [Card[], Dispatch<SetStateAction<Card[]>>] = useState(dealHand());
    useEffect(() => {
        if (hasPlayerFinishedPlaying() && !hasPlayerBusted()) {
            const dealerFinalHand: Card[] = playDealerHand(handOfCards);
            setHandOfCards(dealerFinalHand);
            props.onHasFinishedPlaying(handOfCards);
        }
    }, [props.playerFinalTotal]);

    function onTotalTwentyOne(): void {
        if (handOfCards.length === 2) {
            // dealer drew blackjack, game over
            props.onDrewBlackjack();
        }
    }

    function isDealerOpeningHand(): boolean {
        return handOfCards.length === 2 && !props.playerFinalTotal;
    }

    function hasPlayerFinishedPlaying(): boolean {
      return !!props.playerFinalTotal;
    }

    function hasPlayerBusted(): boolean {
      return props.playerFinalTotal > 21;
    }

    function dealerTotalIsTwentyOne(): boolean {
      return calculateHandOfCardsTotal(handOfCards).total === 21;
    }

    function getCardsToDisplay(): Card[] {
      return isDealerOpeningHand() && !dealerTotalIsTwentyOne() ? [handOfCards[0]] : handOfCards;
    }

    return (
        <div className={styles.dealer}>
            <div className={styles.name}>DEALER</div>
            <HandOfCards cards={getCardsToDisplay()} onTotalTwentyOne={onTotalTwentyOne}/>
        </div>
    );
} 
