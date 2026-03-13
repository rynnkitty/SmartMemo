import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getMemos, saveMemos } from './storage';
import type { Memo } from '../types/memo';

const STORAGE_KEY = 'smartmemo_data';

const mockMemo = (): Memo => ({
  id: '1',
  title: '테스트 메모',
  content: '테스트 내용',
  summary: '테스트 요약',
  tags: ['test'],
  isPinned: false,
  createdAt: '2026-03-13T00:00:00.000Z',
  updatedAt: '2026-03-13T00:00:00.000Z',
});

beforeEach(() => {
  localStorage.clear();
});

describe('getMemos', () => {
  it('localStorage가 비어있으면 빈 배열 반환', () => {
    expect(getMemos()).toEqual([]);
  });

  it('저장된 메모 배열을 파싱하여 반환', () => {
    const memos = [mockMemo()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
    expect(getMemos()).toEqual(memos);
  });

  it('잘못된 JSON이면 빈 배열 반환 (에러 무시)', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json{{{');
    expect(getMemos()).toEqual([]);
  });
});

describe('saveMemos', () => {
  it('메모 배열을 JSON으로 저장', () => {
    const memos = [mockMemo()];
    saveMemos(memos);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(memos));
  });

  it('저장 후 getMemos로 동일한 데이터 복원', () => {
    const memos = [mockMemo(), { ...mockMemo(), id: '2', title: '두 번째' }];
    saveMemos(memos);
    expect(getMemos()).toEqual(memos);
  });

  it('QuotaExceededError 발생 시 console.error 호출', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      const err = new DOMException('QuotaExceededError', 'QuotaExceededError');
      throw err;
    });
    saveMemos([mockMemo()]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
