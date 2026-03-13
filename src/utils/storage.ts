import type { Memo } from '../types/memo';

const STORAGE_KEY = 'smartmemo_data';

export function getMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Memo[];
  } catch {
    return [];
  }
}

export function saveMemos(memos: Memo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Unable to save memos.');
    } else {
      console.error('Failed to save memos:', error);
    }
  }
}
