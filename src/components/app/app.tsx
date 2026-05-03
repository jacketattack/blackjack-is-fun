import { Dispatch, SetStateAction, useState } from 'react'

import { BlackjackHand, Card } from '../../interfaces/card.interface'
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation'
import { Dealer } from '../dealer/dealer'
import { Player } from '../player/player'
import { Title } from '../title/title'
import * as styles from './app.module.css'

interface AppState {
    playerFinalTotals: number[]
    dealerHand: Card[]
    gameId: number
}

export function App() {
    let [appState, setAppState]: [
        AppState,
        Dispatch<SetStateAction<AppState>>,
    ] = useState({
        playerFinalTotals: [],
        dealerHand: [],
        gameId: 0,
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
        setAppState({
            ...appState,
            dealerHand: dealerFinalHandOfCards,
        })
    }

    function startNewGame(): void {
        setAppState({
            playerFinalTotals: [],
            dealerHand: [],
            gameId: appState.gameId + 1,
        })
    }

    const isGameOver = appState.dealerHand.length > 0

    return (
        <>
            <div className={styles.game}>
                <Title />
                <Dealer
                    key={`dealer-${appState.gameId}`}
                    playerFinalTotals={appState.playerFinalTotals}
                    onHasFinishedPlaying={setDealerFinalHandOfCards}
                />
                <Player
                    key={`player-${appState.gameId}`}
                    name="PLAYER"
                    onHasFinishedActions={notifyDealerToPlay}
                    dealerHand={appState.dealerHand}
                />
                {isGameOver && (
                    <div className={styles.actions}>
                        <button
                            className={styles.newGameButton}
                            onClick={startNewGame}
                        >
                            NEW GAME
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
