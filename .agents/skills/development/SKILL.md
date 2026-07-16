---
name: saessakdang-dev
description: >-
  새싹당(비플페이 되는 캠퍼스 근처 맛집 지도/리뷰/AI 추천 서비스)의 개발을 보조하는 스킬.
  이 프로젝트의 기능 구현, API·DB 스키마 작성, LangChain AI 파이프라인(자연어 추천·예상 별점·리뷰 요약),
  비즈니스 로직(총 소요시간·신호등·좌석 규모 계산), 프론트(Next.js) 화면 작업 등에 사용한다.
  다음 상황에서 반드시 사용하세요:
  - "새싹당", "비플페이", "신호등", "세이프존", "예상 별점", "씨앗 데이터" 등 이 프로젝트 용어가 나올 때
  - FastAPI 백엔드 / Next.js 프론트 / PostgreSQL 스키마 / LangChain AI 태스크를 구현·수정할 때
  - 식당·리뷰·유저·취향 프로필 관련 CRUD나 집계 로직을 다룰 때
  - 이 저장소의 코드 컨벤션·패키지 관리(Poetry/npm)·배포(Vercel/Railway) 규칙을 확인해야 할 때
---

# 새싹당 개발 보조 스킬

새싹 수강생 전용 · 비플페이 되는 캠퍼스 근처 맛집 지도/리뷰/AI 추천 서비스를 개발할 때 이 스킬을 따른다.
**핵심 성공 기준**: "비플페이 되고 지금 다녀올 수 있는 집을 3초 안에 찾기"가 작동하는 것.

## 0. 작업 전 필독

이 저장소에는 `AGENTS.md`, `CLAUDE.md`, `전략기획서(PRD).md`, `기술스택.md`가 있다.
**상세 규칙의 진실의 원천은 `AGENTS.md`**다. 이 스킬과 충돌하면 `AGENTS.md`를 따른다.
새 작업을 시작하기 전 해당 기능의 우선순위(P0/P1/P2)와 관련 화면을 먼저 확인한다.

## 1. 스택과 환경 (반드시 준수)

- **백엔드**: FastAPI · Python 3.12. 패키지는 **`poetry add`로만** 추가한다. `pip install`·`conda install` 금지, `pyproject.toml`이 유일 기준. 가상환경은 `.venv`(또는 conda 환경 + `virtualenvs.create false`).
- **프론트**: Next.js. 패키지 매니저는 **npm**(yarn 금지).
- **DB**: PostgreSQL + SQLAlchemy + Alembic. 스키마 변경은 Alembic 마이그레이션으로.
- **AI**: LangChain + gpt-5.4-mini. RAG는 보류(초기 미사용).
- **배포**: 프론트 Vercel · 백엔드/DB Railway.

## 2. 아키텍처 원칙 — 사실은 규칙, "왜"만 LLM

가장 중요한 원칙이다. 코드를 짤 때 항상 지킨다.

- 결제(비플페이)·거리·소요시간·신호등·좌석 규모 같은 **사실은 FastAPI가 규칙 기반으로 직접 계산**한다. LLM에 맡기지 않는다.
- LLM은 **"왜 이 사람에게 맞는가"(추천 이유·예상 별점·리뷰 요약)만** 담당한다.
- **AI가 죽어도 지도·필터·리뷰는 살아야 한다.** 모든 AI 경로에는 Fallback을 붙인다.

## 3. 비즈니스 로직 계산식 (규칙 기반)

- **총 소요시간** = (도보 편도 × 2) + 음식 나오는 시간 + 식사 시간. 보행속도 ≈ **67m/분**.
- **음식 나오는 시간** = 카테고리 기본값(국밥·분식 5분 / 정식·구이 15분) + 리뷰 "빨리나옴" 태그 비율 보정.
- **식사 시간** = 카테고리 기본값(분식 15분 · 카페 30분) + 사용자 조정.
- **신호등** = 총 소요 ≤ 잔여시간 → 🟢 / 근접 → 🟡 / 초과 → 🔴.
- **좌석 규모** = 소(1~2)/중(3~4)/대(5인+). 소스: 등록 입력 + 리뷰 태그 비율.
- **비플페이 신뢰** = `beplpay_checked_at` 기반. 30일 초과 시 "최근 확인 안 됨" 강등(숨기지 않음).

## 4. AI 파이프라인 (LangChain)

세 태스크 모두 **백엔드가 컨텍스트 조립 → 프롬프트 → gpt-5.4-mini 호출 → JSON 파싱 → 프론트 전달** 구조로 통일한다.

1. **자연어 추천** — DB로 1차 필터한 소수 후보 위에서만 랭킹·추천 이유 생성.
2. **예상 별점** — 취향 프로필 + 타인 리뷰 요약으로 예상 별점(1.0~5.0, 소수 1자리) + 근거 1줄.
3. **리뷰 요약·태그 추출** — 리뷰 임계치(예: 3건) 이상이면 한 문단 요약 + 표준 태그 분류.

구현 규칙:

- **Structured Output 강제**: `with_structured_output` + Pydantic 스키마. Pydantic 스키마는 API 검증과 공유한다.
- **DB 1차 필터 후에만 LLM 호출** (환각·비용 억제).
- 결과에 라벨 고정: 추천/예상 별점 `AI_ESTIMATE`(UI: `*AI 추정*`), 요약 `AI_SUMMARY`(UI: `AI 요약`). 실제 별점과 분리 표기.

**Fallback (필수)**: LLM 지연/타임아웃 → 규칙 정렬(거리·별점순) 대체 / JSON 파싱 실패 → 재시도 1회 후 규칙 결과·AI 카드 숨김 / 리뷰 0건 → 예상 별점 미출력 / 리뷰 3건 미만 → 요약 생략 / 카카오맵 실패 → 캐시 좌표·외부 앱 링크 / 결과 0개 → 조건 완화 안내.

## 5. 데이터 모델

| 테이블 | 주요 컬럼 |
|---|---|
| `users` | id, auth_type, cohort, taste_profile(JSONB) |
| `restaurants` | id, name, category, lat, lng, price_level, seat_class(small/mid/large), beplpay(bool), **beplpay_checked_at(date)** |
| `reviews` | id, user_id(FK), restaurant_id(FK), rating(1~5), tags(array), comment, created_at |
| `restaurant_meta` | restaurant_id(FK), ai_summary, seat_hint, review_digest (AI 산출 캐시) |

- `taste_profile`는 JSONB, MVP에서 `tags`는 PostgreSQL `ARRAY`.
- enum 고정: `signal`(green|yellow|red), `seat_class`(small|mid|large), `label`(AI_ESTIMATE|AI_SUMMARY), `confidence`(low|mid|high).
- 별점 float(1.0~5.0), 날짜 ISO 8601(date), 금액 int(원).

## 6. API 엔드포인트 (초안)

`POST /auth/login` · `GET /restaurants` · `GET /restaurants/{id}` · `POST /restaurants/{id}/reviews` · `GET /restaurants/{id}/route`(규칙+카카오맵) · `POST /ai/recommend`(태스크1) · `GET /restaurants/{id}/predicted-rating`(태스크2) · `POST /admin/restaurants`.

## 7. 프론트(Next.js) 규칙

- 레이아웃은 **flex·gap 위주**. `position: absolute`·`margin`은 꼭 필요한 곳에만. 요소 간 간격은 부모의 `gap`으로.
- `npm run lint` 통과 필수. 카카오맵 SDK로 지도·핀 렌더.
- 공통 컴포넌트: 신호등 뱃지(🟢🟡🔴), 좌석 뱃지(👥소/중/대), 비플페이 확인일, AI 추정 라벨, 별점·태그 칩.
- 카피 원칙: 결론(신호등/O·X) 먼저·숫자는 뒤, "새싹에서·우리" 맥락 언어, 비플페이=확인 기반 / AI=추정 라벨.

## 8. 보안

- 최소 수집(도메인 이메일 또는 초대코드만). 실시간 위치 미수집(캠퍼스 고정 좌표).
- 폐쇄형 접근 통제: 인증된 수강생만. 작성자는 기수 단위("같은 수업 N명")로만 노출.
- LLM에 개인 식별정보 전송 금지 — 익명 user_id·집계 취향 태그만. 프롬프트 인젝션 대비 사용자 입력과 시스템 지시 분리.
- 어드민은 RBAC로만 접근.

## 9. 완료 전 체크리스트

- [ ] 백엔드 패키지를 `poetry add`로 넣었는가? (pip·conda install 금지)
- [ ] 프론트 패키지를 npm으로 넣었는가? (yarn 금지)
- [ ] 사실 계산(거리·신호등·좌석)을 규칙 기반으로 처리했는가? (LLM에 안 맡김)
- [ ] LLM 응답에 Pydantic structured output + Fallback을 적용했는가?
- [ ] AI 결과에 `AI_ESTIMATE`/`AI_SUMMARY` 라벨을 붙였는가?
- [ ] `beplpay_checked_at` 필수 처리 + 30일 만료 강등을 했는가?
- [ ] 프론트 레이아웃을 flex·gap 위주로 짰는가? (absolute·margin 최소화)
- [ ] LLM 프롬프트에 개인 식별정보를 넣지 않았는가?
- [ ] `ruff`/`black`/`npm run lint`를 통과했는가?
