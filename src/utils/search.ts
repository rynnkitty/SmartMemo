import type { Memo, SortOrder } from '../types/memo';

export function filterMemosByQuery(memos: Memo[], query: string): Memo[] {
  if (!query.trim()) return memos;
  const lower = query.toLowerCase();
  return memos.filter(
    (m) =>
      m.title.toLowerCase().includes(lower) ||
      m.content.toLowerCase().includes(lower)
  );
}

export function filterMemosByTags(memos: Memo[], tags: string[]): Memo[] {
  if (tags.length === 0) return memos;
  return memos.filter((m) => tags.every((tag) => m.tags.includes(tag)));
}

export function sortMemos(memos: Memo[], order: SortOrder): Memo[] {
  return [...memos].sort((a, b) => {
    const diff =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return order === 'newest' ? -diff : diff;
  });
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
