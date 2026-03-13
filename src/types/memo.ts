export type SortOrder = 'newest' | 'oldest';

export interface Memo {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  memos: Memo[];
  searchQuery: string;
  selectedTags: string[];
  sortOrder: SortOrder;
}
