import { Dispatch, SetStateAction, useState } from 'react'

import { BlackjackHand, Card } from '../../interfaces/card.interface'
import { BettingState } from '../../interfaces/betting.interface'
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation'
import { initializeBettingState } from '../../services/betting'
import { Dealer } from '../dealer/dealer'
import { Player } from '../player/player'
import { Title } from '../title/title'
import * as styles from './app.module.css'

interface AppState {
    playerFinalTotals: number[]
    dealerHand: Card[]
    bettingState: BettingState
}

export function App() {
    let [appState, setAppState]: [
        AppState,
        Dispatch<SetStateAction<AppState>>,
    ] = useState({
        playerFinalTotals: [],
        dealerHand: [],
        bettingState: initializeBettingState(),
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
            // Don't reset dealerHand here—it will be managed by the Dealer component
        })
    }

    // Reset dealer hand when starting a new game
    function resetDealerHand(): void {
        // Don't clear dealerHand here—let the Dealer component handle the initial deal
        // The dealer's initial hand will be set when the player starts a new game
    }

    function setDealerFinalHandOfCards(dealerFinalHandOfCards: Card[]): void {
        setAppState({
            ...appState,
            dealerHand: dealerFinalHandOfCards,
        })
    }

    const updateBankroll = (winnings: number): void => {
        setAppState({
            ...appState,
            bettingState: {
                ...appState.bettingState,
                bankroll: appState.bettingState.bankroll + winnings,
                currentBet: 0,
            },
        })
    }

    return (
        <div className={styles.game}>
            <Title />
            <Dealer
                playerFinalTotals={appState.playerFinalTotals}
                dealerHand={appState.dealerHand}
                onHasFinishedPlaying={setDealerFinalHandOfCards}
            />
            <Player
                name="PLAYER"
                onHasFinishedActions={notifyDealerToPlay}
                dealerHand={appState.dealerHand}
                bettingState={appState.bettingState}
                onBettingStateChange={(bettingState) =>
                    setAppState({ ...appState, bettingState })
                }
                onBankrollUpdate={updateBankroll}
                onResetDealerHand={resetDealerHand}
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
        </div>
    )
}
