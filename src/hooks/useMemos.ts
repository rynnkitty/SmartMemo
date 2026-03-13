import { useState, useEffect, useCallback } from 'react';
import type { Memo } from '../types/memo';
import { getMemos, saveMemos } from '../utils/storage';
import { generateTags, generateSummary } from '../utils/ai';

interface UseMemoReturn {
  memos: Memo[];
  addMemo: (title: string, content: string, tags?: string[]) => Promise<void>;
  updateMemo: (id: string, title: string, content: string, tags?: string[]) => Promise<void>;
  deleteMemo: (id: string) => void;
  togglePin: (id: string) => void;
}

export function useMemos(): UseMemoReturn {
  const [memos, setMemos] = useState<Memo[]>(() => getMemos());

  useEffect(() => {
    saveMemos(memos);
  }, [memos]);

  const addMemo = useCallback(async (title: string, content: string, userTags?: string[]) => {
    const now = new Date().toISOString();
    const [tags, summary] = await Promise.all([
      userTags !== undefined ? Promise.resolve(userTags) : generateTags(content),
      generateSummary(content),
    ]);
    const memo: Memo = {
      id: crypto.randomUUID(),
      title,
      content,
      summary,
      tags,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };
    setMemos((prev) => [memo, ...prev]);
  }, []);

  const updateMemo = useCallback(
    async (id: string, title: string, content: string, userTags?: string[]) => {
      const [tags, summary] = await Promise.all([
        userTags !== undefined ? Promise.resolve(userTags) : generateTags(content),
        generateSummary(content),
      ]);
      setMemos((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, title, content, tags, summary, updatedAt: new Date().toISOString() }
            : m
        )
      );
    },
    []
  );

  const deleteMemo = useCallback((id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPinned: !m.isPinned } : m))
    );
  }, []);

  return { memos, addMemo, updateMemo, deleteMemo, togglePin };
}
