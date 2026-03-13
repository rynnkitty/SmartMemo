import { type ReactNode, useState } from 'react';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import type { Memo, SortOrder } from '../types/memo';
import { SearchBar } from './SearchBar';
import { TagFilter } from './TagFilter';

interface LayoutProps {
  memos: Memo[];
  searchQuery: string;
  selectedTags: string[];
  sortOrder: SortOrder;
  onSearchChange: (q: string) => void;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  onSortChange: (order: SortOrder) => void;
  onNewMemo: () => void;
  children: ReactNode;
}

export function Layout({
  memos,
  searchQuery,
  selectedTags,
  sortOrder,
  onSearchChange,
  onToggleTag,
  onClearTags,
  onSortChange,
  onNewMemo,
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-3">
          {/* 로고 */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🧠</span>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              SmartMemo
            </span>
          </div>

          {/* 검색바 */}
          <div className="flex-1 flex justify-center">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </div>

          {/* 정렬 + 모바일 필터 토글 + 새메모 */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="hidden sm:block text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>

            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="태그 필터"
            >
              <SlidersHorizontal size={18} />
            </button>

            <button
              type="button"
              onClick={onNewMemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">새 메모</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        {/* 데스크톱 사이드바 */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-5">
          <TagFilter
            memos={memos}
            selectedTags={selectedTags}
            onToggleTag={onToggleTag}
            onClearTags={onClearTags}
          />
        </aside>

        {/* 모바일 사이드바 오버레이 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/30" />
            <aside
              className="absolute top-14 left-0 bottom-0 w-64 bg-white border-r border-slate-200 px-4 py-5 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">
                  태그 필터
                </span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              <TagFilter
                memos={memos}
                selectedTags={selectedTags}
                onToggleTag={onToggleTag}
                onClearTags={onClearTags}
              />
            </aside>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-4 py-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
