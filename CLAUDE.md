# CLAUDE.md

이 파일은 Claude Code(및 코딩 에이전트)가 **새싹당** 저장소에서 작업할 때 참고하는 가이드다.

> **진실의 원천**: 상세 규칙은 [`AGENTS.md`](./AGENTS.md)에 있다. 충돌 시 AGENTS.md를 따른다. 이 문서는 빠른 참조용 요약이다.

---

## 프로젝트 한 줄

새싹 수강생 전용 · 비플페이 되는 캠퍼스 근처 맛집 지도/리뷰/AI 추천 서비스.
핵심 성공 기준: **"비플페이 되고 지금 다녀올 수 있는 집을 3초 안에 찾기"**.

## 스택

- **프론트**: Next.js (npm) + 카카오맵 SDK → Vercel
- **백엔드**: FastAPI (Python 3.12, Poetry/`.venv`) → Railway
- **AI**: LangChain + gpt-5.4-mini (RAG 보류)
- **DB**: PostgreSQL + SQLAlchemy + Alembic → Railway
- **외부 API**: 카카오맵 (좌표·거리·길찾기)

## 자주 쓰는 명령어

```bash
# 백엔드 (Poetry)
poetry install
poetry add <pkg>                 # 패키지 추가는 항상 이걸로 (pip install 금지)
poetry run uvicorn app.main:app --reload
poetry run pytest
poetry run ruff check . && poetry run black .
poetry run alembic upgrade head

# 백엔드 (Anaconda 사용 시 — conda는 파이썬 버전만, 패키지는 Poetry)
conda create -n saessakdang python=3.12 && conda activate saessakdang
poetry config virtualenvs.create false
poetry install

# 프론트 (npm — yarn 금지)
npm install
npm run dev
npm run lint
```

## 반드시 지킬 규칙

- **패키지**: 백엔드는 `poetry add`(pip·conda install 금지, `pyproject.toml`이 유일 기준). 프론트는 npm(yarn 금지).
- **역할 분리**: 결제·거리·좌석 같은 **사실은 규칙(FastAPI)**, **"왜 나에게 맞는가"만 LLM**. AI가 죽어도 지도·필터·리뷰는 살아야 한다(Fallback 필수).
- **AI 응답**: LangChain `with_structured_output` + Pydantic으로 JSON 스키마 강제. DB 1차 필터 후에만 LLM 호출. 결과엔 `*AI 추정*` / `AI 요약` 라벨 고정.
- **비플페이**: `beplpay_checked_at` 필수. 30일 초과 시 "최근 확인 안 됨" 강등 표시(숨기지 않음).
- **보안**: LLM에 개인 식별정보 전송 금지(익명 user_id·집계 태그만). 실시간 위치 미수집(캠퍼스 고정 좌표). 리뷰 작성자는 기수 단위로만 노출. 어드민은 RBAC.
- **프론트 레이아웃**: flex·gap 위주. `absolute`·`margin`은 꼭 필요한 곳만. 간격은 margin 대신 부모 `gap`.
- **enum/타입**: `signal`(green|yellow|red), `seat_class`(small|mid|large), `label`(AI_ESTIMATE|AI_SUMMARY), `confidence`(low|mid|high) 고정. 별점 float(1.0~5.0), 날짜 ISO 8601, 금액 int(원).

## 우선순위

기본기(지도·데이터·리뷰) 먼저, AI는 그 위에 얹는다.
P0: 비플페이 지도/리스트 · 식당 상세 · 별점+태그 리뷰 · 로그인 · 씨앗 데이터 20~30곳 · 어드민(등록/확인일).
P1: 세이프존 필터 · 인원 뱃지 · LLM 추천+예상 별점 · 리뷰 자동 요약.
P2(범위 제외): 사진 · 밥친구 매칭 · 기수 랭킹 · 협업 필터링 · 날씨 모드.

## 관련 문서

- `AGENTS.md` — 전체 개발 규칙(진실의 원천)
- `전략기획서(PRD).md` — 제품 정의·UX·비즈니스·시스템 분석
- `기술스택.md` — 스택 확정·아키텍처·DB·API 초안
