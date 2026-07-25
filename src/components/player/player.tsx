import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as React from 'react';
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
    onDeal?: (dealerCards: Card[]) => void
}

interface PlayerState {
    blackjackHands: BlackjackHand[]
    activeHandIndex: number
}

export const Player = (props: PlayerProps) => {
    const [playerState, setPlayerState]: [
        PlayerState,
        Dispatch<SetStateAction<PlayerState>>,
    ] = useState({
        blackjackHands: [dealHand()],
        activeHandIndex: 0,
    })

    // Notify parent when a new hand is dealt
    useEffect(() => {
        if (
            playerState.blackjackHands.length === 1 &&
            playerState.blackjackHands[0].cards.length === 2
        ) {
            // This is a fresh deal
            const dealerCards = props.dealerHand
            if (dealerCards.length >= 1 && props.onDeal) {
                props.onDeal(dealerCards)
            }
        }
    }, [playerState.blackjackHands, props.dealerHand, props.onDeal])

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
        const handsOfCardsWithActiveHandHit: BlackjackHand[] =
            addCardToActiveHand()
        finishActiveHand(handsOfCardsWithActiveHandHit)

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
        const splitCard: Card =
            playerState.blackjackHands[playerState.activeHandIndex].cards[0]
        const splitHands: BlackjackHand[] = [
            {
                cards: [splitCard, drawCard()],
                finished: false,
            },
            {
                cards: [splitCard, drawCard()],
                finished: false,
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
        const updatedHandIndex: number = playerState.activeHandIndex + 1

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
