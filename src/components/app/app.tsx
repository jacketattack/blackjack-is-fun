import dealHand from '../../services/dealHand';
import { Player } from '../player/player';
import { Title } from '../title/title';
import * as styles from './app.module.css';

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
            <Player name="DEALER" cards={dealHand()} />
        </div>
    );
}