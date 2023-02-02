import { Title } from '../title/title';
import { HandOfCards }  from '../hand-of-cards/hand-of-cards';
import { CardSuit, CardValue } from '../../interfaces/card.interface';
import { sample } from 'lodash';
import * as styles from './app.module.css';
import { Player } from '../player/player';
import dealHand from '../../services/dealHand';

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
    return (
        <div className={styles.game}>
            <Title />
            <Player name="Dealer" cards={dealHand()} />
        </div>
    );
}