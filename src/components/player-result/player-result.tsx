import { ReactElement } from "react";
import * as styles from './player-result.module.css';

interface PlayerResultProps {
    dealerFinalTotal: number;
    playerFinalTotal: number;
}

export const PlayerResult: React.FC<PlayerResultProps> = (props: PlayerResultProps): ReactElement => {
    let didPlayerWin = hasPlayerWon(props.dealerFinalTotal, props.playerFinalTotal);
    let didPlayerPush = hasPlayerPushed(props.dealerFinalTotal, props.playerFinalTotal);

    function hasPlayerWon(dealerFinalTotal: number, playerFinalTotal: number): boolean {
        // Assume player wins
        let playerWins = true;

        // Only need to check for cases for where player does not win
        if (playerFinalTotal > 21) {
            playerWins = false;
        } else if (dealerFinalTotal < 22 && (dealerFinalTotal > playerFinalTotal)) {
            playerWins = false;
        } else if (playerFinalTotal === dealerFinalTotal) {
            playerWins = false;
        }

        return playerWins;
    }

    function hasPlayerPushed(dealerFinalTotal: number, playerFinalTotal: number): boolean {
        return !!dealerFinalTotal && dealerFinalTotal < 22 && (dealerFinalTotal === playerFinalTotal);
    }

    return (
        <div className={styles.result}>
            {
                didPlayerWin && <div className={styles.winner}>WINNER</div>
            }
            {   !didPlayerWin && !didPlayerPush && <div className={styles.loser}>LOSER</div>
            }
            {
                didPlayerPush && <div className={styles.push}>PUSH</div>
            }
        </div>
    );
}