# 📝 PROGRESS.md - SmartMemo 개발 진행 기록

## 프로젝트 타임라인

### Phase 1: 기획 및 설계 ✅ (2026-03-13)
- [x] 프로젝트 아이디어 선정 — AI 자동 태그/요약 메모 앱
- [x] 문제 정의 및 솔루션 설계
- [x] 기술 스택 결정 (React 19 + TypeScript + Vite + TailwindCSS v4)
- [x] 프로젝트 정의서 작성 (`PROJECT.md`)
- [x] AI 컨텍스트 파일 작성 (`CLAUDE.md`, `.ai-context.md`)
- [x] 진행 기록 파일 생성 (`PROGRESS.md`)

**설계 결정 로그:**
| 결정 사항 | 선택 | 이유 |
|-----------|------|------|
| 프레임워크 | React 19 + Vite | 빠른 HMR, 최신 React 컨커런트 기능 |
| 언어 | TypeScript 5 | 타입 안전성, IDE 자동완성 |
| 스타일링 | TailwindCSS v4 | 빠른 개발, 일관된 디자인 시스템 |
| 상태관리 | React Hooks (useState/useMemo) | 추가 라이브러리 불필요한 규모 |
| 데이터 저장 | LocalStorage | 백엔드 없이 독립 동작, 오프라인 지원 |
| AI | Claude API + 폴백 | API 없이도 완전 동작 보장 |
| 아이콘 | lucide-react | 경량, 일관된 디자인, Tree-shakeable |

---

### Phase 2: 프로젝트 초기화 ✅ (2026-03-13)
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] TailwindCSS v4 설치 및 설정 (`@tailwindcss/vite` 플러그인)
- [x] lucide-react 설치
- [x] 디렉토리 구조 생성 (`components/`, `hooks/`, `types/`, `utils/`)
- [x] ESLint 설정 (typescript-eslint, react-hooks, react-refresh)

---

### Phase 3: 핵심 로직 구현 ✅ (2026-03-13)
- [x] `types/memo.ts` — `Memo`, `AppState`, `SortOrder` 타입 정의
- [x] `utils/storage.ts` — LocalStorage CRUD (`QuotaExceededError` 처리)
- [x] `utils/search.ts` — `filterMemosByQuery`, `filterMemosByTags`, `sortMemos`, `debounce`
- [x] `utils/ai.ts` — Claude API 호출 + 한국어 키워드 폴백 로직
- [x] `hooks/useMemos.ts` — 메모 CRUD + `useEffect` LocalStorage 자동 동기화
- [x] `hooks/useSearch.ts` — debounce 300ms + 핀 우선 정렬
- [x] `hooks/useAI.ts` — `loading`/`error` 상태 관리

**이슈 해결 로그:**
| # | 이슈 | 해결 방법 |
|---|------|----------|
| 1 | `debounce` 제네릭 타입 추론 오류 | `T extends (...args: unknown[]) => unknown` 시그니처로 수정 |
| 2 | TailwindCSS v4 동적 클래스 purge | 태그 색상을 전체 클래스명 객체(lookup table)로 선언 |
| 3 | `useMemos` 저장 시 AI 재생성 중복 | `addMemo(title, content, userTags?)` — 에디터에서 태그 전달 시 AI 재호출 건너뜀 |

---

### Phase 4: UI 컴포넌트 구현 ✅ (2026-03-13)
- [x] `Layout.tsx` — sticky 헤더, lg 고정 사이드바, 모바일 오버레이 사이드바
- [x] `SearchBar.tsx` — 검색 아이콘, X 클리어 버튼
- [x] `TagFilter.tsx` — 빈도 내림차순, 메모 수 표시, 초기화 버튼
- [x] `TagBadge.tsx` — 해시 기반 5색 팔레트, 클릭(필터)/삭제(에디터) 모드
- [x] `MemoCard.tsx` — hover `shadow-md + -translate-y-0.5`, 핀 강조 테두리
- [x] `MemoList.tsx` — `grid-cols-1 md:2 lg:3`, 빈 상태 메시지
- [x] `MemoEditor.tsx` — 콤마/Enter 태그 입력, AI 태그 추천 + 로딩 스피너
- [x] `ConfirmDialog.tsx` — 경고 아이콘, 배경 클릭 취소, Escape 닫기

---

### Phase 5: 통합 및 스타일 ✅ (2026-03-13)
- [x] `App.tsx` — `useMemos` + `useSearch` 조합, 판별 유니언으로 모달 상태 관리
- [x] Escape 키보드 네비게이션 (`useEffect + keydown`)
- [x] 모달 열릴 때 `body.overflow = 'hidden'` 스크롤 잠금
- [x] `index.css` — 스크롤바 스타일링, `modal-overlay`/`modal-panel` 진입 애니메이션
- [x] `role="application"`, `aria-label` 접근성 속성 적용
- [x] 반응형 레이아웃 검증 (1열/2열/3열 그리드, 모바일 사이드바 토글)

---

### Phase 6: 테스트 및 배포 ✅ (2026-03-13)
- [x] Vitest 설치 및 테스트 환경 구성
- [x] `utils/storage.test.ts` — getMemos/saveMemos 단위 테스트
- [x] `utils/search.test.ts` — 필터/정렬/debounce 단위 테스트
- [x] `utils/ai.test.ts` — 폴백 로직 단위 테스트
- [x] `npm run build` 프로덕션 빌드 성공 확인 (TypeScript 에러 0)
- [x] GitHub 레포지토리 업로드 (`rynnkitty/SmartMemo`)
- [x] GitHub Actions CI 파이프라인 구성 (lint + type-check + test + build)

---

## 이슈 및 해결 로그 (전체)

| # | 이슈 | 상태 | 해결 방법 |
|---|------|------|----------|
| 1 | `debounce` 제네릭 타입 추론 | ✅ 해결 | `T extends (...args: unknown[]) => unknown` |
| 2 | TailwindCSS v4 동적 클래스 purge | ✅ 해결 | 전체 클래스명 lookup 객체 사용 |
| 3 | 저장 시 AI 태그 중복 재생성 | ✅ 해결 | `userTags?` 선택 파라미터 추가 |
| 4 | git index.lock 충돌 | ✅ 해결 | 백그라운드 프로세스 종료 후 락 파일 삭제 |
| 5 | Claude API CORS 오류 가능성 | ✅ 설계 반영 | try/catch 후 폴백으로 graceful degradation |

---

## AI 활용 기록

| 단계 | AI 활용 내용 | 도구 |
|------|------------|------|
| 기획 | 프로젝트 아이디어, 기획서·문서 작성 | Claude (claude.ai) |
| 타입/유틸 | `types/memo.ts`, `utils/*.ts` 전체 구현 | Claude Code |
| 훅 | `hooks/useMemos.ts`, `useSearch.ts`, `useAI.ts` 구현 | Claude Code |
| 컴포넌트 | 8개 UI 컴포넌트 전체 구현 | Claude Code |
| 통합 | `App.tsx` 조합, 접근성·모달 상태 설계 | Claude Code |
| 테스트 | Vitest 단위 테스트 작성 | Claude Code |
| CI/CD | GitHub Actions 파이프라인 구성 | Claude Code |
| 디버깅 | TypeScript 타입 오류, git 락 파일 이슈 해결 | Claude Code |

---

## 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v0.1 | 2026-03-13 | 기획 완료, 문서 작성 (PROJECT.md, CLAUDE.md, PROGRESS.md) |
| v0.2 | 2026-03-13 | 타입·유틸·훅 구현 (types/, utils/, hooks/) |
| v0.3 | 2026-03-13 | UI 컴포넌트 8개 구현 |
| v1.0 | 2026-03-13 | App.tsx 통합, 테스트, CI/CD, GitHub 배포 |
