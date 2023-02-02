import { Card, CardSuit, CardValue } from "../interfaces/card.interface";
import sample from 'lodash/sample';

function dealHand(): Card[] {
    return [
        drawCard(),
        drawCard()
    ];
}

function drawCard(): Card {
    return {
        value: sample(Object.values(CardValue)) as CardValue,
        suit: sample(Object.values(CardSuit)) as CardSuit
    };
}

export default dealHand;