# CLAUDE.md — SmartMemo AI 컨텍스트

> 이 파일은 Claude Code (AI 어시스턴트)가 이 프로젝트의 목적, 구조, 규칙을 빠르게 파악하기 위한 컨텍스트 파일입니다.

---

## 프로젝트 한 줄 요약

**SmartMemo** — 메모 작성 시 AI가 자동으로 태그를 추천하고 요약을 생성하는 로컬 메모 앱. Claude API가 없어도 폴백 로직으로 완전 동작.

---

## 기술 스택

| 레이어 | 기술 | 버전 |
|--------|------|------|
| UI | React | 19 |
| 언어 | TypeScript | 5.6 |
| 빌드 | Vite | 6 |
| 스타일 | TailwindCSS | v4 |
| 아이콘 | lucide-react | 최신 |
| 저장 | LocalStorage | 브라우저 내장 |
| AI | Claude API (선택) | claude-sonnet-4-20250514 |
| 테스트 | Vitest | 최신 |

---

## 디렉토리 구조

```
src/
├── components/       # 순수 UI 컴포넌트 (Props만 받아 렌더)
│   ├── Layout.tsx         # 헤더 + 사이드바 + 메인 레이아웃
│   ├── MemoCard.tsx       # 메모 카드 (hover 애니메이션, pin/edit/delete)
│   ├── MemoEditor.tsx     # 작성/편집 모달 (AI 태그 추천 포함)
│   ├── MemoList.tsx       # 반응형 그리드 (빈 상태 처리)
│   ├── SearchBar.tsx      # 검색 입력 (debounce는 useSearch에서)
│   ├── TagBadge.tsx       # 해시 기반 5색 태그 뱃지
│   ├── TagFilter.tsx      # 태그별 메모 수 표시, 토글 필터
│   └── ConfirmDialog.tsx  # 삭제 확인 모달
├── hooks/            # 상태·사이드이펙트 캡슐화
│   ├── useMemos.ts        # 메모 CRUD + LocalStorage 자동 동기화
│   ├── useSearch.ts       # 검색어 debounce + 태그 필터 + 정렬
│   └── useAI.ts           # generateTags/generateSummary 래핑 + loading/error
├── types/
│   └── memo.ts            # Memo, AppState, SortOrder 타입
├── utils/            # 순수 함수만 (사이드이펙트 없음)
│   ├── storage.ts         # localStorage get/save (QuotaExceededError 처리)
│   ├── search.ts          # filter, sort, debounce
│   └── ai.ts              # Claude API 호출 + 폴백 로직
├── App.tsx           # 전체 상태 조합 + 모달 열기/닫기
└── main.tsx          # React 엔트리포인트
```

---

## 핵심 설계 결정

### 1. AI 폴백 패턴
```
VITE_CLAUDE_API_KEY 있음 → Claude API 호출
VITE_CLAUDE_API_KEY 없음 or API 실패 → 로컬 폴백
  - 태그: 2글자 이상 단어 빈도 분석 → 상위 5개
  - 요약: 본문 앞 100자 + "..."
```
→ API 키 없이도 앱이 **완전히 동작**해야 한다.

### 2. 상태 관리 계층
```
App.tsx
 ├── useMemos  → memos[], addMemo, updateMemo, deleteMemo, togglePin
 └── useSearch(memos) → filteredMemos, searchQuery, selectedTags, sortOrder
```
Redux 등 외부 라이브러리 없이 React 내장 훅만 사용.

### 3. LocalStorage 동기화
`useMemos`의 `useEffect`가 `memos` 변경 시 자동 저장.
키: `"smartmemo_data"`, 5MB 한도 → `QuotaExceededError` catch 후 `console.error`.

### 4. 태그 색상
태그명 해시 → `TAG_PALETTES` 배열(5개) 인덱스 선택.
TailwindCSS v4에서 동적 클래스 purge 방지를 위해 **전체 클래스명을 객체로 선언**.

### 5. debounce 처리
`useSearch`가 `searchQuery`(raw)와 `debouncedQuery`(300ms 지연)를 분리해 유지.
`useRef`로 debounce 함수 인스턴스 안정화.

---

## 코딩 규칙

- 모든 컴포넌트는 **함수형 FC** + TypeScript Props 인터페이스 파일 상단 정의
- 이벤트 핸들러 접두사: `handle` (e.g. `handleSave`, `handleTagKeyDown`)
- 유틸 함수는 **순수 함수** (사이드이펙트 없음, 동일 입력 → 동일 출력)
- TailwindCSS 클래스는 인라인, 별도 CSS 최소화 (`index.css`는 전역 스타일만)
- `noUnusedLocals: true` — 사용하지 않는 import 금지
- `import type` — 타입 전용 import에는 반드시 `type` 키워드 사용

---

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `VITE_CLAUDE_API_KEY` | 선택 | Claude API 키 (없으면 폴백 동작) |

`.env.example` 참조.

---

## 주요 npm 스크립트

```bash
npm run dev       # 개발 서버 (localhost:5173)
npm run build     # tsc + vite build
npm run lint      # ESLint
npm run test      # Vitest 단위 테스트
npm run coverage  # 커버리지 리포트
```

---

## 알려진 제약 사항

- **CORS**: 브라우저에서 Claude API 직접 호출 시 CORS 오류 가능 → `utils/ai.ts`에서 catch 후 폴백으로 graceful degradation
- **LocalStorage 5MB 한도**: 메모가 매우 많을 경우 저장 실패 가능 → `QuotaExceededError` catch 처리됨
- **API 키 노출**: `VITE_` 접두사 변수는 번들에 포함됨 → 프로덕션에서는 프록시 서버 권장 (현재는 핵카톤 데모 목적)
