import { Pin, PinOff, Pencil, Trash2, Clock } from 'lucide-react';
import type { Memo } from '../types/memo';
import { TagBadge } from './TagBadge';

interface MemoCardProps {
  memo: Memo;
  isRemoving?: boolean;
  onView: (memo: Memo) => void;
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onTagClick: (tag: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export function MemoCard({
  memo,
  isRemoving = false,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  onTagClick,
}: MemoCardProps) {
  return (
    <article
      onClick={() => onView(memo)}
      className={[
        'group relative bg-white rounded-2xl border p-4 flex flex-col gap-3 cursor-pointer',
        'shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        memo.isPinned
          ? 'border-indigo-300 ring-1 ring-indigo-200'
          : 'border-slate-200',
        isRemoving ? 'memo-removing' : '',
      ].join(' ')}
    >
      {/* 고정 배지 */}
      {memo.isPinned && (
        <span className="absolute top-3 right-3 text-indigo-400">
          <Pin size={14} fill="currentColor" />
        </span>
      )}

      {/* 제목 */}
      <h3 className="text-sm font-semibold text-slate-800 leading-snug pr-6 line-clamp-2">
        {memo.title || '제목 없음'}
      </h3>

      {/* 요약 */}
      {memo.summary && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {memo.summary}
        </p>
      )}

      {/* 태그 */}
      {memo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
          {memo.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} onClick={onTagClick} />
          ))}
        </div>
      )}

      {/* 하단: 날짜 + 액션 버튼 */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={11} />
          {formatDate(memo.updatedAt)}
        </span>

        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onTogglePin(memo.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
            aria-label={memo.isPinned ? '고정 해제' : '고정'}
          >
            {memo.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button
            type="button"
            onClick={() => onEdit(memo)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
            aria-label="편집"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(memo.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
