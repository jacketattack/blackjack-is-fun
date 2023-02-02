import { useEffect, useState } from "react";
import { Card } from "../interfaces/card.interface";
import calculateHandOfCardsTotal, { CardTotal } from "../services/handOfCardsCalculation";


function useHandOfCardsTotal(cards: Card[]): CardTotal {
    const [cardTotal, setTotal] = useState({
        total: 0,
        isSoft: false
    });

    useEffect(() => {
        setTotal(calculateHandOfCardsTotal(cards));
    }, [cards]);

    return cardTotal;
}

export default useHandOfCardsTotal;