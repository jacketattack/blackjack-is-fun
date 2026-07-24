/**
 * Unit tests for the split functionality in game.js
 * Tests the enhanced split implementation for issue #74
 */

// Mock DOM elements for testing
const mockDOM = () => {
    const elements = {};

    // Mock document.getElementById
    document.getElementById = jest.fn((id) => {
        if (!elements[id]) {
            elements[id] = {
                textContent: '',
                innerHTML: '',
                classList: {
                    add: jest.fn(),
                    remove: jest.fn(),
                    contains: jest.fn(() => false)
                },
                setAttribute: jest.fn(),
                removeAttribute: jest.fn(),
                appendChild: jest.fn(),
                children: []
            };
        }
        return elements[id];
    });

    // Mock document.querySelectorAll
    document.querySelectorAll = jest.fn(() => []);

    // Mock console.log
    console.log = jest.fn();

    return elements;
};

// Mock the card dealing functions
const mockDealOneCard = (cards) => {
    let index = 0;
    return jest.fn(() => {
        if (index < cards.length) {
            return cards[index++];
        }
        return ['2', 'hearts']; // default fallback
    });
};

describe('Split Functionality', () => {
    let game;
    let mockElements;

    beforeEach(() => {
        // Reset the game module by clearing the cache
        jest.resetModules();
        mockElements = mockDOM();

        // Import the game module fresh
        game = require('./game');

        // Reset game state
        game.playerHands = [];
        game.activeHandIndex = 0;
        game.isSplitMode = false;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial Game State', () => {
        it('should start with one player hand', () => {
            // Mock Math.random for consistent card dealing
            jest.spyOn(Math, 'random').mockReturnValue(0.5);

            game.startGame();

            expect(game.playerHands.length).toBe(1);
            expect(game.playerHands[0].cards.length).toBe(2);
            expect(game.activeHandIndex).toBe(0);
            expect(game.isSplitMode).toBe(false);
        });
    });

    describe('Split Function', () => {
        beforeEach(() => {
            // Set up a hand with a pair of 10s
            game.playerHands = [{
                cards: [['10', 'hearts'], ['10', 'diamonds']],
                finished: false
            }];
            game.activeHandIndex = 0;
            game.isSplitMode = false;
        });

        it('should not split if hand does not have exactly 2 cards', () => {
            // Add a third card to the hand
            game.playerHands[0].cards.push(['5', 'spades']);

            const initialHandCount = game.playerHands.length;
            game.split();

            expect(game.playerHands.length).toBe(initialHandCount);
            expect(console.log).toHaveBeenCalledWith('Cannot split: Hand does not have exactly 2 cards');
        });

        it('should not split if cards are not a pair', () => {
            // Change to non-pair
            game.playerHands[0].cards = [['10', 'hearts'], ['5', 'diamonds']];

            const initialHandCount = game.playerHands.length;
            game.split();

            expect(game.playerHands.length).toBe(initialHandCount);
            expect(console.log).toHaveBeenCalledWith('Cannot split: Not a pair');
        });

        it('should split a pair into two hands', () => {
            // Mock dealOneCard to return predictable cards
            jest.spyOn(game, 'dealOneCard')
                .mockReturnValueOnce(['7', 'spades'])
                .mockReturnValueOnce(['7', 'clubs']);

            mockElements['visualPlayerHand'] = {
                innerHTML: '',
                appendChild: jest.fn()
            };
            mockElements['action-buttons'] = {
                children: [],
                appendChild: jest.fn()
            };

            const initialHandCount = game.playerHands.length;
            game.split();

            // Should now have 2 hands
            expect(game.playerHands.length).toBe(2);
            expect(game.isSplitMode).toBe(true);
            expect(game.activeHandIndex).toBe(0);

            // First hand should have original first card + new card
            expect(game.playerHands[0].cards.length).toBe(2);
            expect(game.playerHands[0].cards[0]).toEqual(['10', 'hearts']);
            expect(game.playerHands[0].cards[1]).toEqual(['7', 'spades']);

            // Second hand should have original second card + new card
            expect(game.playerHands[1].cards.length).toBe(2);
            expect(game.playerHands[1].cards[0]).toEqual(['10', 'diamonds']);
            expect(game.playerHands[1].cards[1]).toEqual(['7', 'clubs']);
        });

        it('should enable resplitting if new hand has a pair', () => {
            // Mock dealOneCard to return same value cards (creating another pair)
            jest.spyOn(game, 'dealOneCard')
                .mockReturnValueOnce(['10', 'spades'])
                .mockReturnValueOnce(['10', 'clubs']);

            mockElements['visualPlayerHand'] = {
                innerHTML: '',
                appendChild: jest.fn()
            };
            mockElements['action-buttons'] = {
                children: [],
                appendChild: jest.fn()
            };
            mockElements['split'] = {
                setAttribute: jest.fn(),
                removeAttribute: jest.fn()
            };

            game.split();

            // After split, the active hand should be the first hand with two 10s
            const activeHand = game.getActiveHand();
            expect(activeHand.cards[0][0]).toBe('10');
            expect(activeHand.cards[1][0]).toBe('10');

            // enableSplitIfPlayerHasPair should have been called
            // and split button should be enabled for the new pair
            expect(mockElements['split'].removeAttribute).toHaveBeenCalledWith('disabled');
        });
    });

    describe('Hand Management', () => {
        it('should get the active hand', () => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: false },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: false }
            ];
            game.activeHandIndex = 1;

            const activeHand = game.getActiveHand();
            expect(activeHand).toEqual(game.playerHands[1]);
        });

        it('should determine if all hands are finished', () => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: true },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: true }
            ];

            expect(game.areAllHandsFinished()).toBe(true);

            game.playerHands[1].finished = false;
            expect(game.areAllHandsFinished()).toBe(false);
        });

        it('should switch to next unfinished hand', () => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: true },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: false },
                { cards: [['8', 'spades'], ['8', 'clubs']], finished: false }
            ];
            game.activeHandIndex = 0;

            game.switchToNextHand();
            expect(game.activeHandIndex).toBe(1);

            // Switch again
            game.switchToNextHand();
            expect(game.activeHandIndex).toBe(2);
        });

        it('should wrap around when switching hands', () => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: false },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: true },
                { cards: [['8', 'spades'], ['8', 'clubs']], finished: true }
            ];
            game.activeHandIndex = 0;

            game.switchToNextHand();
            // Should skip finished hands and wrap around to index 0
            expect(game.activeHandIndex).toBe(0);
        });
    });

    describe('Hit Function with Split Hands', () => {
        beforeEach(() => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: false },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: false }
            ];
            game.activeHandIndex = 0;
            game.isSplitMode = true;

            mockElements['visualPlayerHand'] = {
                textContent: '',
                innerHTML: ''
            };
            mockElements['playerTotal'] = {
                textContent: ''
            };
            mockElements['double-down'] = {
                setAttribute: jest.fn()
            };
        });

        it('should add card to active hand only', () => {
            jest.spyOn(game, 'dealOneCard').mockReturnValue(['7', 'spades']);

            const initialFirstHandLength = game.playerHands[0].cards.length;
            const initialSecondHandLength = game.playerHands[1].cards.length;

            game.hit();

            // Only the active hand (first hand) should have a new card
            expect(game.playerHands[0].cards.length).toBe(initialFirstHandLength + 1);
            expect(game.playerHands[1].cards.length).toBe(initialSecondHandLength);
        });
    });

    describe('Double Down with Split Hands', () => {
        beforeEach(() => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: false },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: false }
            ];
            game.activeHandIndex = 0;
            game.isSplitMode = true;
            
            mockElements['visualPlayerHand'] = {
                textContent: '',
                innerHTML: ''
            };
            mockElements['playerTotal'] = {
                textContent: ''
            };
            mockElements['double-down'] = {
                setAttribute: jest.fn()
            };
            mockElements['result'] = {
                textContent: ''
            };
        });

        it('should mark active hand as finished after double down', () => {
            jest.spyOn(game, 'dealOneCard').mockReturnValue(['7', 'spades']);
            jest.spyOn(game, 'isGameOver').mockReturnValue(false);
            jest.spyOn(game, 'areAllHandsFinished').mockReturnValue(false);

            game.doubleDown();
            
            expect(game.playerHands[0].finished).toBe(true);
            expect(game.playerHands[1].finished).toBe(false);
        });
        
        it('should not call playForDealer if game is over after hit', () => {
            jest.spyOn(game, 'dealOneCard').mockReturnValue(['K', 'spades']); // Causes bust
            jest.spyOn(game, 'isGameOver').mockReturnValue(true); // Game over after hit
            jest.spyOn(game, 'playForDealer').mockImplementation();
            
            game.doubleDown();
            
            expect(game.playForDealer).not.toHaveBeenCalled();
        });

        it('should switch to next hand if not all hands are finished', () => {
            jest.spyOn(game, 'dealOneCard').mockReturnValue(['7', 'spades']);
            jest.spyOn(game, 'isGameOver').mockReturnValue(false);
            jest.spyOn(game, 'areAllHandsFinished').mockReturnValue(false);
            jest.spyOn(game, 'switchToNextHand').mockImplementation();

            game.doubleDown();

            expect(game.switchToNextHand).toHaveBeenCalled();
        });

        it('should call playForDealer if all hands are finished', () => {
            jest.spyOn(game, 'dealOneCard').mockReturnValue(['7', 'spades']);
            jest.spyOn(game, 'isGameOver').mockReturnValue(false);
            jest.spyOn(game, 'areAllHandsFinished').mockReturnValue(true);
            jest.spyOn(game, 'playForDealer').mockImplementation();

            game.doubleDown();

            expect(game.playForDealer).toHaveBeenCalled();
        });
    });

    describe('Stand Function', () => {
        beforeEach(() => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: false },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: false }
            ];
            game.activeHandIndex = 0;
            game.isSplitMode = true;

            jest.spyOn(game, 'areAllHandsFinished').mockReturnValue(false);
            jest.spyOn(game, 'switchToNextHand').mockImplementation();
            jest.spyOn(game, 'playForDealer').mockImplementation();
        });

        it('should mark active hand as finished', () => {
            game.stand();

            expect(game.playerHands[0].finished).toBe(true);
            expect(game.playerHands[1].finished).toBe(false);
        });

        it('should switch to next hand if not all hands are finished', () => {
            game.stand();

            expect(game.switchToNextHand).toHaveBeenCalled();
        });

        it('should call playForDealer if all hands are finished', () => {
            game.areAllHandsFinished = jest.fn().mockReturnValue(true);

            game.stand();

            expect(game.playForDealer).toHaveBeenCalled();
        });
    });

    describe('Check for Player Bust with Split Hands', () => {
        beforeEach(() => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds'], ['10', 'spades']], finished: false },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: false }
            ];
            game.activeHandIndex = 0;
            game.isSplitMode = true;

            mockElements['visualDealerHand'] = {
                textContent: ''
            };
            mockElements['result'] = {
                textContent: ''
            };

            jest.spyOn(game, 'switchToNextHand').mockImplementation();
            jest.spyOn(game, 'playerLoses').mockImplementation();
        });

        it('should mark hand as finished when player busts', () => {
            // Mock calculateTotal to return a bust total
            jest.spyOn(game, 'calculateTotal').mockReturnValue({
                hardValue: 32,
                softValue: null
            });
            jest.spyOn(game, 'getTrueHandValue').mockReturnValue(32);
            jest.spyOn(game, 'areAllHandsFinished').mockReturnValue(false);

            game.checkForPlayerBust();

            expect(game.playerHands[0].finished).toBe(true);
            expect(game.switchToNextHand).toHaveBeenCalled();
        });

        it('should call playerLoses if all hands are finished', () => {
            // Mock calculateTotal to return a bust total
            jest.spyOn(game, 'calculateTotal').mockReturnValue({
                hardValue: 32,
                softValue: null
            });
            jest.spyOn(game, 'getTrueHandValue').mockReturnValue(32);
            jest.spyOn(game, 'areAllHandsFinished').mockReturnValue(true);

            game.checkForPlayerBust();

            expect(game.playerLoses).toHaveBeenCalled();
        });
    });

    describe('Visualization Functions', () => {
        beforeEach(() => {
            game.playerHands = [
                { cards: [['10', 'hearts'], ['10', 'diamonds']], finished: false },
                { cards: [['5', 'spades'], ['5', 'clubs']], finished: false }
            ];
            game.activeHandIndex = 0;
            game.isSplitMode = true;

            mockElements['visualPlayerHand'] = {
                innerHTML: '',
                textContent: ''
            };
            mockElements['playerTotal'] = {
                textContent: ''
            };
        });

        it('should visualize all hands with active/inactive indicators in split mode', () => {
            game.visualizePlayerHandsAndTotals();

            const playerHandElement = mockElements['visualPlayerHand'];
            expect(playerHandElement.innerHTML).toContain('active-hand');
            expect(playerHandElement.innerHTML).toContain('inactive-hand');
        });

        it('should show total for active hand only', () => {
            jest.spyOn(game, 'getVisualTotal').mockReturnValue('20');

            game.visualizePlayerHandsAndTotals();

            const playerTotalElement = mockElements['playerTotal'];
            expect(playerTotalElement.textContent).toBe('20');
        });
    });

    describe('Double Down Function', () => {
    beforeEach(() => {
        game.playerHands = [{
            cards: [['9', 'hearts'], ['8', 'diamonds']],
            finished: false
        }];
        game.activeHandIndex = 0;
        game.isSplitMode = false;
        dealerHand = {
            cards: [['10', 'hearts'], ['5', 'diamonds']]
        };

        // Mock DOM elements to avoid errors
        mockElements['result'] = {
            textContent: ''
        };
        mockElements['visualDealerHand'] = {
            textContent: ''
        };
        mockElements['dealerTotal'] = {
            textContent: ''
        };
        mockElements['visualPlayerHand'] = {
            innerHTML: '',
            textContent: ''
        };
        mockElements['playerTotal'] = {
            textContent: ''
        };
    });

    test('should not call playForDealer if game is over after doubling down', () => {
        // Mock isGameOver to return true after the first call
        jest.spyOn(game, 'isGameOver').mockReturnValueOnce(false).mockReturnValueOnce(true);
        jest.spyOn(game, 'playForDealer').mockImplementation(() => {});

        game.doubleDown();

        expect(game.playForDealer).not.toHaveBeenCalled();
    });

    test('should call playForDealer if game is not over after doubling down', () => {
        // Mock isGameOver to always return false
        jest.spyOn(game, 'isGameOver').mockReturnValue(false);
        jest.spyOn(game, 'dealOneCard').mockReturnValue(['2', 'spades']);

        // Spy on playForDealer to verify it is called
        const playForDealerSpy = jest.spyOn(game, 'playForDealer').mockImplementation(() => {});

        game.doubleDown();

        expect(playForDealerSpy).toHaveBeenCalled();
    });
});

describe('Helper Functions', () => {
        it('should get card values from hand', () => {
            const hand = [['10', 'hearts'], ['5', 'diamonds']];
            const values = game.getCardValuesFromHand(hand);

            expect(values).toEqual(['10', '5']);
        });

        it('should update split button state based on active hand', () => {
            game.playerHands = [{
                cards: [['10', 'hearts'], ['10', 'diamonds']],
                finished: false
            }];
            game.activeHandIndex = 0;

            mockElements['split'] = {
                setAttribute: jest.fn(),
                removeAttribute: jest.fn()
            };

            game.updateSplitButtonState();

            // Should enable split button for pair
            expect(mockElements['split'].removeAttribute).toHaveBeenCalledWith('disabled');
        });

        it('should disable split button for non-pair', () => {
            game.playerHands = [{
                cards: [['10', 'hearts'], ['5', 'diamonds']],
                finished: false
            }];
            game.activeHandIndex = 0;

            mockElements['split'] = {
                setAttribute: jest.fn(),
                removeAttribute: jest.fn()
            };

            game.updateSplitButtonState();

            // Should disable split button for non-pair
            expect(mockElements['split'].setAttribute).toHaveBeenCalledWith('disabled', true);
        });
    });

    describe('Backward Compatibility', () => {
        it('should maintain backward compatibility with playerHand getter/setter', () => {
            // Set using the old API
            game.playerHand = [['10', 'hearts'], ['5', 'diamonds']];

            // Get using the old API
            const hand = game.playerHand;
            expect(hand).toEqual([['10', 'hearts'], ['5', 'diamonds']]);

            // Should be stored in the new format internally
            expect(game.playerHands[0].cards).toEqual([['10', 'hearts'], ['5', 'diamonds']]);
        });

        it('should get card values from player hand using old API', () => {
            game.playerHands = [{
                cards: [['10', 'hearts'], ['5', 'diamonds']],
                finished: false
            }];
            game.activeHandIndex = 0;

            const values = game.getCardValuesFromPlayerHand();
            expect(values).toEqual(['10', '5']);
        });
    });
});

// Additional integration tests
describe('Split Functionality Integration', () => {
    let game;
    let mockElements;

    beforeEach(() => {
        jest.resetModules();
        mockElements = mockDOM();
        game = require('./game');

        // Reset game state
        game.playerHands = [];
        game.activeHandIndex = 0;
        game.isSplitMode = false;
    });

    it('should handle complete split game flow', () => {
        // Set up initial state with a pair
        game.playerHands = [{
            cards: [['10', 'hearts'], ['10', 'diamonds']],
            finished: false
        }];
        game.activeHandIndex = 0;

        // Mock functions
        jest.spyOn(game, 'dealOneCard')
            .mockReturnValueOnce(['7', 'spades'])
            .mockReturnValueOnce(['7', 'clubs']);

        mockElements['visualPlayerHand'] = {
            innerHTML: '',
            appendChild: jest.fn()
        };
        mockElements['action-buttons'] = {
            children: [],
            appendChild: jest.fn()
        };
        mockElements['split'] = {
            setAttribute: jest.fn(),
            removeAttribute: jest.fn()
        };

        // Perform split
        game.split();

        // Verify split was successful
        expect(game.playerHands.length).toBe(2);
        expect(game.isSplitMode).toBe(true);

        // Now hit on first hand
        jest.spyOn(game, 'dealOneCard').mockReturnValue(['8', 'hearts']);
        mockElements['double-down'] = { setAttribute: jest.fn() };
        mockElements['playerTotal'] = { textContent: '' };

        game.hit();

        // First hand should have 3 cards now
        expect(game.playerHands[0].cards.length).toBe(3);

        // Stand on first hand
        jest.spyOn(game, 'areAllHandsFinished').mockReturnValue(false);
        jest.spyOn(game, 'switchToNextHand').mockImplementation();

        game.stand();

        // First hand should be marked as finished
        expect(game.playerHands[0].finished).toBe(true);

        // Switch to second hand
        game.activeHandIndex = 1;

        // Stand on second hand
        game.areAllHandsFinished = jest.fn().mockReturnValue(true);
        jest.spyOn(game, 'playForDealer').mockImplementation();

        game.stand();

        // Should trigger dealer play since all hands are finished
        expect(game.playForDealer).toHaveBeenCalled();
    });
});