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

    const dealerHandTotal: CardTotal = useHandOfCardsTotal(props.dealerHand)
    useEffect(() => {
        if (dealerHandTotal.blackjack) {
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

        const newActiveHandIndex: number = playerState.activeHandIndex + 1
        setPlayerState({
            blackjackHands: handsOfCardsWithActiveHandHit,
            activeHandIndex: newActiveHandIndex,
        })

        if (playerIsFinished(newActiveHandIndex)) {
            props.onHasFinishedActions(handsOfCardsWithActiveHandHit)
        }
    }

    function split(): void {
        // create new hand with first card being two cards in current hand
    }

    function stand(): void {
        const newActiveHandIndex: number = playerState.activeHandIndex + 1
        setPlayerState({
            ...playerState,
            blackjackHands: finishActiveHand(),
            activeHandIndex: newActiveHandIndex,
        })

        if (playerIsFinished(newActiveHandIndex)) {
            props.onHasFinishedActions(playerState.blackjackHands)
        }
    }

    function bust(): void {
        stand()
    }

    function playerIsFinished(activeHandIndex: number): boolean {
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
        blackjackHands: BlackjackHand[] = playerState.blackjackHands
    ): BlackjackHand[] {
        const copyOfBlackjackHands: BlackjackHand[] = [...blackjackHands]
        copyOfBlackjackHands[playerState.activeHandIndex].finished = true

        return copyOfBlackjackHands
    }

    return (
        <div className={styles.player}>
            <div className={styles.name}>{props.name}</div>
            <div className={styles.cards}>
                {playerState.blackjackHands.map(
                    (hand: BlackjackHand, index: number) => (
                        <>
                            <HandOfCards
                                key={index}
                                blackjackHand={hand}
                                onBust={bust}
                                onTotalTwentyOne={stand}
                            />
                            {hand.finished && (
                                <PlayerHandResult
                                    dealerFinalTotal={dealerHandTotal.total}
                                    playerFinalTotal={
                                        calculateHandOfCardsTotal(hand.cards)
                                            .total
                                    }
                                />
                            )}
                        </>
                    )
                )}
                {!playerIsFinished(playerState.activeHandIndex) && (
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
        </div>
    )
}
