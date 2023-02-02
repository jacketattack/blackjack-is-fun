import React, { ReactElement } from 'react';
import { Card, CardSuit, CardValue } from '../../interfaces/card.interface';
import { CardImage } from '../card-image/card-image';
import { CardTotalDisplay } from '../card-total-display/card-total-display';

interface HandOfCardsProps {
    cards: Card[];
}


export const HandOfCards: React.FC<HandOfCardsProps> = (props: HandOfCardsProps): ReactElement => {
    // dumb component that displays card images and total
    // return <CardImage value={props.cards[0].value} suit={props.cards[0].suit}/>;

    return (
        <>
            <div>
                {props.cards.map((card: Card, index: number) => (
                    <span key={index}><CardImage card={card}/></span>
                ))}
            </div>
            <CardTotalDisplay cards={props.cards} />
        </>
    );
}
