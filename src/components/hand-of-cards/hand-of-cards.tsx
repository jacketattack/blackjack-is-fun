import React, { ReactElement } from 'react';
import { Card } from '../../interfaces/card.interface';
import { CardImage } from '../card-image/card-image';
import { CardTotalDisplay } from '../card-total-display/card-total-display';

interface HandOfCardsProps {
    cards: Card[];
    onBust?(): void;
    onTotalTwentyOne?(): void;
    dealerOpeningHand?: boolean;
}


export const HandOfCards: React.FC<HandOfCardsProps> = (props: HandOfCardsProps): ReactElement => {
    return (
        <>
            <div>
                {props.cards.map((card: Card, index: number) => (
                    <span key={index}><CardImage card={props.dealerOpeningHand && index === 1 ? null : card}/></span>
                ))}
            </div>
            <CardTotalDisplay cards={props.dealerOpeningHand ? [props.cards[0]] : props.cards} onBust={props.onBust} onTotalTwentyOne={props.onTotalTwentyOne}/>
        </>
    );
}
