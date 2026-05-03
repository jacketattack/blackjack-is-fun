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
}

const MANDATORY_BET = 10
const INITIAL_BANKROLL = 100

export function App() {
    let [bankroll, setBankroll] = useState(INITIAL_BANKROLL)
    let [appState, setAppState]: [
        AppState,
        Dispatch<SetStateAction<AppState>>,
    ] = useState({
        playerFinalTotals: [],
        dealerHand: [],
    })

    function notifyDealerToPlay(
        playerFinalHandsOfCards: BlackjackHand[]
    ): void {
        const playerFinalTotals: number[] = playerFinalHandsOfCards.map(
            (hand: BlackjackHand) => calculateHandOfCardsTotal(hand.cards).total
        )

        // Resolve bets
        const dealerTotal = calculateHandOfCardsTotal(appState.dealerHand).total // appState.dealerHand might not be final yet here
        // Wait, notifyDealerToPlay is called when player finishes. Dealer then plays.
        // Bankroll should be updated AFTER dealer finishes.

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

    function startNewGame() {
        if (bankroll < MANDATORY_BET) {
            alert('Not enough bankroll to play!')
            return
        }
        setBankroll((prev) => prev - MANDATORY_BET)
        setAppState({
            playerFinalTotals: [],
            dealerHand: [],
        })
    }

    return (
        <>
            <div className={styles.game}>
                <Title />
                <button onClick={startNewGame}>New Game</button>
                <Dealer
                    playerFinalTotals={appState.playerFinalTotals}
                    onHasFinishedPlaying={setDealerFinalHandOfCards}
                />
                <Player
                    name="PLAYER"
                    onHasFinishedActions={notifyDealerToPlay}
                    dealerHand={appState.dealerHand}
                    initialBet={MANDATORY_BET}
                    onBetPlaced={(amount) =>
                        setBankroll((prev) => prev - amount)
                    }
                    onWinningsReceived={(amount) =>
                        setBankroll((prev) => prev + amount)
                    }
                    gameStarted={
                        appState.playerFinalTotals.length === 0 &&
                        appState.dealerHand.length === 0
                    }
                />
                <div className={styles.bankroll}>Bankroll: ${bankroll}</div>
            </div>
        </>
    )
}
