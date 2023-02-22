import { Card } from "../interfaces/card.interface";
import { drawCard } from "./deck";
import calculateHandOfCardsTotal, { CardTotal } from "./handOfCardsCalculation";

export function playDealerHand(openingHandOfCards: Card[]): Card[] {
    let handOfCards: Card[] = [...openingHandOfCards];
    let cardTotal: CardTotal = calculateHandOfCardsTotal(handOfCards);

    while (cardTotal.total < 17) {
        handOfCards.push(drawCard());
        cardTotal = calculateHandOfCardsTotal(handOfCards);
    }

    return handOfCards;
}