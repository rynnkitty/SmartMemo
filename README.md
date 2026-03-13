# 🧠 SmartMemo - AI 스마트 메모 앱

> 메모를 작성하면 AI가 자동으로 태그를 추천하고, 요약을 생성하는 스마트 메모 앱

## ✨ 주요 기능

- **메모 CRUD**: 생성, 읽기, 수정, 삭제
- **AI 자동 태그**: 메모 내용 분석 후 태그 자동 추천
- **AI 자동 요약**: 긴 메모를 한 줄로 요약
- **실시간 검색**: 제목과 본문에서 즉시 검색
- **태그 필터**: 태그 기반 메모 분류 및 필터링
- **메모 고정**: 중요한 메모를 상단에 고정
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 대응
- **오프라인 동작**: LocalStorage 기반으로 인터넷 없이도 동작

## 🛠 기술 스택

| 기술 | 용도 |
|------|------|
| React 18 | UI 컴포넌트 |
| TypeScript 5 | 타입 안전성 |
| Vite 5 | 빌드 도구 |
| TailwindCSS 3 | 스타일링 |
| lucide-react | 아이콘 |
| LocalStorage | 데이터 저장 |
| Claude API (선택) | AI 태그/요약 |

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🤖 AI 기능 설정 (선택)

AI 기능을 사용하려면 `.env` 파일을 생성하고 Claude API 키를 설정하세요:

```bash
cp .env.example .env
# .env 파일에 VITE_CLAUDE_API_KEY=sk-ant-... 입력
```

> AI API 키가 없어도 앱은 완전하게 동작합니다. 태그는 키워드 빈도 분석, 요약은 본문 앞부분으로 대체됩니다.

## 📁 프로젝트 구조

```
smartmemo/
├── src/
│   ├── components/     # UI 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── types/          # TypeScript 타입
│   ├── utils/          # 유틸리티 함수
│   ├── App.tsx         # 메인 앱
│   └── main.tsx        # 엔트리 포인트
├── PROJECT.md          # 프로젝트 정의서
├── .ai-context.md      # AI 컨텍스트 파일
├── PROGRESS.md         # 개발 진행 기록
└── MANUAL.md           # Claude Code 실행 매뉴얼
```

## 📄 문서

| 문서 | 설명 |
|------|------|
| [PROJECT.md](./PROJECT.md) | 프로젝트 정의서 (기능 명세, 아키텍처, UI 설계) |
| [.ai-context.md](./.ai-context.md) | AI 어시스턴트용 컨텍스트 파일 |
| [PROGRESS.md](./PROGRESS.md) | 개발 진행 기록 |
| [MANUAL.md](./MANUAL.md) | Claude Code 실행 매뉴얼 |

## 📝 라이선스

MIT License
