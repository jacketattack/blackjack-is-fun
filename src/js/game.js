var dealerHand;
var playerHand;

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
    console.log('IMPLEMENT ME');
    // TODO: tooltip
    // make two hands
    // make them separate sections but add class to denote one as active
    // allow for resplit..
    // i guess it's just hte same .. kind of recursive operation
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
    document.getElementById('visualPlayerHand').textContent = stringifyHand(playerHand);

    document.getElementById('playerTotal').textContent = getVisualTotal(getCardValuesFromPlayerHand());
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
    playerHand.push(dealOneCard());
    visualizePlayerHandAndTotal();
    disableDoubleDown();

    checkForPlayerBust();
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
    hit();
    // TODO: bug is here.. do not play for dealer if game is over
    if (!isGameOver()) {
        playForDealer();
    }
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
        dealerHand.push(newCard);
        currentDealerTotal = calculateTotal(getCardValuesFromDealerHand());
    }

    visualizeDealerHandAndTotal();

    // check for result
    finalDealerHard = calculateTotal(getCardValuesFromDealerHand()).hardValue;
    finalDealerSoft = calculateTotal(getCardValuesFromDealerHand()).softValue; 
    let finalDealerTotal = getTrueHandValue(finalDealerHard, finalDealerSoft);


    finalPlayerHard = calculateTotal(getCardValuesFromPlayerHand()).hardValue;
    finalPlayerSoft = calculateTotal(getCardValuesFromPlayerHand()).softValue; 
    let finalPlayerTotal = getTrueHandValue(finalPlayerHard, finalPlayerSoft);


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