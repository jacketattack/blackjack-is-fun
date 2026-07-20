import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { BlackjackHand, Card } from '../../interfaces/card.interface'
import { playDealerHand } from '../../services/dealerStrategy'
import { dealHand } from '../../services/deck'
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation'
import { HandOfCards } from '../hand-of-cards/hand-of-cards'
import * as styles from './dealer.module.css'

interface DealerProps {
    playerFinalTotals: number[]
    onHasFinishedPlaying(dealerFinalHandOfCards: Card[]): void
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
        if (
            hasPlayerFinishedPlaying() &&
            !hasPlayerBusted() &&
            !dealerState.blackjackHand.finished &&
            !isPushScenario()
        ) {
            // Dealer plays out hand if player has finished, hasn't busted, and no push
            const dealerFinalHand: Card[] = playDealerHand(
                dealerState.blackjackHand.cards
            )
            setDealerState({
                blackjackHand: {
                    cards: dealerFinalHand,
                    finished: true,
                },
            })
            props.onHasFinishedPlaying(dealerFinalHand)
        } else if (hasPlayerFinishedPlaying() && hasPlayerBusted()) {
            // Dealer does not need to play out hand if player has busted
            props.onHasFinishedPlaying(dealerState.blackjackHand.cards)
        } else if (
            dealerTotalIsTwentyOne() &&
            dealerState.blackjackHand.cards.length === 2 &&
            !hasPlayerFinishedPlaying()
        ) {
            // Dealer has blackjack or 21 on deal, and player hasn't finished yet
            props.onHasFinishedPlaying(dealerState.blackjackHand.cards)
        } else if (hasPlayerFinishedPlaying() && isPushScenario()) {
            // Push scenario: dealer does not play
            props.onHasFinishedPlaying(dealerState.blackjackHand.cards)
        }
    }, [props.playerFinalTotals])

    function isPushScenario(): boolean {
        const dealerTotal = calculateHandOfCardsTotal(
            dealerState.blackjackHand.cards
        ).total
        return props.playerFinalTotals.some(
            (playerTotal) => playerTotal === dealerTotal
        )
    }

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
            <HandOfCards blackjackHand={getCardsToDisplay()} />
        </div>
    )
}
