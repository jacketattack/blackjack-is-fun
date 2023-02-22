import { ReactElement, useEffect } from "react";
import useHandOfCardsTotal from "../../hooks/useHandOfCardsTotal";
import { Card } from "../../interfaces/card.interface";
import { CardTotal } from "../../services/handOfCardsCalculation";
import * as styles from './card-total-display.module.css';

interface CardTotalProps {
    cards: Card[];
    onBust?(): void;
    onTotalTwentyOne?(): void;
}

export const CardTotalDisplay: React.FC<CardTotalProps> = (props: CardTotalProps): ReactElement => {
    const cardTotal: CardTotal = useHandOfCardsTotal(props.cards);
    const isBlackjack: boolean = cardTotal.total === 21 && props.cards.length == 2;
    useEffect(() => {
        if (cardTotal.total === 21) {
            props.onTotalTwentyOne ? props.onTotalTwentyOne() : null;
        } else if (cardTotal.total > 21) {
            props.onBust ? props.onBust() : null;
        }
    }, [cardTotal]);
    return (
        <>
            {
                isBlackjack &&
                    <div className={styles.blackjack}>BLACKJACK</div>
            }
            {
                !isBlackjack && cardTotal.total < 22 &&
                    <div className={styles.standard}>
                        <span className={styles.total}>Total:</span> {cardTotal.isSoft && cardTotal.total !== 21 ? 'Soft ' : null} {cardTotal.total}
                    </div>
            }
            {
                !isBlackjack && cardTotal.total >= 22 &&
                    <div className={styles.bust}>BUST</div>
            }
        </>
    );
};