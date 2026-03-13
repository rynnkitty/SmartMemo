import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import type { Memo } from '../types/memo';
import { TagBadge } from './TagBadge';
import { useAI } from '../hooks/useAI';

interface MemoEditorProps {
  memo?: Memo | null;
  onSave: (title: string, content: string, tags: string[]) => void;
  onCancel: () => void;
}

export function MemoEditor({ memo, onSave, onCancel }: MemoEditorProps) {
  const [title, setTitle] = useState(memo?.title ?? '');
  const [content, setContent] = useState(memo?.content ?? '');
  const [tags, setTags] = useState<string[]>(memo?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const { loading, getTags } = useAI();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function addTagsFromInput(raw: string) {
    const newTags = raw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && !tags.includes(t));
    if (newTags.length > 0) setTags((prev) => [...prev, ...newTags]);
    setTagInput('');
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTagsFromInput(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  async function handleAISuggest() {
    if (!content.trim()) return;
    const suggested = await getTags(content);
    setTags((prev) => {
      const merged = [...prev];
      for (const t of suggested) {
        if (!merged.includes(t)) merged.push(t);
      }
      return merged;
    });
  }

  function handleSave() {
    if (!title.trim() && !content.trim()) return;
    if (tagInput.trim()) addTagsFromInput(tagInput);
    onSave(title.trim(), content.trim(), tags);
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="modal-panel bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col gap-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {memo ? '메모 편집' : '새 메모'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-col gap-3 px-5 py-4">
          {/* 제목 */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full text-base font-medium text-slate-800 placeholder-slate-300 border-0 outline-none focus:ring-0 bg-transparent"
          />

          {/* 구분선 */}
          <div className="border-t border-slate-100" />

          {/* 본문 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            rows={7}
            className="w-full text-sm text-slate-700 placeholder-slate-300 border-0 outline-none focus:ring-0 bg-transparent resize-none leading-relaxed"
          />

          {/* 태그 입력 영역 */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex flex-wrap gap-1.5 items-center min-h-8">
              {tags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  onDelete={(t) => setTags((prev) => prev.filter((x) => x !== t))}
                />
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput.trim() && addTagsFromInput(tagInput)}
                placeholder={tags.length === 0 ? '태그 입력 (콤마 또는 Enter)' : '태그 추가...'}
                className="flex-1 min-w-24 text-xs text-slate-600 placeholder-slate-300 outline-none bg-transparent"
              />
            </div>

            {/* AI 태그 추천 */}
            <button
              type="button"
              onClick={handleAISuggest}
              disabled={loading || !content.trim()}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              AI 태그 추천
            </button>
          </div>
        </div>

        {/* 푸터 버튼 */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() && !content.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
