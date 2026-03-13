import { useState, useEffect, useCallback } from 'react';
import type { Memo } from './types/memo';
import { useMemos } from './hooks/useMemos';
import { useSearch } from './hooks/useSearch';
import { Layout } from './components/Layout';
import { MemoList } from './components/MemoList';
import { MemoEditor } from './components/MemoEditor';
import { MemoDetail } from './components/MemoDetail';
import { ConfirmDialog } from './components/ConfirmDialog';

type EditorState =
  | { open: false }
  | { open: true; memo: Memo | null };

type DeleteState =
  | { pending: false }
  | { pending: true; id: string };

export default function App() {
  const { memos, addMemo, updateMemo, deleteMemo, togglePin } = useMemos();
  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    toggleTag,
    clearTags,
    sortOrder,
    setSortOrder,
    filteredMemos,
  } = useSearch(memos);

  const [editor, setEditor] = useState<EditorState>({ open: false });
  const [deleteState, setDeleteState] = useState<DeleteState>({ pending: false });
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [viewingMemo, setViewingMemo] = useState<Memo | null>(null);

  // Escape 키로 모달 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (deleteState.pending) {
        setDeleteState({ pending: false });
      } else if (editor.open) {
        setEditor({ open: false });
      } else if (viewingMemo) {
        setViewingMemo(null);
      }
    },
    [editor.open, deleteState.pending, viewingMemo]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 모달 열릴 때 body 스크롤 잠금
  const anyModalOpen = editor.open || deleteState.pending || viewingMemo !== null;
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyModalOpen]);

  function handleNewMemo() {
    setEditor({ open: true, memo: null });
  }

  function handleEditMemo(memo: Memo) {
    setEditor({ open: true, memo });
  }

  function handleDeleteRequest(id: string) {
    setDeleteState({ pending: true, id });
  }

  async function handleSave(title: string, content: string, tags: string[]) {
    if (!editor.open) return;
    if (editor.memo) {
      await updateMemo(editor.memo.id, title, content, tags);
    } else {
      await addMemo(title, content, tags);
    }
    setEditor({ open: false });
  }

  function handleConfirmDelete() {
    if (!deleteState.pending) return;
    const id = deleteState.id;
    setDeleteState({ pending: false });
    setRemovingId(id);
    setTimeout(() => {
      deleteMemo(id);
      setRemovingId(null);
    }, 220);
  }

  return (
    <div role="application" aria-label="SmartMemo 앱">
      <Layout
        memos={memos}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        sortOrder={sortOrder}
        onSearchChange={setSearchQuery}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
        onSortChange={setSortOrder}
        onNewMemo={handleNewMemo}
      >
        <MemoList
          memos={filteredMemos}
          removingId={removingId}
          onView={setViewingMemo}
          onEdit={handleEditMemo}
          onDelete={handleDeleteRequest}
          onTogglePin={togglePin}
          onTagClick={toggleTag}
        />
      </Layout>

      {viewingMemo && (
        <MemoDetail
          memo={viewingMemo}
          onClose={() => setViewingMemo(null)}
          onEdit={handleEditMemo}
          onDelete={handleDeleteRequest}
          onTogglePin={togglePin}
          onTagClick={toggleTag}
        />
      )}

      {editor.open && (
        <MemoEditor
          memo={editor.memo}
          onSave={handleSave}
          onCancel={() => setEditor({ open: false })}
        />
      )}

      {deleteState.pending && (
        <ConfirmDialog
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteState({ pending: false })}
        />
      )}
    </div>
  );
}
