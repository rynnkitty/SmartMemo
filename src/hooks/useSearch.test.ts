import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSearch } from './useSearch';
import type { Memo } from '../types/memo';

function makeMemo(overrides: Partial<Memo> = {}): Memo {
  return {
    id: crypto.randomUUID(),
    title: '제목',
    content: '내용',
    summary: '요약',
    tags: [],
    isPinned: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const memos: Memo[] = [
  makeMemo({ title: 'React 학습', tags: ['react'], createdAt: '2026-01-01T00:00:00.000Z' }),
  makeMemo({ title: 'TypeScript 팁', tags: ['typescript'], createdAt: '2026-03-01T00:00:00.000Z' }),
  makeMemo({ title: '장보기', tags: ['일상'], isPinned: true, createdAt: '2026-02-01T00:00:00.000Z' }),
];

describe('useSearch', () => {
  it('초기 filteredMemos: 전체 반환, 핀 메모 먼저', () => {
    const { result } = renderHook(() => useSearch(memos));
    expect(result.current.filteredMemos).toHaveLength(3);
    expect(result.current.filteredMemos[0].isPinned).toBe(true);
  });

  it('searchQuery: setSearchQuery 호출 시 raw 상태 즉시 반영', () => {
    const { result } = renderHook(() => useSearch(memos));
    act(() => { result.current.setSearchQuery('React'); });
    expect(result.current.searchQuery).toBe('React');
  });

  it('debounce: 300ms 경과 전에는 필터 미적용', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSearch(memos));
    act(() => { result.current.setSearchQuery('React'); });
    expect(result.current.filteredMemos).toHaveLength(3);
    vi.useRealTimers();
  });

  it('debounce: 300ms 경과 후 필터 적용', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSearch(memos));
    act(() => { result.current.setSearchQuery('React'); });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current.filteredMemos).toHaveLength(1);
    expect(result.current.filteredMemos[0].title).toBe('React 학습');
    vi.useRealTimers();
  });

  it('toggleTag: 태그 추가 시 필터링', () => {
    const { result } = renderHook(() => useSearch(memos));
    act(() => { result.current.toggleTag('react'); });
    expect(result.current.selectedTags).toContain('react');
    expect(result.current.filteredMemos).toHaveLength(1);
  });

  it('toggleTag: 같은 태그 재클릭 시 해제', () => {
    const { result } = renderHook(() => useSearch(memos));
    act(() => { result.current.toggleTag('react'); });
    act(() => { result.current.toggleTag('react'); });
    expect(result.current.selectedTags).toHaveLength(0);
    expect(result.current.filteredMemos).toHaveLength(3);
  });

  it('clearTags: 모든 선택 태그 초기화', () => {
    const { result } = renderHook(() => useSearch(memos));
    act(() => {
      result.current.toggleTag('react');
      result.current.toggleTag('typescript');
    });
    expect(result.current.selectedTags).toHaveLength(2);
    act(() => { result.current.clearTags(); });
    expect(result.current.selectedTags).toHaveLength(0);
    expect(result.current.filteredMemos).toHaveLength(3);
  });

  it('setSortOrder newest: 핀 제외 최신순', () => {
    const { result } = renderHook(() => useSearch(memos));
    const unpinned = result.current.filteredMemos.filter((m) => !m.isPinned);
    expect(unpinned[0].title).toBe('TypeScript 팁'); // 2026-03-01
    expect(unpinned[1].title).toBe('React 학습');    // 2026-01-01
  });

  it('setSortOrder oldest: 핀 제외 오래된순', () => {
    const { result } = renderHook(() => useSearch(memos));
    act(() => { result.current.setSortOrder('oldest'); });
    const unpinned = result.current.filteredMemos.filter((m) => !m.isPinned);
    expect(unpinned[0].title).toBe('React 학습');    // 2026-01-01
    expect(unpinned[1].title).toBe('TypeScript 팁'); // 2026-03-01
  });
});
