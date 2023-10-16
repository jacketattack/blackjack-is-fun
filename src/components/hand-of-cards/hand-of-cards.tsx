import { BlackjackHand, Card } from '../../interfaces/card.interface'
import { CardImage } from '../card-image/card-image'
import { CardTotalDisplay } from '../card-total-display/card-total-display'
import * as styles from './hand-of-cards.module.css'

interface HandOfCardsProps {
    blackjackHand: BlackjackHand
    onBust?(): void
    onTotalTwentyOne?(): void
}

const BACK_OF_CARD: Card = null // CardImage component shows back of card when given null

export const HandOfCards = (props: HandOfCardsProps) => {
    let cardsToDisplay: Card[]
    if (onlyOneCardToDisplay()) {
        cardsToDisplay = displayBackOfCardNextToDisplayedCard()
    } else {
        cardsToDisplay = [...props.blackjackHand.cards]
    }

    function onlyOneCardToDisplay(): boolean {
        return props.blackjackHand.cards.length === 1
    }

    function displayBackOfCardNextToDisplayedCard(): Card[] {
        return [props.blackjackHand.cards[0], BACK_OF_CARD]
    }

    return (
        <>
            <div className={styles.hand}>
                {cardsToDisplay.map((card: Card, index: number) => (
                    <span key={index}>
                        <CardImage card={card} />
                    </span>
                ))}
                <CardTotalDisplay
                    blackjackHand={props.blackjackHand}
                    onBust={props.onBust}
                    onTotalTwentyOne={props.onTotalTwentyOne}
                />
            </div>
        </>
    )
}
