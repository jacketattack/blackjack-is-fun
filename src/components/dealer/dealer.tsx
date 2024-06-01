import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { BlackjackHand, Card } from '../../interfaces/card.interface'
import { playDealerHand } from '../../services/dealerStrategy'
import { dealHand } from '../../services/deck'
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation'
import { HandOfCards } from '../hand-of-cards/hand-of-cards'
import * as styles from './dealer.module.css'
import { blackjack } from '../card-total-display/card-total-display.module.css'

interface DealerProps {
    playerFinalTotals: number[]
    onHasFinishedPlaying(dealerFinalHand: BlackjackHand): void
}

interface DealerState {
    blackjackHand: BlackjackHand
}

export const Dealer = (props: DealerProps) => {
    let [dealerState, setDealerState]: [
        DealerState,
        Dispatch<SetStateAction<DealerState>>,
    ] = useState({
        blackjackHand: dealHand(),
    })
    useEffect(() => {
        if (hasPlayerFinishedPlaying()) {
            let finalDealerState: DealerState
            if (hasPlayerBusted()) {
                finalDealerState = {
                    blackjackHand: {
                        ...dealerState.blackjackHand,
                        finished: true,
                    },
                }
            } else {
                const dealerFinalHand: Card[] = playDealerHand(
                    dealerState.blackjackHand.cards
                )

                finalDealerState = {
                    blackjackHand: {
                        cards: dealerFinalHand,
                        finished: true,
                    },
                }
            }
            setDealerState(finalDealerState)
            props.onHasFinishedPlaying(finalDealerState.blackjackHand)
        }
    }, [props.playerFinalTotals])

    function isDealerOpeningHand(): boolean {
        return (
            dealerState.blackjackHand.cards.length === 2 &&
            props.playerFinalTotals.length === 0
        )
    }

    function hasPlayerFinishedPlaying(): boolean {
        return props.playerFinalTotals?.length > 0
    }

    function hasPlayerBusted(): boolean {
        return props.playerFinalTotals.every(
            (handTotal: number) => handTotal > 21
        )
    }

    function dealerTotalIsTwentyOne(): boolean {
        return (
            calculateHandOfCardsTotal(dealerState.blackjackHand.cards).total ===
            21
        )
    }

    function getCardsToDisplay(): BlackjackHand {
        if (dealerTotalIsTwentyOne()) {
            dealerState.blackjackHand.finished = true
        }
        return {
            ...dealerState.blackjackHand,
            cards:
                isDealerOpeningHand() && !dealerTotalIsTwentyOne()
                    ? [dealerState.blackjackHand.cards[0]]
                    : dealerState.blackjackHand.cards,
        }
    }

    return (
        <div className={styles.dealer}>
            <div className={styles.name}>DEALER</div>
            <HandOfCards
                blackjackHand={getCardsToDisplay()}
                testId="dealer-card"
            />
        </div>
    )
}
