import { ReactElement } from "react";
import { Card } from "../../interfaces/card.interface";

interface CardImageProps {
    card: Card;
}

export const CardImage: React.FC<CardImageProps> = (props: CardImageProps): ReactElement => {
    return <img src={getUrlOfCard(props.card)} height="200" width="100"/>;
}

const cardToUrl: { [key: string]: URL } = {
    '2_of_diamonds': new URL('../../../public/images/2_of_diamonds.png', import.meta.url),
    '2_of_hearts': new URL('../../../public/images/2_of_hearts.png', import.meta.url),
    '2_of_clubs': new URL('../../../public/images/2_of_clubs.png', import.meta.url),
    '2_of_spades': new URL('../../../public/images/2_of_spades.png', import.meta.url),
    '3_of_diamonds': new URL('../../../public/images/3_of_diamonds.png', import.meta.url),
    '3_of_hearts': new URL('../../../public/images/3_of_hearts.png', import.meta.url),
    '3_of_clubs': new URL('../../../public/images/3_of_clubs.png', import.meta.url),
    '3_of_spades': new URL('../../../public/images/3_of_spades.png', import.meta.url),
    '4_of_diamonds': new URL('../../../public/images/4_of_diamonds.png', import.meta.url),
    '4_of_hearts': new URL('../../../public/images/4_of_hearts.png', import.meta.url),
    '4_of_clubs': new URL('../../../public/images/4_of_clubs.png', import.meta.url),
    '4_of_spades': new URL('../../../public/images/4_of_spades.png', import.meta.url),
    '5_of_diamonds': new URL('../../../public/images/5_of_diamonds.png', import.meta.url),
    '5_of_hearts': new URL('../../../public/images/5_of_hearts.png', import.meta.url),
    '5_of_clubs': new URL('../../../public/images/5_of_clubs.png', import.meta.url),
    '5_of_spades': new URL('../../../public/images/5_of_spades.png', import.meta.url),
    '6_of_diamonds': new URL('../../../public/images/6_of_diamonds.png', import.meta.url),
    '6_of_hearts': new URL('../../../public/images/6_of_hearts.png', import.meta.url),
    '6_of_clubs': new URL('../../../public/images/6_of_clubs.png', import.meta.url),
    '6_of_spades': new URL('../../../public/images/6_of_spades.png', import.meta.url),
    '7_of_diamonds': new URL('../../../public/images/7_of_diamonds.png', import.meta.url),
    '7_of_hearts': new URL('../../../public/images/7_of_hearts.png', import.meta.url),
    '7_of_clubs': new URL('../../../public/images/7_of_clubs.png', import.meta.url),
    '7_of_spades': new URL('../../../public/images/7_of_spades.png', import.meta.url),
    '8_of_diamonds': new URL('../../../public/images/8_of_diamonds.png', import.meta.url),
    '8_of_hearts': new URL('../../../public/images/8_of_hearts.png', import.meta.url),
    '8_of_clubs': new URL('../../../public/images/8_of_clubs.png', import.meta.url),
    '8_of_spades': new URL('../../../public/images/8_of_spades.png', import.meta.url),
    '9_of_diamonds': new URL('../../../public/images/9_of_diamonds.png', import.meta.url),
    '9_of_hearts': new URL('../../../public/images/9_of_hearts.png', import.meta.url),
    '9_of_clubs': new URL('../../../public/images/9_of_clubs.png', import.meta.url),
    '9_of_spades': new URL('../../../public/images/9_of_spades.png', import.meta.url),
    '10_of_diamonds': new URL('../../../public/images/10_of_diamonds.png', import.meta.url),
    '10_of_hearts': new URL('../../../public/images/10_of_hearts.png', import.meta.url),
    '10_of_clubs': new URL('../../../public/images/10_of_clubs.png', import.meta.url),
    '10_of_spades': new URL('../../../public/images/10_of_spades.png', import.meta.url),
    'jack_of_diamonds': new URL('../../../public/images/jack_of_diamonds.png', import.meta.url),
    'jack_of_hearts': new URL('../../../public/images/jack_of_hearts.png', import.meta.url),
    'jack_of_clubs': new URL('../../../public/images/jack_of_clubs.png', import.meta.url),
    'jack_of_spades': new URL('../../../public/images/jack_of_spades.png', import.meta.url),
    'queen_of_diamonds': new URL('../../../public/images/queen_of_diamonds.png', import.meta.url),
    'queen_of_hearts': new URL('../../../public/images/queen_of_hearts.png', import.meta.url),
    'queen_of_clubs': new URL('../../../public/images/queen_of_clubs.png', import.meta.url),
    'queen_of_spades': new URL('../../../public/images/queen_of_spades.png', import.meta.url),
    'king_of_diamonds': new URL('../../../public/images/king_of_diamonds.png', import.meta.url),
    'king_of_hearts': new URL('../../../public/images/king_of_hearts.png', import.meta.url),
    'king_of_clubs': new URL('../../../public/images/king_of_clubs.png', import.meta.url),
    'king_of_spades': new URL('../../../public/images/king_of_spades.png', import.meta.url),
    'ace_of_diamonds': new URL('../../../public/images/ace_of_diamonds.png', import.meta.url),
    'ace_of_hearts': new URL('../../../public/images/ace_of_hearts.png', import.meta.url),
    'ace_of_clubs': new URL('../../../public/images/ace_of_clubs.png', import.meta.url),
    'ace_of_spades': new URL('../../../public/images/ace_of_spades.png', import.meta.url),
};

function getUrlOfCard(card: Card): URL {
    return cardToUrl[`${card.value}_of_${card.suit}`];
}

