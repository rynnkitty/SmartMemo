import { Tag } from 'lucide-react';
import type { Memo } from '../types/memo';
import { TagBadge } from './TagBadge';

interface TagFilterProps {
  memos: Memo[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export function TagFilter({
  memos,
  selectedTags,
  onToggleTag,
  onClearTags,
}: TagFilterProps) {
  const tagCounts = memos.reduce<Record<string, number>>((acc, memo) => {
    for (const tag of memo.tags) acc[tag] = (acc[tag] ?? 0) + 1;
    return acc;
  }, {});

  const allTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  if (allTags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
        <Tag size={24} strokeWidth={1.5} />
        <p className="text-xs">태그가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          태그 필터
        </span>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={onClearTags}
            className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            초기화
          </button>
        )}
      </div>

      {allTags.map(([tag, count]) => (
        <button
          key={tag}
          type="button"
          onClick={() => onToggleTag(tag)}
          className={[
            'flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors',
            selectedTags.includes(tag)
              ? 'bg-indigo-50'
              : 'hover:bg-slate-100',
          ].join(' ')}
        >
          <TagBadge
            tag={tag}
            active={selectedTags.includes(tag)}
          />
          <span className="text-xs font-medium text-slate-400 ml-2 shrink-0">
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
