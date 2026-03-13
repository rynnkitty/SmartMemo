# 🧠 SmartMemo — AI 스마트 메모 앱

> 메모를 작성하면 AI가 자동으로 태그를 추천하고 요약을 생성하는 로컬 메모 앱.
> Claude API 없이도 폴백 로직으로 **완전하게 동작**합니다.

![CI](https://github.com/rynnkitty/SmartMemo/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/rynnkitty/SmartMemo/actions/workflows/deploy.yml/badge.svg)

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 📝 메모 CRUD | 생성 · 수정 · 삭제 (확인 다이얼로그 + 슬라이드 아웃 애니메이션) |
| 🤖 AI 자동 태그 | 본문 분석 → 태그 3~5개 자동 추천 (폴백: 키워드 빈도 분석) |
| 📄 AI 자동 요약 | 100자 이내 요약 카드 미리보기 (폴백: 앞 100자) |
| 🔍 실시간 검색 | 제목 + 본문 debounce 300ms 검색 |
| 🏷️ 태그 필터 | 다중 태그 AND 조건 필터링 |
| 📌 메모 고정 | 중요한 메모를 목록 최상단에 고정 |
| 📱 반응형 | 모바일(1열) · 태블릿(2열) · 데스크톱(3열) |
| 💾 오프라인 | LocalStorage 저장 — 인터넷 없이도 동작 |

---

## 🛠 기술 스택

| 레이어 | 기술 | 버전 |
|--------|------|------|
| UI | React | 19 |
| 언어 | TypeScript | 5.6 |
| 빌드 | Vite | 6 |
| 스타일 | TailwindCSS | v4 |
| 아이콘 | lucide-react | 최신 |
| 저장 | LocalStorage | 브라우저 내장 |
| AI (선택) | Claude API | claude-sonnet-4-20250514 |
| 테스트 | Vitest + Testing Library | 4 |

---

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (http://localhost:5173)
npm run dev

# 3. 프로덕션 빌드
npm run build
```

---

## 🤖 AI 기능 설정 (선택)

```bash
cp .env.example .env
```

`.env` 파일에 Claude API 키를 입력하세요:

```env
VITE_CLAUDE_API_KEY=sk-ant-...
```

> API 키가 없어도 앱은 완전히 동작합니다.
> - 태그: 본문 단어 빈도 분석 → 상위 5개
> - 요약: 본문 앞 100자 자동 사용

---

## 🧪 테스트

```bash
npm run test        # 단위 테스트 실행 (44개)
npm run coverage    # 커버리지 리포트 생성
```

| 테스트 파일 | 테스트 수 | 대상 |
|------------|---------|------|
| `utils/storage.test.ts` | 5개 | LocalStorage 읽기/쓰기, 에러 처리 |
| `utils/search.test.ts` | 10개 | 필터, 정렬, debounce |
| `utils/ai.test.ts` | 7개 | AI 폴백 로직 (태그 추출, 요약) |
| `hooks/useMemos.test.ts` | 9개 | 메모 CRUD, localStorage 동기화 |
| `hooks/useSearch.test.ts` | 9개 | 검색 debounce, 태그 필터, 정렬 |
| **합계** | **44개** | |

---

## 🔄 CI/CD

| 워크플로 | 트리거 | 단계 |
|---------|--------|------|
| **CI** (`ci.yml`) | push · PR | lint → type-check → test → build |
| **Deploy** (`deploy.yml`) | main push | build → GitHub Pages 자동 배포 |

> GitHub Pages 활성화: 레포 Settings → Pages → Source → **GitHub Actions** 선택

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Layout.tsx          # 헤더 + 사이드바 + 메인 레이아웃
│   ├── MemoCard.tsx        # 메모 카드 (hover 애니메이션, 삭제 슬라이드 아웃)
│   ├── MemoEditor.tsx      # 작성/편집 모달 (AI 태그 추천)
│   ├── MemoList.tsx        # 반응형 그리드 + 빈 상태 처리
│   ├── SearchBar.tsx       # 검색 입력
│   ├── TagBadge.tsx        # 해시 기반 5색 태그 뱃지
│   ├── TagFilter.tsx       # 태그별 메모 수 + 토글 필터
│   └── ConfirmDialog.tsx   # 삭제 확인 모달
├── hooks/
│   ├── useMemos.ts         # 메모 CRUD + LocalStorage 자동 동기화
│   ├── useSearch.ts        # debounce 검색 + 태그 필터 + 정렬
│   └── useAI.ts            # AI 태그/요약 + loading/error 상태
├── types/memo.ts           # Memo, AppState, SortOrder 타입
├── utils/
│   ├── storage.ts          # LocalStorage 읽기/쓰기
│   ├── search.ts           # 필터, 정렬, debounce 순수 함수
│   └── ai.ts               # Claude API 호출 + 폴백
└── App.tsx                 # 전체 상태 조합 + 모달 관리
```

---

## 📦 번들 구조

| 청크 | 크기 | 내용 |
|------|------|------|
| `vendor.js` | 4KB | react, react-dom |
| `icons.js` | 16KB | lucide-react |
| `index.js` | 201KB | 앱 코드 |
| `index.css` | 23KB | TailwindCSS |

> 청크 분리로 react/아이콘 라이브러리는 별도 캐싱 → 반복 방문 시 로드 속도 향상

---

## 📄 문서

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](./CLAUDE.md) | AI 컨텍스트 — 아키텍처, 설계 결정, 코딩 규칙 |
| [PROJECT.md](./PROJECT.md) | 프로젝트 정의서 — 기능 명세, UI 설계 |
| [PROGRESS.md](./PROGRESS.md) | 개발 진행 기록 — Phase별 완료 현황, 이슈 로그 |
| [MANUAL.md](./MANUAL.md) | Claude Code 실행 매뉴얼 |

---

## 📝 라이선스

MIT License
