var dealerHand;
var playerHand;
var splitHands = [];
var activeHandIndex = 0;

function startGame() {
    // assume one player for now
    dealerHand = dealStartingHand();
    playerHand = dealStartingHand();

    performSetupBeforePlayerDecision();
}

const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function performSetupBeforePlayerDecision() {
    visualizePlayerHandAndTotal();

    let currentDealerTotal = calculateTotal(getCardValuesFromDealerHand());
    if (currentDealerTotal.hardValue === 21) {
        visualizeDealerHandAndTotal();
        playerLoses();
    } else {
        enableSplitIfPlayerHasPair();
        enableDoubleDown();
        displayDealerStartingHand();
    }

}

function enableSplitIfPlayerHasPair() {
    const firstCardValue = convertCardValueToBlackjackValue(playerHand[0][0]);
    const secondCardValue = convertCardValueToBlackjackValue(playerHand[1][0]);

    if (firstCardValue === secondCardValue) {
        enableSplitAction();
    }
}

function enableSplitAction() {
    document.getElementById('split').removeAttribute('disabled');
}

function split() {
    // Check if player has exactly 2 cards and they are a pair
    if (playerHand.length !== 2) {
        console.log('Cannot split: Player does not have exactly 2 cards.');
        return;
    }
    
    const firstCardValue = convertCardValueToBlackjackValue(playerHand[0][0]);
    const secondCardValue = convertCardValueToBlackjackValue(playerHand[1][0]);
    
    if (firstCardValue !== secondCardValue) {
        console.log('Cannot split: Cards are not a pair.');
        return;
    }
    
    // Create two split hands
    const hand1 = [playerHand[0]];
    const hand2 = [playerHand[1]];
    
    // Deal an additional card to each hand
    hand1.push(dealOneCard());
    hand2.push(dealOneCard());
    
    // Store split hands
    splitHands = [hand1, hand2];
    activeHandIndex = 0;
    
    // Update UI to show split hands
    visualizeSplitHands();
    
    // Disable split button for now (can be re-enabled if active hand is a pair)
    document.getElementById('split').setAttribute('disabled', true);
    
    // Check if active hand can be split again
    checkForResplit();
}

function dealOneCard() {
    const suit = suits[Math.round(Math.random() * 3)];
    const value = cardValues[Math.round(Math.random() * 12)]

    return [value, suit];
}

function dealStartingHand() {
    // return 2 cards
    return [dealOneCard(), dealOneCard()];
}

function displayDealerStartingHand() {
    document.getElementById('visualDealerHand').textContent = `${stringifyHand([dealerHand[0]])} + ??`;

    document.getElementById('dealerTotal').textContent = '??';
}

function visualizeDealerHandAndTotal() {
    document.getElementById('visualDealerHand').textContent = stringifyHand(dealerHand);

    document.getElementById('dealerTotal').textContent = getVisualTotal(getCardValuesFromDealerHand());
}

function getCardValuesFromDealerHand() {
    return dealerHand.map((cardData) => cardData[0]);
}

function getCardValuesFromPlayerHand() {
    return playerHand.map((cardData) => cardData[0]);
}

function visualizePlayerHandAndTotal() {
    if (splitHands.length > 0) {
        visualizeSplitHands();
    } else {
        document.getElementById('visualPlayerHand').textContent = stringifyHand(playerHand);
        document.getElementById('playerTotal').textContent = getVisualTotal(getCardValuesFromPlayerHand());
    }
}

function visualizeSplitHands() {
    const activeHand = splitHands[activeHandIndex];
    const otherHand = splitHands[1 - activeHandIndex];
    
    // Display active hand with indicator
    const activeHandStr = stringifyHand(activeHand);
    const activeTotal = getVisualTotal(activeHand.map(card => card[0]));
    
    // Display other hand
    const otherHandStr = stringifyHand(otherHand);
    const otherTotal = getVisualTotal(otherHand.map(card => card[0]));
    
    // Update UI to show both hands
    document.getElementById('visualPlayerHand').textContent = 
        `Active: ${activeHandStr} (${activeTotal}) | Other: ${otherHandStr} (${otherTotal})`;
    document.getElementById('playerTotal').textContent = `Active Total: ${activeTotal}`;
}

function checkForResplit() {
    const activeHand = splitHands[activeHandIndex];
    if (activeHand.length === 2) {
        const firstCardValue = convertCardValueToBlackjackValue(activeHand[0][0]);
        const secondCardValue = convertCardValueToBlackjackValue(activeHand[1][0]);
        if (firstCardValue === secondCardValue) {
            document.getElementById('split').removeAttribute('disabled');
        }
    }
}

function getVisualTotal(cardValues) {
    let blackjackTotal = calculateTotal(cardValues);

    let displayedTotal;
    if (blackjackTotal.hardValue === 21 && cardValues.length == 2) {
        // Blackjack only if 21 on opening 2 cards
        displayedTotal = 'BLACKJACK';
    } else {
        let hardTotal = blackjackTotal.hardValue;
        let softTotal = blackjackTotal.softValue;// ?  : '';
        if (softTotal) {
            if (hardTotal < 22) {
                // show both values
                displayedTotal = `${hardTotal} (OR ${blackjackTotal.softValue})`;
            } else {
                displayedTotal = `${softTotal}`;
            }
        } else {
            displayedTotal = `${hardTotal}`;
        }
    }

    return displayedTotal; 
}

function stringifyHand(rawHand) {
    return rawHand
        .map(
            (card) => `${card[0]} of ${card[1]}`
        )
        .join(' + ');
}

const PAIR_OF_ACES_VALUE = 12;
const SOFT_ACE_VALUE = 1;
const HARD_ACE_VALUE = 11;
const IS_ACE = 1; 

// takes in an array of card values
function calculateTotal(cardValues) {
    let hardTotal = 0;
    let softTotal = null;

    let blackJackValues = [];


    for (cardValue of cardValues) {
        let blackjackValue = convertCardValueToBlackjackValue(cardValue);
        blackJackValues.push(blackjackValue);
    }

    console.log({blackJackValues});

    for (blackJackValue of blackJackValues) {
        hardTotal += blackJackValue;
    }

    if (handContainsAce(blackJackValues)) {
        softTotal = hardTotal; // aces are 1 valued here
        hardTotal += 10;
    }

    // Calculate 

    /**
     * loop to calculate hard Total
     * if card is ace add 10 and set flag that says we found an ace
     * if more aces in hand they are 1s
     * 
     * loop to calculate soft Total
     * Assume all aces are 1s
     */


    console.log({hardTotal});
    console.log({softTotal});
    return {
        hardValue: hardTotal,
        softValue: softTotal
    };
}

function handContainsAce(blackJackValues) {
    return blackJackValues.indexOf(IS_ACE) !== -1;
}


function convertCardValueToBlackjackValue(cardValue) {
    if (cardValue === 'A') {
        return IS_ACE;
    } else if (isNaN(Number(cardValue))) {
        return 10;
    } else {
        return Number(cardValue);
    }
}

function hit(){
    if (splitHands.length > 0) {
        // Add card to active split hand
        splitHands[activeHandIndex].push(dealOneCard());
        visualizeSplitHands();
        disableDoubleDown();
        checkForPlayerBustInActiveHand();
    } else {
        playerHand.push(dealOneCard());
        visualizePlayerHandAndTotal();
        disableDoubleDown();
        checkForPlayerBust();
    }
}

function checkForPlayerBustInActiveHand() {
    const activeHand = splitHands[activeHandIndex];
    let activeHandTotal = calculateTotal(activeHand.map(card => card[0]));
    if (activeHandTotal.hardValue > 21 && (activeHandTotal.softValue > 21 || activeHandTotal.softValue == null)) {
        visualizeDealerHandAndTotal();
        playerLoses();
    }
}

function checkForPlayerBust() {
    let playerTotal = calculateTotal(getCardValuesFromPlayerHand());
    if (playerTotal.hardValue > 21 && (playerTotal.softValue > 21 || playerTotal.softValue == null) ){
        visualizeDealerHandAndTotal();
        playerLoses();
    }
}

function enableDoubleDown() {
    document.getElementById('double-down').removeAttribute('disabled');
}

function disableDoubleDown() {
    document.getElementById('double-down').setAttribute('disabled', true);
}

function doubleDown() {
    if (splitHands.length > 0) {
        // Double down on active split hand
        hit();
        if (!isGameOver()) {
            // Move to next hand or play for dealer
            if (activeHandIndex === 0) {
                activeHandIndex = 1;
                visualizeSplitHands();
            } else {
                playForDealer();
            }
        }
    } else {
        hit();
        if (!isGameOver()) {
            playForDealer();
        }
    }
}

function isGameOver() {
    const resultElement = document.getElementById('result');
    if (resultElement && resultElement.textContent) {
        return true;
    }
    
    if (splitHands.length > 0) {
        // Check all split hands for bust or blackjack
        for (const hand of splitHands) {
            const handTotal = calculateTotal(hand.map(card => card[0]));
            if (handTotal.hardValue > 21 && (handTotal.softValue > 21 || handTotal.softValue == null)) {
                return true;
            }
            if (handTotal.hardValue === 21 && hand.length === 2) {
                return true;
            }
        }
    } else {
        // Check for player bust
        let playerTotal = calculateTotal(getCardValuesFromPlayerHand());
        if (playerTotal.hardValue > 21 && (playerTotal.softValue > 21 || playerTotal.softValue == null)) {
            return true;
        }
        
        // Check for blackjack
        if (playerTotal.hardValue === 21 && getCardValuesFromPlayerHand().length === 2) {
            return true;
        }
    }
    
    // Check for dealer blackjack
    let dealerTotal = calculateTotal(getCardValuesFromDealerHand());
    if (dealerTotal.hardValue === 21 && getCardValuesFromDealerHand().length === 2) {
        return true;
    }
    
    return false;
}

function restartGame() {
    enableActionButtons();
    hideRestartGameButton();
    clearEndCondition();
    startGame();
}

function displayRestartGameButton() {
    document.getElementById('restart-game').classList.remove('hidden');
}

function hideRestartGameButton() {
    document.getElementById('restart-game').classList.add('hidden');
}

function getTrueHandValue(hard, soft) {
    let total;

    if (soft === null) {
        total = hard;
    } else if (hard < 22) {
        total = hard;
    } else {
        total = soft;
    }

    return total;
}

function playerLoses() {
    setEndCondition('YOU LOSE');
}

function playerWins() {
    setEndCondition('YOU WIN');
}

function playerDraws() {
    setEndCondition('PUSH');
}

function setEndCondition(someString) {
    document.getElementById('result').textContent = someString;
    displayRestartGameButton();
    disableActionButtons();
    console.log('FINISHED');
}

function clearEndCondition() {
    document.getElementById('result').textContent = '';
}

function playForDealer() {
    // hit until >= 17

    let currentDealerTotal = calculateTotal(getCardValuesFromDealerHand());
    while (currentDealerTotal.hardValue < 17 || (currentDealerTotal.softValue != null && currentDealerTotal.softValue < 17)) {
        let newCard = dealOneCard();
        console.log('%cDEALER_DRAWS ' + newCard[0], "color: red; font-size: 20px");
        dealerHand.push(newCard);
        currentDealerTotal = calculateTotal(getCardValuesFromDealerHand());
    }

    visualizeDealerHandAndTotal();

    if (splitHands.length > 0) {
        // Evaluate all split hands against dealer
        for (const hand of splitHands) {
            const handTotal = calculateTotal(hand.map(card => card[0]));
            const finalHandTotal = getTrueHandValue(handTotal.hardValue, handTotal.softValue);
            
            const dealerTotal = calculateTotal(getCardValuesFromDealerHand());
            const finalDealerTotal = getTrueHandValue(dealerTotal.hardValue, dealerTotal.softValue);
            
            if (finalDealerTotal > 21) {
                playerWins();
            } else if (finalDealerTotal > finalHandTotal) {
                playerLoses();
            } else if (finalHandTotal > finalDealerTotal) {
                playerWins();
            } else {
                playerDraws();
            }
        }
    } else {
        // check for result
        const dealerTotal = calculateTotal(getCardValuesFromDealerHand());
        const finalDealerTotal = getTrueHandValue(dealerTotal.hardValue, dealerTotal.softValue);

        const playerTotal = calculateTotal(getCardValuesFromPlayerHand());
        const finalPlayerTotal = getTrueHandValue(playerTotal.hardValue, playerTotal.softValue);

        if (finalDealerTotal > 21) {
            playerWins();
        } else if (finalDealerTotal > finalPlayerTotal) {
            playerLoses();
        } else if (finalPlayerTotal > finalDealerTotal) {
            playerWins();
        } else {
            playerDraws();
        }
    }

}

function disableActionButtons() {
    for (actionButton of document.getElementById('action-buttons').children) {
        actionButton.setAttribute('disabled', true);
    }
}

function enableActionButtons() {
    for (actionButton of document.getElementById('action-buttons').children) {
        actionButton.removeAttribute('disabled');
    }
}

startGame();