# 📋 프로젝트 정의서: SmartMemo - AI 스마트 메모 앱

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | SmartMemo - AI 스마트 메모 앱 |
| 목적 | 메모 작성 시 AI가 자동으로 태그 추천, 요약, 검색을 지원하는 로컬 메모 앱 |
| 기술 스택 | React 18 + TypeScript + Vite + TailwindCSS + LocalStorage |
| 배포 | Vercel (무료) |
| 개발 기간 | 1일 (Claude Code 활용) |

## 2. 문제 정의 (아이디어 및 활용 가치)

### 해결하려는 문제
- 메모를 많이 작성하면 **나중에 원하는 메모를 찾기 어려움**
- 태그를 직접 달기 귀찮아서 **분류 없이 쌓이는 메모**
- 메모 내용이 길면 **한눈에 파악하기 어려움**

### 솔루션
- AI(Claude API)가 메모 내용을 분석하여 **자동 태그 추천**
- 메모를 **자동 요약**하여 목록에서 미리보기 제공
- **전문 검색(Full-text search)** 으로 빠른 메모 탐색

### 차별성
- 기존 메모앱(Apple Notes, Google Keep)은 AI 태그/요약 기능 없음
- 완전 로컬 동작 가능 (AI 기능은 선택적)
- 심플하고 직관적인 UX

## 3. 핵심 기능 명세

### 3.1 메모 CRUD
```
- 메모 생성: 제목 + 본문 입력
- 메모 수정: 인라인 편집
- 메모 삭제: 확인 다이얼로그 후 삭제
- 메모 목록: 카드형 그리드 레이아웃
```

### 3.2 AI 자동 태그 추천
```
- 메모 저장 시 본문 분석하여 태그 3~5개 자동 추천
- 추천된 태그를 사용자가 수락/거절 가능
- AI 없이도 수동 태그 입력 가능
```

### 3.3 AI 자동 요약
```
- 메모 본문이 100자 이상이면 자동 요약 생성
- 요약은 메모 카드에 미리보기로 표시
```

### 3.4 검색 및 필터
```
- 제목/본문 실시간 검색 (debounce 300ms)
- 태그 기반 필터링 (다중 태그 AND 조건)
- 최신순/오래된순 정렬
```

### 3.5 반응형 디자인
```
- 데스크톱: 3열 그리드
- 태블릿: 2열 그리드
- 모바일: 1열 리스트
```

## 4. 기술 아키텍처

### 4.1 디렉토리 구조
```
smartmemo/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # 전체 레이아웃 (헤더, 사이드바, 메인)
│   │   ├── MemoCard.tsx            # 메모 카드 컴포넌트
│   │   ├── MemoEditor.tsx          # 메모 작성/편집 모달
│   │   ├── MemoList.tsx            # 메모 목록 (그리드)
│   │   ├── SearchBar.tsx           # 검색 바
│   │   ├── TagFilter.tsx           # 태그 필터 사이드바
│   │   ├── TagBadge.tsx            # 태그 뱃지 컴포넌트
│   │   └── ConfirmDialog.tsx       # 삭제 확인 다이얼로그
│   ├── hooks/
│   │   ├── useMemos.ts             # 메모 CRUD 커스텀 훅
│   │   ├── useSearch.ts            # 검색 로직 훅
│   │   └── useAI.ts                # AI 기능 훅 (태그추천, 요약)
│   ├── types/
│   │   └── memo.ts                 # TypeScript 타입 정의
│   ├── utils/
│   │   ├── storage.ts              # LocalStorage 유틸
│   │   ├── search.ts               # 검색 유틸 (debounce, filter)
│   │   └── ai.ts                   # AI API 호출 유틸
│   ├── App.tsx                     # 메인 앱 컴포넌트
│   ├── main.tsx                    # 엔트리 포인트
│   └── index.css                   # TailwindCSS 설정
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── postcss.config.js
├── .env.example                    # AI API 키 템플릿
└── README.md
```

### 4.2 데이터 모델
```typescript
interface Memo {
  id: string;                  // crypto.randomUUID()
  title: string;               // 메모 제목
  content: string;             // 메모 본문
  summary: string;             // AI 요약 (100자 이내)
  tags: string[];              // 태그 배열
  isPinned: boolean;           // 고정 여부
  createdAt: string;           // ISO 날짜 문자열
  updatedAt: string;           // ISO 날짜 문자열
}

interface AppState {
  memos: Memo[];               // 전체 메모 배열
  searchQuery: string;         // 현재 검색어
  selectedTags: string[];      // 선택된 필터 태그
  sortOrder: 'newest' | 'oldest'; // 정렬 기준
}
```

### 4.3 기술 스택 상세
```
- React 18: UI 컴포넌트
- TypeScript 5: 타입 안전성
- Vite 5: 빌드 도구 (빠른 HMR)
- TailwindCSS 3: 유틸리티 CSS
- lucide-react: 아이콘
- LocalStorage: 데이터 저장 (별도 백엔드 불필요)
- Claude API (선택): AI 태그/요약 (없어도 앱 완전 동작)
```

### 4.4 AI 기능 구현 방식
```
1. AI API 키가 없는 경우:
   - 태그 추천: 본문에서 키워드 추출 (단순 빈도 분석)
   - 요약: 본문 앞 100자 자르기
   → 앱은 AI 없이도 독립적으로 완전 동작

2. AI API 키가 있는 경우:
   - Claude API로 태그 추천 및 요약 생성
   - .env에 VITE_CLAUDE_API_KEY 설정
```

## 5. UI/UX 설계

### 5.1 색상 팔레트
```
- Primary: #6366F1 (Indigo-500)
- Primary Hover: #4F46E5 (Indigo-600)
- Background: #F8FAFC (Slate-50)
- Card: #FFFFFF
- Text Primary: #1E293B (Slate-800)
- Text Secondary: #64748B (Slate-500)
- Border: #E2E8F0 (Slate-200)
- Tag Colors: Indigo, Emerald, Amber, Rose, Sky (각 태그별 랜덤 배정)
- Danger: #EF4444 (Red-500)
```

### 5.2 레이아웃
```
┌──────────────────────────────────────────────┐
│  🧠 SmartMemo          [🔍 검색바]    [+ 새 메모] │
├──────────┬───────────────────────────────────┤
│          │                                   │
│  태그     │   메모 카드    메모 카드    메모 카드  │
│  필터     │                                   │
│          │   메모 카드    메모 카드    메모 카드  │
│  #업무    │                                   │
│  #아이디어 │                                   │
│  #개인    │                                   │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

### 5.3 인터랙션
```
- 메모 카드 hover: 그림자 깊어짐 + 살짝 위로 올라감 (translateY -2px)
- 새 메모 버튼: 모달 오버레이로 에디터 열림
- 태그 클릭: 즉시 필터링 (토글 방식)
- 삭제: 슬라이드 아웃 애니메이션 후 제거
- 검색: 실시간 하이라이트
```

## 6. 구현 순서 (Claude Code 실행 순서)

```
Step 1: 프로젝트 초기화
  → Vite + React + TypeScript 프로젝트 생성
  → TailwindCSS, lucide-react 설치 및 설정

Step 2: 타입 정의 및 유틸리티
  → types/memo.ts 작성
  → utils/storage.ts 작성 (LocalStorage CRUD)
  → utils/search.ts 작성 (검색/필터 로직)

Step 3: 커스텀 훅 구현
  → hooks/useMemos.ts (메모 상태 관리)
  → hooks/useSearch.ts (검색 디바운스)
  → hooks/useAI.ts (AI 기능 - 폴백 포함)

Step 4: UI 컴포넌트 구현
  → frontend design skill 을 사용해서 디자인해줘.
  → Layout.tsx, SearchBar.tsx, TagFilter.tsx
  → MemoCard.tsx, MemoList.tsx
  → MemoEditor.tsx, ConfirmDialog.tsx, TagBadge.tsx

Step 5: App.tsx 통합 및 스타일링
  → 전체 조합 및 반응형 처리
  → 다크모드/라이트모드 (선택)

Step 6: 테스트 및 빌드
  → npm run dev 로 로컬 확인
  → npm run build 로 프로덕션 빌드
```

## 7. 배포 가이드

```bash
# Vercel CLI로 배포
npm i -g vercel
vercel --prod

# 또는 GitHub 연동 후 자동 배포
# vercel.com에서 GitHub repo import → 자동 빌드/배포
```

## 8. 성공 기준

| 평가 항목 | 목표 점수 | 달성 방법 |
|-----------|----------|----------|
| 프로젝트 정의 문서 | 15/15 | 본 문서 (PROJECT.md) |
| AI 컨텍스트 파일 | 10/10 | .ai-context.md 파일 |
| 진행 기록 | 10/10 | PROGRESS.md 파일 |
| 아키텍처 설계 | 10/10 | 컴포넌트 구조 + 데이터 모델 명확 |
| 코드 품질 | 8/8 | TypeScript + 커스텀 훅 + 관심사 분리 |
| 기술 스택 활용 | 7/7 | React+TS+Vite+Tailwind 모범 활용 |
| 동작 완성도 | 12/12 | CRUD + 검색 + 필터 완전 동작 |
| 사용자 경험 | 8/8 | 직관적 UI + 애니메이션 + 피드백 |
| 반응형/접근성 | 5/5 | 모바일/태블릿/데스크톱 대응 |
| 문제 정의 | 7/7 | 명확한 문제-솔루션 정의 |
| 차별성/실용성 | 8/8 | AI 태그/요약의 실용적 가치 |
