var dealerHand;
var playerHands = []; // Array to store multiple hands when splitting
var activeHandIndex = 0; // Index of the currently active hand
var isSplitMode = false; // Flag to indicate if we're in split mode

function startGame() {
    // assume one player for now
    dealerHand = dealStartingHand();
    playerHands = [dealStartingHand()]; // Start with one hand
    activeHandIndex = 0;
    isSplitMode = false;

    performSetupBeforePlayerDecision();
}

const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function performSetupBeforePlayerDecision() {
    visualizePlayerHandsAndTotals();

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
    const activeHand = getActiveHand();
    if (activeHand && activeHand.cards && activeHand.cards.length === 2) {
        const firstCardValue = convertCardValueToBlackjackValue(activeHand.cards[0][0]);
        const secondCardValue = convertCardValueToBlackjackValue(activeHand.cards[1][0]);

        if (firstCardValue === secondCardValue) {
            enableSplitAction();
        }
    }
}

function enableSplitAction() {
    const splitButton = document.getElementById('split');
    if (splitButton) {
        splitButton.removeAttribute('disabled');
    }
}

function split() {
    const activeHand = getActiveHand();
    
    // Check if the player has a pair in the active hand
    if (!activeHand || activeHand.cards.length !== 2) {
        console.log('Cannot split: Hand does not have exactly 2 cards');
        return;
    }

    const firstCardValue = convertCardValueToBlackjackValue(activeHand.cards[0][0]);
    const secondCardValue = convertCardValueToBlackjackValue(activeHand.cards[1][0]);

    if (firstCardValue !== secondCardValue) {
        console.log('Cannot split: Not a pair');
        return;
    }

    // Create two new hands from the split
    const card1 = activeHand.cards[0];
    const card2 = activeHand.cards[1];
    
    const hand1 = {
        cards: [card1, dealOneCard()],
        finished: false
    };
    const hand2 = {
        cards: [card2, dealOneCard()],
        finished: false
    };

    // Replace the active hand with the first split hand
    playerHands[activeHandIndex] = hand1;
    
    // Add the second hand to the array
    playerHands.push(hand2);
    
    // Set up split mode
    isSplitMode = true;
    activeHandIndex = 0; // Start with the first hand

    // Visualize all hands with active/inactive indicators
    visualizePlayerHandsAndTotals();
    
    // Add switch hand button if it doesn't exist
    addSwitchHandButton();
    
    // Add tooltip for split hands
    addSplitTooltips();
    
    // Allow resplitting if the new active hand has a pair
    enableSplitIfPlayerHasPair();
    
    // Disable split button for non-active hands
    updateSplitButtonState();
}

function dealOneCard() {
    const suit = suits[Math.round(Math.random() * 3)];
    const value = cardValues[Math.round(Math.random() * 12)]

    return [value, suit];
}

function dealStartingHand() {
    // return 2 cards
    return {
        cards: [dealOneCard(), dealOneCard()],
        finished: false
    };
}

function displayDealerStartingHand() {
    document.getElementById('visualDealerHand').textContent = `${stringifyHand([dealerHand.cards[0]])} + ??`;

    document.getElementById('dealerTotal').textContent = '??';
}

function visualizeDealerHandAndTotal() {
    document.getElementById('visualDealerHand').textContent = stringifyHand(dealerHand.cards);

    document.getElementById('dealerTotal').textContent = getVisualTotal(getCardValuesFromDealerHand());
}

function getCardValuesFromDealerHand() {
    return dealerHand.cards.map((cardData) => cardData[0]);
}

function getCardValuesFromPlayerHand() {
    // Backward compatibility - return values from active hand
    const activeHand = getActiveHand();
    return activeHand ? activeHand.cards.map((cardData) => cardData[0]) : [];
}

function getCardValuesFromHand(handCards) {
    return handCards.map((cardData) => cardData[0]);
}

function visualizePlayerHandsAndTotals() {
    const playerHandElement = document.getElementById('visualPlayerHand');
    const playerTotalElement = document.getElementById('playerTotal');
    
    if (!playerHandElement) return;

    if (isSplitMode && playerHands.length > 1) {
        // Show all hands with active/inactive indicators
        let handsHTML = '';
        playerHands.forEach((hand, index) => {
            const handClass = index === activeHandIndex ? 'active-hand' : 'inactive-hand';
            handsHTML += `<div class="${handClass}">${stringifyHand(hand.cards)}</div>`;
        });
        playerHandElement.innerHTML = handsHTML;
        
        // Show total for active hand
        const activeHand = getActiveHand();
        if (activeHand) {
            playerTotalElement.textContent = getVisualTotal(getCardValuesFromHand(activeHand.cards));
        }
    } else {
        // Single hand mode - backward compatibility
        const primaryHand = playerHands.length > 0 ? playerHands[0].cards : [];
        playerHandElement.textContent = stringifyHand(primaryHand);
        playerTotalElement.textContent = getVisualTotal(getCardValuesFromHand(primaryHand));
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

const IS_ACE = 1; 

// takes in an array of card values
function calculateTotal(cardValues) {
    let hardTotal = 0;
    let softTotal = null;

    let blackJackValues = [];


    for (const cardValue of cardValues) {
        const blackjackValue = convertCardValueToBlackjackValue(cardValue);
        blackJackValues.push(blackjackValue);
    }

    console.log({blackJackValues});

    for (const blackJackValue of blackJackValues) {
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
     * 
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
    const activeHand = getActiveHand();
    if (activeHand) {
        activeHand.cards.push(dealOneCard());
        visualizePlayerHandsAndTotals();
        disableDoubleDown();
        checkForPlayerBust();
    }
}

function checkForPlayerBust() {
    let playerTotal = calculateTotal(getCardValuesFromPlayerHand());
    let trueTotal = getTrueHandValue(playerTotal.hardValue, playerTotal.softValue);
    if (trueTotal > 21) {
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
    hit();
    // Check if game is over (player busted or got blackjack) before dealer plays
    if (isGameOver()) {
        return;
    }
    playForDealer();
}

function isGameOver() {
    return !!document.getElementById('result').textContent;
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
        dealerHand.cards.push(newCard);
        currentDealerTotal = calculateTotal(getCardValuesFromDealerHand());
    }

    visualizeDealerHandAndTotal();

    // check for result
    const finalDealerHard = calculateTotal(getCardValuesFromDealerHand()).hardValue;
    const finalDealerSoft = calculateTotal(getCardValuesFromDealerHand()).softValue; 
    const finalDealerTotal = getTrueHandValue(finalDealerHard, finalDealerSoft);

    const finalPlayerHard = calculateTotal(getCardValuesFromPlayerHand()).hardValue;
    const finalPlayerSoft = calculateTotal(getCardValuesFromPlayerHand()).softValue; 
    const finalPlayerTotal = getTrueHandValue(finalPlayerHard, finalPlayerSoft);


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

function disableActionButtons() {
    const actionButtons = document.getElementById('action-buttons').children;
    for (let i = 0; i < actionButtons.length; i++) {
        actionButtons[i].setAttribute('disabled', true);
    }
}

function enableActionButtons() {
    const actionButtons = document.getElementById('action-buttons').children;
    for (let i = 0; i < actionButtons.length; i++) {
        actionButtons[i].removeAttribute('disabled');
    }
}

function getActiveHand() {
    return playerHands.length > 0 ? playerHands[activeHandIndex] : null;
}

function switchToHand(handIndex) {
    if (handIndex >= 0 && handIndex < playerHands.length && handIndex !== activeHandIndex) {
        activeHandIndex = handIndex;
        visualizePlayerHandsAndTotals();
        enableSplitIfPlayerHasPair();
    }
}

function addSwitchHandButton() {
    // No-op: Click handlers are added in displayAllHands
}

function addSplitTooltips() {
    const playerHandElement = document.getElementById('visualPlayerHand');
    // Remove existing tooltip if any
    const existingTooltip = playerHandElement.querySelector('.tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = `Playing hand ${activeHandIndex + 1} of ${playerHands.length}. Click on other hands to switch.`;
    playerHandElement.appendChild(tooltip);
}

function updateSplitButtonState() {
    const splitButton = document.getElementById('split');
    if (splitButton) {
        const activeHand = getActiveHand();
        if (activeHand && activeHand.cards.length === 2) {
            const firstCardValue = convertCardValueToBlackjackValue(activeHand.cards[0][0]);
            const secondCardValue = convertCardValueToBlackjackValue(activeHand.cards[1][0]);
            if (firstCardValue === secondCardValue) {
                splitButton.removeAttribute('disabled');
                return;
            }
        }
        splitButton.setAttribute('disabled', true);
    }
}

module.exports = {
    doubleDown,
    isGameOver,
    playerLoses,
    playerWins,
    restartGame,
    playForDealer,
    checkForPlayerBust,
    getTrueHandValue,
    startGame,
    visualizeDealerHandAndTotal,
    calculateTotal,
    getCardValuesFromPlayerHand,
    split,
    switchToHand,
    dealOneCard,
    stringifyHand,
    visualizePlayerHandsAndTotals,
    // For testing
    get playerHands() { return playerHands; },
    set playerHands(hands) { playerHands = hands; },
    get activeHandIndex() { return activeHandIndex; },
    set activeHandIndex(index) { activeHandIndex = index; },
    get isSplitMode() { return isSplitMode; },
    set isSplitMode(mode) { isSplitMode = mode; }
};

// Only start the game if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    startGame();
}