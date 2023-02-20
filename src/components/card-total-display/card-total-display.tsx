import { ReactElement } from "react";
import useHandOfCardsTotal from "../../hooks/useHandOfCardsTotal";
import { Card } from "../../interfaces/card.interface";
import { CardTotal } from "../../services/handOfCardsCalculation";
import * as styles from './card-total-display.module.css';

interface CardTotalProps {
    cards: Card[];
}

export const CardTotalDisplay: React.FC<CardTotalProps> = (props: CardTotalProps): ReactElement => {
    const cardTotal: CardTotal = useHandOfCardsTotal(props.cards);
    const isBlackjack: boolean = cardTotal.total === 21 && props.cards.length == 2;
    return (
        <>
            {isBlackjack &&
                <div className={styles.blackjack}>BLACKJACK</div>
            }
            {!isBlackjack &&
                <div className={styles.standard}>
                    <span className={styles.total}>Total:</span> {cardTotal.isSoft && cardTotal.total !== 21 ? 'Soft ' : null} {cardTotal.total}
                </div>
            }
        </>
    );
};