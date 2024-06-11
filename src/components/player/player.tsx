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
import { blackjack } from '../card-total-display/card-total-display.module.css'

interface PlayerProps {
    name: string
    dealerHand: BlackjackHand
    onHasFinishedActions(playerFinalHandsOfCards: BlackjackHand[]): void
}

interface PlayerState {
    blackjackHands: BlackjackHand[]
    activeHandIndex: number
}

export const Player = (props: PlayerProps) => {
    let [playerState, setPlayerState]: [
        PlayerState,
        Dispatch<SetStateAction<PlayerState>>,
    ] = useState({
        blackjackHands: [dealHand()],
        activeHandIndex: 0,
    })

    const dealerHandTotal: CardTotal = useHandOfCardsTotal(
        props.dealerHand.cards
    )
    // console.log(dealerHandTotal)
    useEffect(() => {
        // console.log("pre blackman")
        if (dealerHandTotal.blackjack) {
            // console.log("dealer blackjack")
            stand()
        }
    }, [dealerHandTotal])

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
        // console.log(blackjackHands)
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
