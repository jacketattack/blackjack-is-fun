import { Dispatch, SetStateAction, useState } from 'react'

import { BlackjackHand, Card } from '../../interfaces/card.interface'
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation'
import {
    checkInsuranceOffered,
    dealerHasBlackjack,
} from '../../services/insurance'
import { Dealer } from '../dealer/dealer'
import { DeckStatus } from '../deck-status/deck-status'

import { HandHistory } from '../hand-history/hand-history'
import { Insurance } from '../insurance/insurance'
import { Player } from '../player/player'
import { Title } from '../title/title'

import * as styles from './app.module.css'

interface AppState {
    playerFinalTotals: number[]
    dealerHand: Card[]
    insuranceOffered: boolean
    insuranceAccepted: boolean
    dealerHasBlackjack: boolean
}

export function App() {
    let [appState, setAppState]: [
        AppState,
        Dispatch<SetStateAction<AppState>>,
    ] = useState({
        playerFinalTotals: [],
        dealerHand: [],
        insuranceOffered: false,
        insuranceAccepted: false,
        dealerHasBlackjack: false,
    })

    function notifyDealerToPlay(
        playerFinalHandsOfCards: BlackjackHand[]
    ): void {
        const playerFinalTotals: number[] = playerFinalHandsOfCards.map(
            (hand: BlackjackHand) => calculateHandOfCardsTotal(hand.cards).total
        )

        setAppState({
            ...appState,
            playerFinalTotals,
        })
    }

    function setDealerFinalHandOfCards(dealerFinalHandOfCards: Card[]): void {
        // Check if dealer has blackjack
        const hasBlackjack = dealerHasBlackjack(dealerFinalHandOfCards)

        setAppState({
            ...appState,
            dealerHand: dealerFinalHandOfCards,
            dealerHasBlackjack: hasBlackjack,
        })
    }

    function handleInsuranceAccepted(): void {
        setAppState({
            ...appState,
            insuranceOffered: false,
            insuranceAccepted: true,
        })
    }

    function handleInsuranceDeclined(): void {
        setAppState({
            ...appState,
            insuranceOffered: false,
            insuranceAccepted: false,
        })
    }

    function checkAndOfferInsurance(dealerCards: Card[]): void {
        if (dealerCards.length > 0) {
            const firstCard = dealerCards[0]
            if (checkInsuranceOffered(firstCard)) {
                setAppState({
                    ...appState,
                    insuranceOffered: true,
                    insuranceAccepted: false,
                })
            }
        }
    }

    return (
        <div className={styles.game}>
            <Title />
            <DeckStatus />
            <Dealer
                playerFinalTotals={appState.playerFinalTotals}
                onHasFinishedPlaying={setDealerFinalHandOfCards}
            />

            <div className={styles.tableMarkings}>
                <div className={styles.blackjackPays}>
                    BLACKJACK PAYS 3 TO 2
                </div>
                <div className={styles.dealerRules}>
                    DEALER MUST HIT ON 16 AND STAND ON ALL 17s
                </div>
                <div className={styles.insurancePays}>
                    INSURANCE PAYS 2 TO 1
                </div>
            </div>

            <Player
                name="PLAYER"
                onHasFinishedActions={notifyDealerToPlay}
                dealerHand={appState.dealerHand}
                onDeal={checkAndOfferInsurance}
            />

            {appState.insuranceOffered && (
                <Insurance
                    originalBet={10}
                    onAccept={handleInsuranceAccepted}
                    onDecline={handleInsuranceDeclined}
                />
            )}

            {appState.insuranceAccepted && appState.dealerHasBlackjack && (
                <div
                    className={`${styles.insuranceResult} ${styles.insuranceResultWin}`}
                >
                    Insurance Paid! Dealer has Blackjack.
                </div>
            )}

            {appState.insuranceAccepted && !appState.dealerHasBlackjack && (
                <div
                    className={`${styles.insuranceResult} ${styles.insuranceResultLoss}`}
                >
                    Insurance Lost. Dealer does not have Blackjack.
                </div>
            )}

            <HandHistory />
        </div>
    )
}
