import { X, Pin, PinOff, Pencil, Trash2, Clock } from 'lucide-react';
import type { Memo } from '../types/memo';
import { TagBadge } from './TagBadge';

interface MemoDetailProps {
  memo: Memo;
  onClose: () => void;
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onTagClick: (tag: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MemoDetail({
  memo,
  onClose,
  onEdit,
  onDelete,
  onTogglePin,
  onTagClick,
}: MemoDetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="메모 상세보기"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 본문 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            {memo.isPinned && (
              <Pin size={15} className="text-indigo-400 shrink-0" fill="currentColor" />
            )}
            <h2 className="text-base font-semibold text-slate-800 leading-snug">
              {memo.title || '제목 없음'}
            </h2>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onTogglePin(memo.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              aria-label={memo.isPinned ? '고정 해제' : '고정'}
            >
              {memo.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
            </button>
            <button
              type="button"
              onClick={() => { onClose(); onEdit(memo); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              aria-label="편집"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => { onClose(); onDelete(memo.id); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="삭제"
            >
              <Trash2 size={16} />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 내용 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* AI 요약 */}
          {memo.summary && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-indigo-400 mb-1">AI 요약</p>
              <p className="text-sm text-indigo-700 leading-relaxed">{memo.summary}</p>
            </div>
          )}

          {/* 본문 */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {memo.content || <span className="text-slate-400 italic">내용 없음</span>}
          </div>
        </div>

        {/* 푸터: 태그 + 날짜 */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {memo.tags.map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                onClick={(t) => { onTagClick(t); onClose(); }}
              />
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
            <Clock size={11} />
            {formatDate(memo.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
