import { describe, it, expect, vi } from 'vitest';
import {
  filterMemosByQuery,
  filterMemosByTags,
  sortMemos,
  debounce,
} from './search';
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

describe('filterMemosByQuery', () => {
  const memos = [
    makeMemo({ title: 'React 학습', content: '훅에 대한 내용' }),
    makeMemo({ title: '장보기', content: '사과, 바나나' }),
    makeMemo({ title: 'TypeScript 팁', content: 'React와 함께 사용' }),
  ];

  it('빈 쿼리면 전체 반환', () => {
    expect(filterMemosByQuery(memos, '')).toHaveLength(3);
    expect(filterMemosByQuery(memos, '   ')).toHaveLength(3);
  });

  it('제목에서 검색 (대소문자 무시)', () => {
    expect(filterMemosByQuery(memos, 'react')).toHaveLength(2);
    expect(filterMemosByQuery(memos, 'REACT')).toHaveLength(2);
  });

  it('본문에서 검색', () => {
    expect(filterMemosByQuery(memos, '사과')).toHaveLength(1);
  });

  it('일치하는 결과 없으면 빈 배열', () => {
    expect(filterMemosByQuery(memos, '존재하지않는검색어xyz')).toHaveLength(0);
  });
});

describe('filterMemosByTags', () => {
  const memos = [
    makeMemo({ tags: ['react', 'frontend'] }),
    makeMemo({ tags: ['react', 'backend'] }),
    makeMemo({ tags: ['vue', 'frontend'] }),
  ];

  it('tags가 빈 배열이면 전체 반환', () => {
    expect(filterMemosByTags(memos, [])).toHaveLength(3);
  });

  it('단일 태그 필터', () => {
    expect(filterMemosByTags(memos, ['react'])).toHaveLength(2);
  });

  it('다중 태그 AND 조건', () => {
    expect(filterMemosByTags(memos, ['react', 'frontend'])).toHaveLength(1);
  });

  it('존재하지 않는 태그 조합 → 빈 배열', () => {
    expect(filterMemosByTags(memos, ['react', 'vue'])).toHaveLength(0);
  });
});

describe('sortMemos', () => {
  const older = makeMemo({ createdAt: '2026-01-01T00:00:00.000Z', title: '오래된' });
  const newer = makeMemo({ createdAt: '2026-06-01T00:00:00.000Z', title: '최신' });
  const memos = [older, newer];

  it('newest: 최신 먼저', () => {
    const result = sortMemos(memos, 'newest');
    expect(result[0].title).toBe('최신');
    expect(result[1].title).toBe('오래된');
  });

  it('oldest: 오래된 것 먼저', () => {
    const result = sortMemos(memos, 'oldest');
    expect(result[0].title).toBe('오래된');
    expect(result[1].title).toBe('최신');
  });

  it('원본 배열을 변경하지 않음 (불변성)', () => {
    const original = [...memos];
    sortMemos(memos, 'newest');
    expect(memos).toEqual(original);
  });
});

describe('debounce', () => {
  it('delay 내에 여러 번 호출해도 함수는 한 번만 실행', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('delay 이후 호출하면 각각 실행', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(300);
    debounced();
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
