import { Card } from "../../interfaces/card.interface";

interface CardImageProps {
    card: Card;
}

export const CardImage = (props: CardImageProps) => {
    return <img src={getUrlOfCard(props.card)} height="200" width="100"/>;
}

const cardToUrl: { [key: string]: URL } = {
    '2_of_diamonds': new URL('../../../public/card_images/2_of_diamonds.png', import.meta.url),
    '2_of_hearts': new URL('../../../public/card_images/2_of_hearts.png', import.meta.url),
    '2_of_clubs': new URL('../../../public/card_images/2_of_clubs.png', import.meta.url),
    '2_of_spades': new URL('../../../public/card_images/2_of_spades.png', import.meta.url),
    '3_of_diamonds': new URL('../../../public/card_images/3_of_diamonds.png', import.meta.url),
    '3_of_hearts': new URL('../../../public/card_images/3_of_hearts.png', import.meta.url),
    '3_of_clubs': new URL('../../../public/card_images/3_of_clubs.png', import.meta.url),
    '3_of_spades': new URL('../../../public/card_images/3_of_spades.png', import.meta.url),
    '4_of_diamonds': new URL('../../../public/card_images/4_of_diamonds.png', import.meta.url),
    '4_of_hearts': new URL('../../../public/card_images/4_of_hearts.png', import.meta.url),
    '4_of_clubs': new URL('../../../public/card_images/4_of_clubs.png', import.meta.url),
    '4_of_spades': new URL('../../../public/card_images/4_of_spades.png', import.meta.url),
    '5_of_diamonds': new URL('../../../public/card_images/5_of_diamonds.png', import.meta.url),
    '5_of_hearts': new URL('../../../public/card_images/5_of_hearts.png', import.meta.url),
    '5_of_clubs': new URL('../../../public/card_images/5_of_clubs.png', import.meta.url),
    '5_of_spades': new URL('../../../public/card_images/5_of_spades.png', import.meta.url),
    '6_of_diamonds': new URL('../../../public/card_images/6_of_diamonds.png', import.meta.url),
    '6_of_hearts': new URL('../../../public/card_images/6_of_hearts.png', import.meta.url),
    '6_of_clubs': new URL('../../../public/card_images/6_of_clubs.png', import.meta.url),
    '6_of_spades': new URL('../../../public/card_images/6_of_spades.png', import.meta.url),
    '7_of_diamonds': new URL('../../../public/card_images/7_of_diamonds.png', import.meta.url),
    '7_of_hearts': new URL('../../../public/card_images/7_of_hearts.png', import.meta.url),
    '7_of_clubs': new URL('../../../public/card_images/7_of_clubs.png', import.meta.url),
    '7_of_spades': new URL('../../../public/card_images/7_of_spades.png', import.meta.url),
    '8_of_diamonds': new URL('../../../public/card_images/8_of_diamonds.png', import.meta.url),
    '8_of_hearts': new URL('../../../public/card_images/8_of_hearts.png', import.meta.url),
    '8_of_clubs': new URL('../../../public/card_images/8_of_clubs.png', import.meta.url),
    '8_of_spades': new URL('../../../public/card_images/8_of_spades.png', import.meta.url),
    '9_of_diamonds': new URL('../../../public/card_images/9_of_diamonds.png', import.meta.url),
    '9_of_hearts': new URL('../../../public/card_images/9_of_hearts.png', import.meta.url),
    '9_of_clubs': new URL('../../../public/card_images/9_of_clubs.png', import.meta.url),
    '9_of_spades': new URL('../../../public/card_images/9_of_spades.png', import.meta.url),
    '10_of_diamonds': new URL('../../../public/card_images/10_of_diamonds.png', import.meta.url),
    '10_of_hearts': new URL('../../../public/card_images/10_of_hearts.png', import.meta.url),
    '10_of_clubs': new URL('../../../public/card_images/10_of_clubs.png', import.meta.url),
    '10_of_spades': new URL('../../../public/card_images/10_of_spades.png', import.meta.url),
    'jack_of_diamonds': new URL('../../../public/card_images/jack_of_diamonds.png', import.meta.url),
    'jack_of_hearts': new URL('../../../public/card_images/jack_of_hearts.png', import.meta.url),
    'jack_of_clubs': new URL('../../../public/card_images/jack_of_clubs.png', import.meta.url),
    'jack_of_spades': new URL('../../../public/card_images/jack_of_spades.png', import.meta.url),
    'queen_of_diamonds': new URL('../../../public/card_images/queen_of_diamonds.png', import.meta.url),
    'queen_of_hearts': new URL('../../../public/card_images/queen_of_hearts.png', import.meta.url),
    'queen_of_clubs': new URL('../../../public/card_images/queen_of_clubs.png', import.meta.url),
    'queen_of_spades': new URL('../../../public/card_images/queen_of_spades.png', import.meta.url),
    'king_of_diamonds': new URL('../../../public/card_images/king_of_diamonds.png', import.meta.url),
    'king_of_hearts': new URL('../../../public/card_images/king_of_hearts.png', import.meta.url),
    'king_of_clubs': new URL('../../../public/card_images/king_of_clubs.png', import.meta.url),
    'king_of_spades': new URL('../../../public/card_images/king_of_spades.png', import.meta.url),
    'ace_of_diamonds': new URL('../../../public/card_images/ace_of_diamonds.png', import.meta.url),
    'ace_of_hearts': new URL('../../../public/card_images/ace_of_hearts.png', import.meta.url),
    'ace_of_clubs': new URL('../../../public/card_images/ace_of_clubs.png', import.meta.url),
    'ace_of_spades': new URL('../../../public/card_images/ace_of_spades.png', import.meta.url),
    'back_of_card': new URL('../../../public/card_images/back_of_card.png', import.meta.url)
};

function getUrlOfCard(card: Card): URL {
    let cardUrl: URL;
    if (!card) {
        cardUrl = cardToUrl['back_of_card'];
    } else {
        cardUrl = cardToUrl[`${card.value}_of_${card.suit}`];
    }
    return cardUrl;
}

