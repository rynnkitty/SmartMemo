import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMemos } from './useMemos';

vi.mock('../utils/ai', () => ({
  generateTags: vi.fn().mockResolvedValue(['태그1', '태그2']),
  generateSummary: vi.fn().mockResolvedValue('모의 요약'),
}));

beforeEach(() => {
  localStorage.clear();
});

describe('useMemos', () => {
  it('초기 상태는 빈 배열', () => {
    const { result } = renderHook(() => useMemos());
    expect(result.current.memos).toEqual([]);
  });

  it('addMemo: 메모 추가 + AI 태그/요약 자동 생성', async () => {
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo('제목', '내용');
    });
    expect(result.current.memos).toHaveLength(1);
    expect(result.current.memos[0].title).toBe('제목');
    expect(result.current.memos[0].tags).toEqual(['태그1', '태그2']);
    expect(result.current.memos[0].summary).toBe('모의 요약');
    expect(result.current.memos[0].isPinned).toBe(false);
  });

  it('addMemo: userTags 지정 시 AI 태그 대신 사용', async () => {
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo('제목', '내용', ['custom']);
    });
    expect(result.current.memos[0].tags).toEqual(['custom']);
  });

  it('addMemo: 새 메모는 목록 맨 앞에 추가', async () => {
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo('첫 번째', '내용');
      await result.current.addMemo('두 번째', '내용');
    });
    expect(result.current.memos[0].title).toBe('두 번째');
  });

  it('updateMemo: 제목/내용 수정 + updatedAt 갱신', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo('원본', '원본 내용');
    });
    const id = result.current.memos[0].id;
    const originalUpdatedAt = result.current.memos[0].updatedAt;

    vi.setSystemTime(new Date('2026-01-02T00:00:00.000Z'));
    await act(async () => {
      await result.current.updateMemo(id, '수정됨', '수정된 내용');
    });
    expect(result.current.memos[0].title).toBe('수정됨');
    expect(result.current.memos[0].content).toBe('수정된 내용');
    expect(result.current.memos[0].updatedAt).not.toBe(originalUpdatedAt);
    vi.useRealTimers();
  });

  it('deleteMemo: 해당 id 메모 제거', async () => {
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo('삭제할 메모', '내용');
    });
    const id = result.current.memos[0].id;
    act(() => {
      result.current.deleteMemo(id);
    });
    expect(result.current.memos).toHaveLength(0);
  });

  it('togglePin: isPinned 토글 (false → true → false)', async () => {
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo('메모', '내용');
    });
    const id = result.current.memos[0].id;
    expect(result.current.memos[0].isPinned).toBe(false);
    act(() => { result.current.togglePin(id); });
    expect(result.current.memos[0].isPinned).toBe(true);
    act(() => { result.current.togglePin(id); });
    expect(result.current.memos[0].isPinned).toBe(false);
  });

  it('LocalStorage 자동 저장: 메모 추가 후 localStorage에 반영', async () => {
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo('저장 테스트', '내용');
    });
    const stored = JSON.parse(localStorage.getItem('smartmemo_data') ?? '[]') as { title: string }[];
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('저장 테스트');
  });

  it('초기 로드 시 localStorage에서 메모 복원', async () => {
    const { result: r1 } = renderHook(() => useMemos());
    await act(async () => {
      await r1.current.addMemo('복원 테스트', '내용');
    });
    const { result: r2 } = renderHook(() => useMemos());
    expect(r2.current.memos).toHaveLength(1);
    expect(r2.current.memos[0].title).toBe('복원 테스트');
  });
});
