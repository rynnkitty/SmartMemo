import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { Memo, SortOrder } from '../types/memo';
import {
  filterMemosByQuery,
  filterMemosByTags,
  sortMemos,
  debounce,
} from '../utils/search';

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  filteredMemos: Memo[];
}

export function useSearch(memos: Memo[]): UseSearchReturn {
  const [searchQuery, setSearchQueryRaw] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const debouncedSet = useRef(
    debounce((q: unknown) => setDebouncedQuery(q as string), 300)
  ).current;

  useEffect(() => {
    debouncedSet(searchQuery);
  }, [searchQuery, debouncedSet]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryRaw(query);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearTags = useCallback(() => setSelectedTags([]), []);

  const filteredMemos = useMemo(() => {
    const byQuery = filterMemosByQuery(memos, debouncedQuery);
    const byTags = filterMemosByTags(byQuery, selectedTags);
    const pinned = byTags.filter((m) => m.isPinned);
    const unpinned = byTags.filter((m) => !m.isPinned);
    return [...sortMemos(pinned, sortOrder), ...sortMemos(unpinned, sortOrder)];
  }, [memos, debouncedQuery, selectedTags, sortOrder]);

  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    toggleTag,
    clearTags,
    sortOrder,
    setSortOrder,
    filteredMemos,
  };
}
