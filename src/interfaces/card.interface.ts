export interface Card {
    value: CardValue;
    suit: CardSuit;
}

export enum CardValue {
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    TEN = '10',
    JACK = 'jack',
    QUEEN = 'queen',
    KING = 'king',
    ACE = 'ace'
}

export enum CardSuit {
    DIAMONDS = 'diamonds',
    HEARTS = 'hearts',
    CLUBS = 'clubs',
    SPADES = 'spades'
}