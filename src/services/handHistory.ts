import { Card } from '../interfaces/card.interface'
import calculateHandOfCardsTotal from './handOfCardsCalculation'

export interface HandHistoryEntry {
    id: string
    timestamp: string
    dealerCards: Card[]
    dealerTotal: number
    playerCards: Card[]
    playerTotal: number
    outcome: HandOutcome
    betAmount?: number
    bankrollChange?: number
}

export enum HandOutcome {
    WIN = 'Win',
    LOSS = 'Loss',
    PUSH = 'Push',
    BLACKJACK = 'Blackjack',
}

const STORAGE_KEY = 'blackjackHandHistory'
const MAX_HISTORY_ENTRIES = 20

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export function getHandHistory(): HandHistoryEntry[] {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
        return []
    }
    try {
        return JSON.parse(stored)
    } catch {
        return []
    }
}

export function addHandHistoryEntry(
    entry: Omit<HandHistoryEntry, 'id' | 'timestamp'>
): HandHistoryEntry {
    const history = getHandHistory()
    const newEntry: HandHistoryEntry = {
        ...entry,
        id: generateId(),
        timestamp: new Date().toISOString(),
    }

    // Add new entry at the beginning
    history.unshift(newEntry)

    // Keep only the most recent entries
    if (history.length > MAX_HISTORY_ENTRIES) {
        history.pop()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return newEntry
}

export function clearHandHistory(): void {
    localStorage.removeItem(STORAGE_KEY)
}

export function createHandHistoryEntry(
    dealerCards: Card[],
    playerCards: Card[],
    outcome: HandOutcome,
    betAmount?: number,
    bankrollChange?: number
): HandHistoryEntry {
    return addHandHistoryEntry({
        dealerCards,
        dealerTotal: calculateHandOfCardsTotal(dealerCards).total,
        playerCards,
        playerTotal: calculateHandOfCardsTotal(playerCards).total,
        outcome,
        betAmount,
        bankrollChange,
    })
}
