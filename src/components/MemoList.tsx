import { StickyNote } from 'lucide-react';
import type { Memo } from '../types/memo';
import { MemoCard } from './MemoCard';

interface MemoListProps {
  memos: Memo[];
  removingId?: string | null;
  onView: (memo: Memo) => void;
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export function MemoList({
  memos,
  removingId,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  onTagClick,
}: MemoListProps) {
  if (memos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
        <StickyNote size={48} strokeWidth={1.2} className="text-slate-300" />
        <div className="text-center">
          <p className="font-medium text-slate-500">메모가 없습니다</p>
          <p className="text-sm mt-1">새 메모 버튼을 눌러 첫 메모를 작성해보세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          isRemoving={memo.id === removingId}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
