import {
    getBankroll,
    setBankroll,
    resetBankroll,
    addToBankroll,
    subtractFromBankroll,
} from './bankroll'

describe('Bankroll Service', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
    })

    describe('getBankroll', () => {
        it('should return default bankroll when localStorage is empty', () => {
            const bankroll = getBankroll()
            expect(bankroll).toBe(1000)
        })

        it('should return stored bankroll value', () => {
            localStorage.setItem('blackjackBankroll', '1500')
            const bankroll = getBankroll()
            expect(bankroll).toBe(1500)
        })

        it('should initialize default bankroll in localStorage when empty', () => {
            getBankroll()
            expect(localStorage.getItem('blackjackBankroll')).toBe('1000')
        })
    })

    describe('setBankroll', () => {
        it('should set bankroll value in localStorage', () => {
            setBankroll(2000)
            expect(localStorage.getItem('blackjackBankroll')).toBe('2000')
        })

        it('should allow setting bankroll to zero', () => {
            setBankroll(0)
            expect(localStorage.getItem('blackjackBankroll')).toBe('0')
        })
    })

    describe('resetBankroll', () => {
        it('should reset bankroll to default value', () => {
            localStorage.setItem('blackjackBankroll', '500')
            resetBankroll()
            expect(localStorage.getItem('blackjackBankroll')).toBe('1000')
        })
    })

    describe('addToBankroll', () => {
        it('should add amount to current bankroll', () => {
            localStorage.setItem('blackjackBankroll', '1000')
            const newBankroll = addToBankroll(500)
            expect(newBankroll).toBe(1500)
            expect(localStorage.getItem('blackjackBankroll')).toBe('1500')
        })

        it('should handle negative amounts', () => {
            localStorage.setItem('blackjackBankroll', '1000')
            const newBankroll = addToBankroll(-200)
            expect(newBankroll).toBe(800)
        })
    })

    describe('subtractFromBankroll', () => {
        it('should subtract amount from current bankroll', () => {
            localStorage.setItem('blackjackBankroll', '1000')
            const newBankroll = subtractFromBankroll(300)
            expect(newBankroll).toBe(700)
            expect(localStorage.getItem('blackjackBankroll')).toBe('700')
        })

        it('should handle subtracting more than bankroll', () => {
            localStorage.setItem('blackjackBankroll', '100')
            const newBankroll = subtractFromBankroll(200)
            expect(newBankroll).toBe(-100)
        })
    })
})
