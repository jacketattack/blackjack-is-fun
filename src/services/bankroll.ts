const STORAGE_KEY = 'blackjackBankroll'
const DEFAULT_BANKROLL = 1000

export function getBankroll(): number {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
        setBankroll(DEFAULT_BANKROLL)
        return DEFAULT_BANKROLL
    }
    return parseInt(stored, 10)
}

export function setBankroll(amount: number): void {
    localStorage.setItem(STORAGE_KEY, amount.toString())
}

export function resetBankroll(): void {
    setBankroll(DEFAULT_BANKROLL)
}

export function addToBankroll(amount: number): number {
    const current = getBankroll()
    const newAmount = current + amount
    setBankroll(newAmount)
    return newAmount
}

export function subtractFromBankroll(amount: number): number {
    const current = getBankroll()
    const newAmount = current - amount
    setBankroll(newAmount)
    return newAmount
}
