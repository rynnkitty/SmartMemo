# 🚀 Claude Code 실행 매뉴얼

> VS Code에서 Claude Code를 사용하여 SmartMemo 프로젝트를 구현하는 단계별 가이드입니다.

---

## 0. 사전 준비

### 필수 설치 항목
```bash
# Node.js (18 이상)
node --version   # v18.x.x 이상 확인

# npm
npm --version

# Claude Code VS Code 확장 설치
# VS Code → Extensions → "Claude Code" 검색 → 설치
```

### 작업 폴더 생성
```bash
mkdir smartmemo
cd smartmemo
```

---

## 1단계: 프로젝트 초기화

**Claude Code에 입력할 프롬프트:**

```
이 프로젝트 폴더에 Vite + React + TypeScript 프로젝트를 초기화해줘.

다음을 설정해줘:
1. npm create vite@latest . -- --template react-ts
2. npm install
3. npm install -D tailwindcss @tailwindcss/vite lucide-react
4. tailwind.config.js 생성 (content 경로 설정)
5. postcss.config.js 생성
6. src/index.css에 @tailwind base, components, utilities 추가
7. vite.config.ts에 tailwindcss 플러그인 추가

프로젝트 구조:
src/
  components/
  hooks/
  types/
  utils/

모든 빈 디렉토리도 만들어줘.
```

**확인 방법:**
```bash
npm run dev
# → http://localhost:5173 에서 기본 페이지 확인
```

---

## 2단계: 타입과 유틸리티 구현

**Claude Code에 입력할 프롬프트:**

```
PROJECT.md와 .ai-context.md를 읽고, 다음 파일들을 구현해줘:

1. src/types/memo.ts
   - Memo 인터페이스 (id, title, content, summary, tags, isPinned, createdAt, updatedAt)
   - AppState 인터페이스

2. src/utils/storage.ts
   - LocalStorage에 메모 배열을 저장/불러오기
   - 키: "smartmemo_data"
   - getMemos(), saveMemos(), 에러 핸들링 포함

3. src/utils/search.ts
   - 검색어로 메모 필터링 (제목 + 본문)
   - 태그 기반 필터링 (다중 태그 AND 조건)
   - 정렬 (최신순/오래된순)
   - debounce 유틸 함수

4. src/utils/ai.ts
   - AI API 키가 있으면 Claude API 호출
   - AI API 키가 없으면 폴백 로직:
     - 태그 추천: 본문에서 2글자 이상 단어 빈도 분석, 상위 3~5개
     - 요약: 본문 앞 100자 + "..."
   - generateTags(content: string): Promise<string[]>
   - generateSummary(content: string): Promise<string>
```

---

## 3단계: 커스텀 훅 구현

**Claude Code에 입력할 프롬프트:**

```
다음 커스텀 훅들을 구현해줘:

1. src/hooks/useMemos.ts
   - useState로 메모 배열 관리
   - addMemo, updateMemo, deleteMemo, togglePin 함수
   - useEffect로 LocalStorage 자동 동기화
   - 메모 추가/수정 시 AI 태그+요약 자동 생성

2. src/hooks/useSearch.ts
   - searchQuery 상태 관리
   - selectedTags 상태 관리
   - sortOrder 상태 관리
   - filteredMemos 계산 (useMemo 활용)
   - debounce 적용된 검색

3. src/hooks/useAI.ts
   - generateTags, generateSummary 래핑
   - loading 상태 관리
   - 에러 핸들링
```

---

## 4단계: UI 컴포넌트 구현

**Claude Code에 입력할 프롬프트:**

```
PROJECT.md의 UI/UX 설계 섹션을 참고하여 다음 컴포넌트들을 구현해줘.
TailwindCSS를 사용하고, 색상 팔레트는 PROJECT.md의 5.1 섹션을 따라줘.
lucide-react에서 아이콘을 사용해줘.

1. src/components/TagBadge.tsx
   - 태그 이름 표시, 색상은 태그명 해시 기반으로 5가지 중 선택
   - 클릭 이벤트 (필터용), 삭제 버튼 (에디터용)

2. src/components/SearchBar.tsx
   - 검색 아이콘 + 입력 필드
   - placeholder: "메모 검색..."
   - 입력 시 실시간 검색 (debounce 300ms)

3. src/components/TagFilter.tsx
   - 전체 태그 목록 표시
   - 각 태그 옆에 해당 태그의 메모 개수
   - 클릭 시 필터 토글

4. src/components/MemoCard.tsx
   - 카드 디자인: 흰 배경, 둥근 모서리, 그림자
   - 제목, 요약, 태그 목록, 날짜 표시
   - hover 시 그림자 + translateY 애니메이션
   - 고정(pin) 아이콘, 편집/삭제 버튼
   - 고정된 메모는 테두리 강조

5. src/components/MemoList.tsx
   - MemoCard를 그리드로 배치
   - 반응형: lg:3열, md:2열, sm:1열
   - 메모 없을 때 빈 상태 메시지

6. src/components/MemoEditor.tsx
   - 모달 오버레이
   - 제목 입력, 본문 textarea
   - 태그 입력 (콤마로 구분 + Enter)
   - AI 태그 추천 버튼 (로딩 스피너)
   - 저장/취소 버튼

7. src/components/ConfirmDialog.tsx
   - 모달 오버레이
   - "정말 삭제하시겠습니까?" 메시지
   - 확인/취소 버튼

8. src/components/Layout.tsx
   - 헤더: 로고(🧠 SmartMemo), 검색바, 새메모 버튼
   - 사이드바: 태그 필터 (모바일에서 숨김/토글)
   - 메인: children 렌더
```

---

## 5단계: App 통합 및 완성

**Claude Code에 입력할 프롬프트:**

```
모든 컴포넌트와 훅을 조합하여 src/App.tsx를 완성해줘.

요구사항:
1. useMemos, useSearch 훅으로 전체 상태 관리
2. Layout 안에 MemoList 배치
3. 새 메모 버튼 → MemoEditor 모달 열기
4. 메모 카드 클릭 → 편집 모드로 MemoEditor 열기
5. 삭제 → ConfirmDialog → 실제 삭제
6. 검색/필터/정렬 모두 동작
7. 접근성: aria-label, role, 키보드 탐색 (Escape로 모달 닫기)
8. 반응형 완벽 동작 확인

그리고 src/index.css에 TailwindCSS 기본 설정과 추가 커스텀 스타일을 넣어줘:
- 스크롤바 스타일링
- 모달 오버레이 배경
- 트랜지션 클래스
```

---

## 6단계: 테스트 및 빌드

**Claude Code에 입력할 프롬프트:**

```
다음을 확인하고 수정해줘:

1. npm run dev로 개발 서버 실행하여 동작 확인
2. TypeScript 에러가 없는지 tsc --noEmit 로 확인
3. npm run build로 프로덕션 빌드가 성공하는지 확인
4. 빌드 결과물(dist/)이 정상인지 확인

문제가 있으면 수정해줘.
```

---

## 7단계: 배포 (보너스 점수용)

**터미널에서 직접 실행:**

```bash
# Vercel CLI 설치 (최초 1회)
npm i -g vercel

# 배포
vercel --prod

# 또는 GitHub에 push 후 vercel.com에서 import
git init
git add .
git commit -m "SmartMemo v1.0"
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
# → vercel.com에서 Import Project → GitHub 선택 → 자동 배포
```

---

## 문제 해결 (FAQ)

### Q: TailwindCSS가 적용되지 않아요
```bash
# vite.config.ts에 tailwindcss 플러그인이 있는지 확인
# index.css에 @import "tailwindcss" 이 있는지 확인
```

### Q: LocalStorage 데이터가 사라져요
```
# 브라우저 개발자 도구 → Application → Local Storage 확인
# "smartmemo_data" 키가 있는지 확인
```

### Q: AI 기능이 동작하지 않아요
```
# .env 파일에 VITE_CLAUDE_API_KEY가 설정되어 있는지 확인
# API 키가 없으면 폴백 로직으로 동작 (정상)
```

### Q: 빌드 에러가 나요
```bash
# TypeScript 에러 확인
npx tsc --noEmit

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## PROGRESS.md 업데이트 안내

각 단계를 완료할 때마다 Claude Code에게 다음과 같이 요청하세요:

```
PROGRESS.md에서 Phase X의 체크박스를 완료로 업데이트해줘.
완료 시간과 특이사항도 기록해줘.
```

이렇게 하면 진행 기록 점수(10점)를 확보할 수 있습니다.
