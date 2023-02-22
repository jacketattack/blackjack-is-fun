import { Dispatch, SetStateAction, useState } from 'react';
import { Card } from '../../interfaces/card.interface';
import calculateHandOfCardsTotal from '../../services/handOfCardsCalculation';
import { Dealer } from '../dealer/dealer';
import { PlayerResult } from '../player-result/player-result';
import { Player } from '../player/player';
import { Title } from '../title/title';
import * as styles from './app.module.css';

interface AppState {
    dealerFinalTotal: number;
    playerFinalTotal: number;
    dealerDrewBlackjack: boolean;
}

export function App() {
    /**
     * We have a Player
     * - playerName
     * - hand & total
     * - buttons for player
     * 
     * could just make two separate 'dealer' and 'player' components
     * the player component would have the buttons and such
     */
    let [appState, setAppState]: [AppState, Dispatch<SetStateAction<AppState>>] = useState(
        {
            dealerFinalTotal: null,
            playerFinalTotal: null,
            dealerDrewBlackjack: false
        }
    );

    function notifyDealerToPlay(playerFinalHandOfCards: Card[]): void {
        const playerFinalTotal: number = calculateHandOfCardsTotal(playerFinalHandOfCards).total;
        setAppState({
            ...appState,
            playerFinalTotal
        });
    }

    function setDealerFinalHandOfCards(dealerFinalHandOfCards: Card[]): void {
        const dealerFinalTotal: number = calculateHandOfCardsTotal(dealerFinalHandOfCards).total;
        setAppState({
            ...appState,
            dealerFinalTotal
        })
    }

    function onDealerDrewBlackjack(): void {
        setAppState({
            ...appState,
            dealerFinalTotal: 21,
            dealerDrewBlackjack: true
        });
    }

    return (
        <div className={styles.game}>
            <Title />
            <Dealer playerFinalTotal={appState.playerFinalTotal} onHasFinishedPlaying={setDealerFinalHandOfCards} onDrewBlackjack={onDealerDrewBlackjack}/>
            <Player name="PLAYER" onHasFinishedActions={notifyDealerToPlay} dealerDrewBlackjack={appState.dealerDrewBlackjack}/>
            { appState.playerFinalTotal && appState.dealerFinalTotal && <PlayerResult playerFinalTotal={appState.playerFinalTotal} dealerFinalTotal={appState.dealerFinalTotal}/>}
        </div>
    );
}