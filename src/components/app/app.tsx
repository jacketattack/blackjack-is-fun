import { Dispatch, SetStateAction, useState } from 'react'

import { BlackjackHand } from '../../interfaces/card.interface'
import { dealEmptyHand } from '../../services/deck'
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation'
import { Dealer } from '../dealer/dealer'
import { EndGameActions } from '../end-game-actions/end-game-actions'
import { Player } from '../player/player'
import { Title } from '../title/title'
import * as styles from './app.module.css'

interface AppState {
    playerFinalTotals: number[]
    dealerHand: BlackjackHand
    handCountIndex: number
}

export function App() {
    let [appState, setAppState]: [
        AppState,
        Dispatch<SetStateAction<AppState>>,
    ] = useState({
        playerFinalTotals: [],
        dealerHand: dealEmptyHand(),
        handCountIndex: 0,
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

    function setDealerFinalHandOfCards(
        dealerFinalHandOfCards: BlackjackHand
    ): void {
        setAppState({
            ...appState,
            dealerHand: dealerFinalHandOfCards,
        })
    }

    function nextHand(): void {
        setAppState({
            playerFinalTotals: [],
            dealerHand: dealEmptyHand(),
            handCountIndex: appState.handCountIndex + 1,
        })
    }

    return (
        <>
            <div className={styles.game}>
                <Title />
                <Dealer
                    playerFinalTotals={appState.playerFinalTotals}
                    onHasFinishedPlaying={setDealerFinalHandOfCards}
                />
                <Player
                    key={appState.handCountIndex}
                    name="PLAYER"
                    onHasFinishedActions={notifyDealerToPlay}
                    dealerHand={appState.dealerHand}
                />
                {appState.dealerHand.finished && (
                    <EndGameActions onNewHand={nextHand} />
                )}
            </div>
        </>
    )
}
