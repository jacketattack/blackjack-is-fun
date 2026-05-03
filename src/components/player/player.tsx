import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useHandOfCardsTotal from '../../hooks/useHandOfCardsTotal'

import { BlackjackHand, Card } from '../../interfaces/card.interface'
import { dealHand, drawCard } from '../../services/deck'
import calculateHandOfCardsTotal, {
    CardTotal,
} from '../../services/handOfCardsCalculation'
import { HandOfCards } from '../hand-of-cards/hand-of-cards'
import { PlayerActions } from '../player-actions/player-actions'
import { PlayerHandResult } from '../player-hand-result/player-hand-result'
import * as styles from './player.module.css'

interface PlayerProps {
    name: string
    dealerHand: Card[]
    onHasFinishedActions(playerFinalHandsOfCards: BlackjackHand[]): void
    initialBet: number
    onBetPlaced(amount: number): void
    onWinningsReceived(amount: number): void
    gameStarted: boolean
}

interface PlayerState {
    blackjackHands: BlackjackHand[]
    activeHandIndex: number
    winningsProcessed: boolean
}

export const Player = (props: PlayerProps) => {
    let [playerState, setPlayerState]: [
        PlayerState,
        Dispatch<SetStateAction<PlayerState>>,
    ] = useState({
        blackjackHands: [dealHand(props.initialBet)],
        activeHandIndex: 0,
        winningsProcessed: false,
    })

    useEffect(() => {
        if (props.gameStarted) {
            setPlayerState({
                blackjackHands: [dealHand(props.initialBet)],
                activeHandIndex: 0,
                winningsProcessed: false,
            })
        }
    }, [props.gameStarted, props.initialBet])

    useEffect(() => {
        if (dealerTotalIsTwentyOne()) {
            const finishedHands = finishActiveHand(playerState.blackjackHands)
            setPlayerState((prevState) => ({
                ...prevState,
                blackjackHands: finishedHands,
                activeHandIndex: finishedHands.length,
            }))
            props.onHasFinishedActions(finishedHands)
        }
    }, [props.dealerHand])

    const dealerHandTotal: CardTotal = useHandOfCardsTotal(props.dealerHand)

    // Handle winnings
    useEffect(() => {
        if (
            playerIsFinished() &&
            props.dealerHand.length > 0 &&
            !playerState.winningsProcessed
        ) {
            const dealerTotal = calculateHandOfCardsTotal(
                props.dealerHand
            ).total
            let totalWinnings = 0

            playerState.blackjackHands.forEach((hand) => {
                const playerTotal = calculateHandOfCardsTotal(hand.cards).total
                if (playerTotal <= 21) {
                    if (dealerTotal > 21 || playerTotal > dealerTotal) {
                        // Win
                        totalWinnings += hand.bet * 2
                    } else if (playerTotal === dealerTotal) {
                        // Push
                        totalWinnings += hand.bet
                    }
                }
            })

            if (totalWinnings > 0) {
                props.onWinningsReceived(totalWinnings)
            }
            setPlayerState((prev) => ({ ...prev, winningsProcessed: true }))
        }
    }, [
        playerState.blackjackHands,
        playerState.activeHandIndex,
        props.dealerHand,
        playerState.winningsProcessed,
    ])

    function dealerTotalIsTwentyOne(): boolean {
        return calculateHandOfCardsTotal(props.dealerHand).total === 21
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
        const activeHand =
            playerState.blackjackHands[playerState.activeHandIndex]
        props.onBetPlaced(activeHand.bet)

        const handsOfCardsWithActiveHandHit: BlackjackHand[] =
            addCardToActiveHand(activeHand.bet * 2)
        finishActiveHand(handsOfCardsWithActiveHandHit)

        const newActiveHandIndex: number = getNextActiveHandIndex()
        setPlayerState({
            ...playerState,
            blackjackHands: handsOfCardsWithActiveHandHit,
            activeHandIndex: newActiveHandIndex,
        })

        if (playerIsFinished(newActiveHandIndex)) {
            props.onHasFinishedActions(handsOfCardsWithActiveHandHit)
        }
    }

    function split(): void {
        const activeHand =
            playerState.blackjackHands[playerState.activeHandIndex]
        props.onBetPlaced(activeHand.bet)

        const splitCard: Card = activeHand.cards[0]
        const splitHands: BlackjackHand[] = [
            {
                cards: [splitCard, drawCard()],
                finished: false,
                bet: activeHand.bet,
            },
            {
                cards: [splitCard, drawCard()],
                finished: false,
                bet: activeHand.bet,
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

    function stand(): void {
        const newActiveHandIndex: number = getNextActiveHandIndex()

        const finishedHands = finishActiveHand(playerState.blackjackHands)
        setPlayerState({
            ...playerState,
            blackjackHands: finishedHands,
            activeHandIndex: newActiveHandIndex,
        })

        if (playerIsFinished(newActiveHandIndex)) {
            props.onHasFinishedActions(finishedHands)
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

    function playerIsFinished(
        activeHandIndex: number = playerState.activeHandIndex
    ): boolean {
        return activeHandIndex >= getNumberOfHands()
    }

    function getNumberOfHands(): number {
        return playerState.blackjackHands.length
    }

    function addCardToActiveHand(newBet?: number): BlackjackHand[] {
        const activeHand =
            playerState.blackjackHands[playerState.activeHandIndex]
        const handWithNewCardAdded: BlackjackHand = {
            ...activeHand,
            cards: [...activeHand.cards, drawCard()],
            bet: newBet !== undefined ? newBet : activeHand.bet,
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

    return (
        <div className={styles.player}>
            <div className={styles.name}>{props.name}</div>
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
                                        calculateHandOfCardsTotal(hand.cards)
                                            .total
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
                                    bet={hand.bet}
                                    onHit={hit}
                                    onDoubleDown={doubleDown}
                                    onSplit={split}
                                    onStand={stand}
                                />
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
