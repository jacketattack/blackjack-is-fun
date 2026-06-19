import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useHandOfCardsTotal from '../../hooks/useHandOfCardsTotal'

import { BlackjackHand, Card } from '../../interfaces/card.interface'
import { BettingState } from '../../interfaces/betting.interface'
import { dealHand, drawCard } from '../../services/deck'
import calculateHandOfCardsTotal, {
    CardTotal,
} from '../../services/handOfCardsCalculation'
import {
    placeBet,
    canDoubleDown as canDoubleDownBet,
    canSplit as canSplitBet,
    doubleDownBet,
    splitBet,
} from '../../services/betting'
import { HandOfCards } from '../hand-of-cards/hand-of-cards'
import { PlayerActions } from '../player-actions/player-actions'
import { PlayerHandResult } from '../player-hand-result/player-hand-result'
import * as styles from './player.module.css'

interface PlayerProps {
    name: string
    dealerHand: Card[]
    bettingState: BettingState
    onHasFinishedActions(playerFinalHandsOfCards: BlackjackHand[]): void
    onBettingStateChange(bettingState: BettingState): void
    onBankrollUpdate: (winnings: number) => void
    onResetDealerHand?: () => void
}

interface PlayerState {
    blackjackHands: BlackjackHand[]
    activeHandIndex: number
}

export const Player = (props: PlayerProps) => {
    let [playerState, setPlayerState]: [
        PlayerState,
        Dispatch<SetStateAction<PlayerState>>,
    ] = useState<PlayerState>({
        blackjackHands: [],
        activeHandIndex: 0,
    })

    let [initialized, setInitialized]: [
        boolean,
        Dispatch<SetStateAction<boolean>>,
    ] = useState(false)

    let [betInput, setBetInput]: [number, Dispatch<SetStateAction<number>>] =
        useState(props.bettingState.betAmount)

    // Initialize game on first render
    useEffect(() => {
        if (!initialized) {
            startNewGame()
            setInitialized(true)
        }
    }, [initialized])

    useEffect(() => {
        if (dealerTotalIsTwentyOne() && playerState.blackjackHands.length > 0) {
            const finishedHands = finishActiveHand(playerState.blackjackHands)
            setPlayerState((prevState) => ({
                ...prevState,
                blackjackHands: finishedHands,
                activeHandIndex: finishedHands.length,
            }))
            props.onHasFinishedActions(finishedHands)
        }
    }, [props.dealerHand, playerState.blackjackHands.length])

    // Calculate dealer hand total manually to ensure it's up-to-date
    const dealerHandTotal: CardTotal = calculateHandOfCardsTotal(
        props.dealerHand
    )

    function dealerTotalIsTwentyOne(): boolean {
        return calculateHandOfCardsTotal(props.dealerHand).total === 21
    }

    function setBet(): void {
        const bet = Math.min(betInput, props.bettingState.bankroll)
        if (bet <= 0) return

        props.onBettingStateChange({
            ...props.bettingState,
            betAmount: bet,
        })
    }

    function startNewGame(): void {
        if (props.bettingState.bankroll < props.bettingState.betAmount) {
            // Insufficient funds, don't start game
            setPlayerState({
                blackjackHands: [],
                activeHandIndex: 0,
            })
            props.onHasFinishedActions([]) // Reset dealer
            return
        }

        const updatedBettingState = placeBet(props.bettingState)
        const newHand = dealHand()
        newHand.bet = updatedBettingState.currentBet

        props.onBettingStateChange(updatedBettingState)
        setPlayerState({
            blackjackHands: [newHand],
            activeHandIndex: 0,
        })

        // Don't reset dealer hand here-let the Dealer component handle the initial deal
    }

    function resetGame(): void {
        setPlayerState({
            blackjackHands: [],
            activeHandIndex: 0,
        })
        props.onHasFinishedActions([]) // Reset dealer
        if (props.onResetDealerHand) {
            props.onResetDealerHand()
        }
    }

    function hit(): void {
        const handsOfCardsWithActiveHandHit: BlackjackHand[] =
            addCardToActiveHand()
        setPlayerState({
            ...playerState,
            blackjackHands: [...handsOfCardsWithActiveHandHit],
        })
    }

    function doubleDown(): void {
        // Check if player has sufficient bankroll
        if (!canDoubleDownBet(props.bettingState)) {
            return
        }

        const updatedBettingState = doubleDownBet(props.bettingState)
        props.onBettingStateChange(updatedBettingState)

        const handsOfCardsWithActiveHandHit: BlackjackHand[] =
            addCardToActiveHand()
        finishActiveHand(handsOfCardsWithActiveHandHit)

        // Update the bet on the active hand
        handsOfCardsWithActiveHandHit[playerState.activeHandIndex].bet =
            updatedBettingState.currentBet

        const newActiveHandIndex: number = getNextActiveHandIndex()
        setPlayerState({
            blackjackHands: handsOfCardsWithActiveHandHit,
            activeHandIndex: newActiveHandIndex,
        })

        if (playerIsFinished(newActiveHandIndex)) {
            props.onHasFinishedActions(handsOfCardsWithActiveHandHit)
        }
    }

    function split(): void {
        // Check if player has sufficient bankroll
        if (!canSplitBet(props.bettingState)) {
            return
        }

        const updatedBettingState = splitBet(props.bettingState)
        props.onBettingStateChange(updatedBettingState)

        const splitCard: Card =
            playerState.blackjackHands[playerState.activeHandIndex].cards[0]
        const currentBet =
            playerState.blackjackHands[playerState.activeHandIndex].bet ||
            props.bettingState.betAmount

        const splitHands: BlackjackHand[] = [
            {
                cards: [splitCard, drawCard()],
                finished: false,
                bet: currentBet,
            },
            {
                cards: [splitCard, drawCard()],
                finished: false,
                bet: currentBet,
            },
        ]
        const copyOfBlackjackHands: BlackjackHand[] = [
            ...playerState.blackjackHands,
        ]
        copyOfBlackjackHands.splice(
            playerState.activeHandIndex,
            1,
            ...splitHands
        )

        setPlayerState({
            ...playerState,
            blackjackHands: copyOfBlackjackHands,
        })
    }

    function isBlackjack(hand: BlackjackHand): boolean {
        return (
            hand.cards.length === 2 &&
            calculateHandOfCardsTotal(hand.cards).total === 21
        )
    }

    function calculateWinnings(dealerTotal: number): number {
        let winnings = 0
        playerState.blackjackHands.forEach((hand) => {
            const playerTotal = calculateHandOfCardsTotal(hand.cards).total
            const bet = hand.bet || 0

            if (playerTotal > 21) {
                winnings -= bet // Player loses bet (bust)
            } else if (dealerTotal > 21) {
                // Player wins (dealer bust)
                if (isBlackjack(hand)) {
                    winnings += Math.floor(bet * 1.5) // Blackjack pays 3:2 (net winnings: 1.5x bet)
                } else {
                    winnings += bet // Regular win pays 1:1 (net winnings: 1x bet)
                }
            } else if (playerTotal > dealerTotal) {
                // Player wins (higher total)
                if (isBlackjack(hand)) {
                    winnings += Math.floor(bet * 1.5) // Blackjack pays 3:2 (net winnings: 1.5x bet)
                } else {
                    winnings += bet // Regular win pays 1:1 (net winnings: 1x bet)
                }
            } else if (playerTotal === dealerTotal) {
                winnings += 0 // Push, no net change (original bet is already in bankroll)
            } else {
                winnings -= bet // Player loses (lower total)
            }
        })
        return winnings
    }

    function stand(): void {
        const newActiveHandIndex: number = getNextActiveHandIndex()

        setPlayerState({
            blackjackHands: finishActiveHand(playerState.blackjackHands),
            activeHandIndex: newActiveHandIndex,
        })

        if (playerIsFinished(newActiveHandIndex)) {
            props.onHasFinishedActions(playerState.blackjackHands)
        }
    }

    function handleNoMoreCardsAllowed(): void {
        if (
            !playerIsFinished() &&
            !playerState.blackjackHands[playerState.activeHandIndex].finished
        ) {
            stand()
        }
    }

    // Handle dealer's final hand and update bankroll
    useEffect(() => {
        if (playerIsFinished() && props.dealerHand.length > 0) {
            const winnings = calculateWinnings(dealerHandTotal.total)
            props.onBankrollUpdate(winnings)
        }
    }, [
        props.dealerHand,
        playerState.activeHandIndex,
        playerState.blackjackHands.length,
    ])

    function playerIsFinished(
        activeHandIndex: number = playerState.activeHandIndex
    ): boolean {
        return activeHandIndex >= getNumberOfHands()
    }

    function getNumberOfHands(): number {
        return playerState.blackjackHands.length
    }

    function addCardToActiveHand(): BlackjackHand[] {
        const handWithNewCardAdded: BlackjackHand = {
            ...playerState.blackjackHands[playerState.activeHandIndex],
            cards: [
                ...playerState.blackjackHands[playerState.activeHandIndex]
                    .cards,
                drawCard(),
            ],
        }
        const copyOfHandsOfCards = [...playerState.blackjackHands]
        copyOfHandsOfCards[playerState.activeHandIndex] = handWithNewCardAdded
        return copyOfHandsOfCards
    }

    function finishActiveHand(
        blackjackHands: BlackjackHand[]
    ): BlackjackHand[] {
        if (!blackjackHands[playerState.activeHandIndex]) {
            return blackjackHands
        }
        const copyOfBlackjackHands: BlackjackHand[] = [...blackjackHands]
        copyOfBlackjackHands[playerState.activeHandIndex].finished = true

        return copyOfBlackjackHands
    }

    function getNextActiveHandIndex(): number {
        let updatedHandIndex: number = playerState.activeHandIndex + 1

        return updatedHandIndex
    }

    // Render new game button if no game is active
    const hasActiveGame = playerState.blackjackHands.length > 0
    const canStartNewGameBtn =
        props.bettingState.bankroll >= props.bettingState.betAmount

    return (
        <div className={styles.player}>
            <div className={styles.name}>{props.name}</div>
            {!hasActiveGame && (
                <div className={styles.newGameContainer}>
                    <div className={styles.betInputContainer}>
                        <input
                            type="number"
                            className={styles.betInput}
                            value={betInput}
                            onChange={(e) =>
                                setBetInput(Number(e.target.value))
                            }
                            min="1"
                            max={props.bettingState.bankroll}
                        />
                        <button
                            className={styles.setBetButton}
                            onClick={setBet}
                        >
                            Set Bet
                        </button>
                    </div>
                    {!canStartNewGameBtn ? (
                        <div className={styles.noFundsMessage}>
                            Game Over - Insufficient Bankroll
                        </div>
                    ) : (
                        <button
                            className={styles.newGameButton}
                            onClick={startNewGame}
                        >
                            Start Game (Bet: ${props.bettingState.betAmount})
                        </button>
                    )}
                </div>
            )}
            {hasActiveGame && (
                <div className={styles.betInfo}>
                    <div className={styles.currentBet}>
                        Current Bet: ${props.bettingState.currentBet}
                    </div>
                    <button
                        className={styles.newGameButton}
                        onClick={resetGame}
                    >
                        New Game
                    </button>
                </div>
            )}
            {playerState.blackjackHands.length > 0 && (
                <div className={styles.hands}>
                    {playerState.blackjackHands.map(
                        (hand: BlackjackHand, index: number) => (
                            <div className={styles.hand} key={index}>
                                <HandOfCards
                                    blackjackHand={hand}
                                    onBust={handleNoMoreCardsAllowed}
                                    onTotalTwentyOne={handleNoMoreCardsAllowed}
                                />
                                {playerIsFinished() && (
                                    <PlayerHandResult
                                        dealerFinalTotal={dealerHandTotal.total}
                                        playerFinalTotal={
                                            calculateHandOfCardsTotal(
                                                hand.cards
                                            ).total
                                        }
                                    />
                                )}
                                {playerState.activeHandIndex === index && (
                                    <PlayerActions
                                        handOfCards={
                                            playerState.blackjackHands[
                                                playerState.activeHandIndex
                                            ].cards
                                        }
                                        onHit={hit}
                                        onDoubleDown={doubleDown}
                                        onSplit={split}
                                        onStand={stand}
                                        canDoubleDown={canDoubleDownBet(
                                            props.bettingState
                                        )}
                                        canSplit={canSplitBet(
                                            props.bettingState
                                        )}
                                    />
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
            <div className={styles.bankrollDisplay}>
                Bankroll: ${props.bettingState.bankroll}
            </div>
        </div>
    )
}
