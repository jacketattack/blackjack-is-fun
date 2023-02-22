import sample from 'lodash/sample';
import { Card, CardSuit, CardValue } from "../interfaces/card.interface";

export function dealHand(): Card[] {
    return [
        drawCard(),
        drawCard()
    ];
}

export function drawCard(): Card {
    return {
        value: sample(Object.values(CardValue)) as CardValue,
        suit: sample(Object.values(CardSuit)) as CardSuit
    };
}