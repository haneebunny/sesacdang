# AGENTS.md — 새싹당

새싹 수강생 전용 · 비플페이 되는 캠퍼스 근처 맛집 지도/리뷰/AI 추천 서비스.
이 문서는 코딩 에이전트가 이 저장소에서 작업할 때 따라야 할 규칙을 정의한다.

---

## 1. 프로젝트 개요

**한 줄 정의**: 새싹 수강생이 비플페이 되는 근처 식당을 지도에서 찾고, 별점·리뷰를 남기고, AI가 취향·상황에 맞는 식당과 예상 별점을 추천하는 폐쇄형 로컬 맛집 서비스.

**핵심 성공 기준**: "비플페이 되고 지금 다녀올 수 있는 집을 3초 안에 찾기"가 작동하는 것.

- **캠퍼스 기준점**: 서울 양천구 목동서로 339 (양천보건소 부근). 실시간 개인 위치는 수집하지 않고 이 고정 좌표로 거리를 계산한다.
- **개발 기간**: 4일 (P0 → P1 순차).
- **설계 원칙**: 비전공자 팔로우업 가능 · 단일 서비스 · AI는 "프롬프트 + JSON 응답"으로 단순화.

작업 판단 기준: 모든 화면·기능은 "사용자가 점심 결정을 얼마나 빠르고 확신 있게 내리게 하는가"로 평가한다.

---

## 2. 기술 스택 (확정)

| 계층 | 기술 | 배포 |
|---|---|---|
| 프론트엔드 | Next.js (npm) + 카카오맵 SDK | Vercel |
| 백엔드 | FastAPI (Python 3.11, Poetry/`.venv`) | Railway |
| AI | LangChain + gpt-5.4-mini (RAG 보류) | 백엔드 내장 |
| DB | PostgreSQL + SQLAlchemy + Alembic | Railway |
| 외부 API | 카카오맵 API (좌표·거리·길찾기) | — |

**미확정 (진행하며 결정)**: RAG 도입 여부, PostGIS 확장(초기 미사용), 태그 저장 방식(MVP는 ARRAY, 확장 시 태그 테이블).

---

## 3. 개발 환경 & 명령어

### 백엔드 (FastAPI)

- **Python 3.11** 사용.
- **패키지 관리는 Poetry로 통일한다.** `pyproject.toml` / `poetry.lock`이 유일한 진실의 원천(single source of truth)이다.
- `pip install`을 직접 쓰지 말 것. `requirements.txt` 병행 금지.
- 가상환경은 프로젝트 루트 `.venv`에 고정한다. (Anaconda를 쓰는 경우 conda 환경을 별도로 만들고 그 안에서 Poetry로 의존성을 관리한다 — 아래 참고.)

```bash
# 최초 1회
poetry config virtualenvs.in-project true

# 의존성 추가는 항상 poetry 로
poetry add fastapi uvicorn langchain langchain-openai sqlalchemy alembic psycopg2-binary pydantic-settings
poetry add --group dev ruff black pytest

# 실행 / 테스트 / 린트
poetry run uvicorn app.main:app --reload
poetry run pytest
poetry run ruff check .
poetry run black .

# 마이그레이션
poetry run alembic revision --autogenerate -m "message"
poetry run alembic upgrade head
```

#### Anaconda(conda)로 개발하는 경우

Poetry가 표준이지만, Anaconda/Miniconda 환경에서도 작업할 수 있다. 이 경우 **conda는 Python 인터프리터(3.11) 제공용으로만 쓰고, 의존성은 여전히 Poetry로 관리한다.** `conda install`로 프로젝트 패키지를 넣지 말 것 — `pyproject.toml`이 유일한 기준이라는 원칙은 동일하다.

```bash
# Python 3.11 conda 환경 생성 및 활성화
conda create -n saessakdang python=3.11
conda activate saessakdang

# conda 환경 안에서는 in-project .venv 대신 conda 환경을 그대로 사용
poetry config virtualenvs.create false   # 이 프로젝트 한정 권장
poetry install                            # pyproject.toml 기준으로 의존성 설치

# 이후 실행은 poetry run 또는 활성화된 conda 환경에서 직접
uvicorn app.main:app --reload
```

> 규칙 요약: **conda = 파이썬 버전 관리, Poetry = 패키지 관리.** 어느 방식을 쓰든 새 패키지는 `poetry add`로만 추가한다.

### 프론트엔드 (Next.js)

- **패키지 매니저는 npm으로 통일한다. yarn 사용 금지.**

```bash
npm install
npm run dev
npm run build
npm run lint
```

---

## 4. 협업 / Git 규칙 (항상 지킬 것)

> 이 규칙은 **코드를 커밋·푸시할 때마다 항상 적용**된다. 기능 종류와 상관없이 예외 없이 따른다.
> 4일 순차 개발(P0 → P1)과 비전공자 팔로우업을 안전하게 유지하기 위한 규칙이다.

### 브랜치 전략

- **`main`**: 배포·최종 완성본 브랜치. **직접 커밋/푸시 절대 금지.** (Vercel·Railway 배포 기준 브랜치)
- **`feature/...`**: 기능 개발용 독립 브랜치. 모든 작업은 여기서 하고, PR을 거쳐 `main`에 합친다.
- **브랜치 생성 필수**: 새로운 개발 작업을 처음 시작할 때는 무조건 브랜치를 새로 따고 시작한다.
- **단계별 브랜치 순환**: 한 단계(P0 → P1의 각 기능)를 진행할 때마다 새로운 브랜치를 사용하며, 다음 단계 브랜치를 따기 전 기존 브랜치의 작업물은 반드시 **조장의 허락을 받아 원격 push 및 PR(Pull Request)까지 완료**해 둔다.
- 새 작업 시작 전 항상 최신 `main`을 받은 상태에서 브랜치를 판다.

  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/fe-map   # 새 브랜치 만들고 이동
  ```

### 브랜치 이름 규칙

형식: `접두어/파트-작업내용` (소문자, 단어 구분은 하이픈 `-`)

| 용도 | 형식 | 예시 (새싹당 기능 기준) |
|---|---|---|
| 프론트 기능 | `feature/fe-기능명` | `feature/fe-login`, `feature/fe-map`, `feature/fe-restaurant-detail`, `feature/fe-review-form`, `feature/fe-ai-search` |
| 백엔드 기능 | `feature/be-기능명` | `feature/be-db-setup`, `feature/be-auth`, `feature/be-restaurant-api`, `feature/be-review-api`, `feature/be-route-calc`, `feature/be-ai-recommend` |
| 버그 수정 | `fix/fe-버그명` / `fix/be-버그명` | `fix/be-signal-calc`, `fix/fe-map-pin`, `fix/be-ai-json-parse` |

> 팁: P0/P1 우선순위(11장)와 API 엔드포인트(9장) 이름에 맞춰 브랜치명을 지으면 작업 추적이 쉽다. (예: `POST /ai/recommend` → `feature/be-ai-recommend`)

### 커밋 컨벤션

형식: `Type: 요약` (요약은 한글 가능). 제목만 보고 무슨 변화인지 알 수 있게 쓴다.

| 타입 | 설명 |
|---|---|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 (README, 가이드 등) |
| `style` | 포맷팅·세미콜론 등 (로직 변경 없음) |
| `refactor` | 기능 변화 없는 구조 개선 |
| `chore` | 빌드·패키지 설정·`.gitignore` 등 |

예: `feat: 비플페이 필터 지도 UI 구현` / `fix: 신호등 계산 로직 잔여시간 비교 오류 수정` / `feat: /ai/recommend 자연어 추천 엔드포인트 추가`

### 커밋 & 푸시 & PR 흐름

```bash
git status              # 변경 파일 확인
git add .
git commit -m "feat: 비플페이 필터 지도 UI 구현"
git push origin feature/fe-map   # 내 브랜치로 푸시 (main 아님!)
```

그다음 GitHub에서 `Compare & pull request` → 리뷰어에 **`haneebunny`** 지정 → 아래 템플릿에 맞추어 **작업 내용 요약(PR 메시지) 작성** → `Create pull request` → **조장에게 알린다.**

#### 📝 PR 메시지 표준 템플릿
PR을 생성할 때는 반드시 다음 구조의 한국어 템플릿을 사용하여 작성한다.

```markdown
🖥️ 구현한 화면 목록
- [화면명] ([경로]): [설명 및 제공 기능]
  - 예: 식당 상세 페이지 (/restaurants/[id]): 식당 메타 정보, AI 추정 별점, 리뷰 목록, 메뉴 리스트 제공.

✨ 주요 변경 사항
- [변경 항목명]: [상세 구현 내용과 해결 접근 방식]
  - 예: LocalStorage 연동: restaurantsData.js 모듈을 도입하여 새로고침이나 페이지 이동 간에도 추가/삭제된 리뷰 데이터가 유기적으로 보존 및 연동되게 구성했습니다.

🧪 테스트한 내용
- [수행한 테스트 명령어 및 결과 요약]
  - 예: `npm run lint` && `npm run build` 테스트를 통과했습니다.
  - 예: 브라우저 서브에이전트(Playwright)를 구동해 홈 화면 ➡️ AI 검색 ➡️ 상세 ➡️ 리뷰 작성 ➡️ 마이페이지 데이터 갱신 및 삭제의 풀 시나리오가 에러 없이 작동함을 검증했습니다.

⚠️ 남아 있는 문제 및 주의사항
- [현재 제약 사항, 향후 API 연동 필요 항목, 특이사항 등]
  - 예: LocalStorage Mocking: 현재 백엔드 API 연동 전으로 로컬 저장소에 Mock 데이터를 가공해 쓰고 있습니다. 추후 FastAPI API 구현이 완료되면 DB 연동 API로 호출을 마이그레이션해야 합니다.

📁 참고한 design_reference 파일
- [참고 및 분석한 원본 HTML/디자인 파일 경로]
  - 예: frontend/design_reference/detail.html (식당 상세)
```

### ⚠️ 필수 주의사항

- 🚫 **`main`에 직접 푸시 절대 금지.** 반드시 `feature/` 브랜치 → PR → merge 경로만 사용한다.
- 📦 **의존성 추가 시 lock 파일을 반드시 커밋에 포함한다.** (3장 패키지 관리 규칙과 정합)
  - 프론트(npm): `package.json` + `package-lock.json`
  - 백엔드(Poetry): `pyproject.toml` + `poetry.lock` (`poetry add`로만 추가)
  - (아나콘다 사용자는 pull 받은 뒤 추가된 패키지를 수동 설치해야 한다.)
- 🔑 **비밀키·API 키(카카오맵·OpenAI 등)는 절대 커밋 금지.** `.env`는 `.gitignore`에 넣고 `.env.example`만 공유한다. (10장 보안 규칙과 정합)
- 📝 **`PROGRESS.md` 및 `DEVELOPMENT_LOG.md` 업데이트**: 매 작업 완료 시, 루트의 `PROGRESS.md`에 기능/버그 상태를 업데이트하고, `DEVELOPMENT_LOG.md`에 상세 개발 내역(작업 내용, 수정 파일, 테스트 결과 등)을 누적 기록하여 개발 로그를 유지한다.

---

## 5. 아키텍처 & 역할 분리

```
[Next.js · Vercel]  지도/리스트 · 상세 · 리뷰 폼 · AI 검색창 · 어드민 (카카오맵 SDK)
        │  REST API (JSON) / HTTPS
        ▼
[FastAPI · Railway]  인증 · 식당/리뷰/유저 CRUD · 소요시간·신호등 계산 · LangChain AI 오케스트레이션 · 어드민(RBAC)
        ├─▶ [PostgreSQL]  식당 / 리뷰 / 유저 / 취향프로필
        ├─▶ [카카오맵 API]  좌표 · 거리 · 길찾기
        └─▶ [gpt-5.4-mini via LangChain]  추천 · 예상 별점 · 리뷰 요약
```

**역할 분리 원칙 (가장 중요)**: 결제·거리·좌석 같은 **사실은 규칙(FastAPI)** 이 계산하고, **"왜 나에게 맞는가"만 LLM** 이 담당한다. AI가 죽어도 지도·필터·리뷰는 살아야 한다.

- 벡터DB·파인튜닝 등 무거운 구성은 배제한다.
- 사실 계산(거리·신호등·좌석 규모)을 LLM에 맡기지 말 것.

---

## 6. 코드 컨벤션

- **백엔드**: Python 3.11, `ruff` + `black`로 포맷/린트. Pydantic으로 요청·응답 검증. SQLAlchemy ORM 사용, 원시 SQL 지양.
- **프론트**: Next.js 관례 준수, `npm run lint` 통과 필수.
- **프론트 레이아웃**: 레이아웃은 **flex와 gap 위주로** 짠다. `position: absolute`와 `margin`은 최대한 쓰지 말고 꼭 필요한 곳에만 쓴다. 요소 간 간격은 `margin` 대신 부모의 `gap`으로 처리한다.
- **enum 고정**: `signal`(green|yellow|red), `seat_class`(small|mid|large), `label`(AI_ESTIMATE|AI_SUMMARY), `confidence`(low|mid|high)는 enum으로 고정한다.
- **타입 규약**: 별점은 float(1.0~5.0), 날짜는 ISO 8601(date), 금액은 int(원).
- **Pydantic 스키마 공유**: API 검증 스키마와 LangChain structured output 스키마를 공유한다.

---

## 7. 데이터 모델 (핵심 테이블)

| 테이블 | 주요 컬럼 | 관계 |
|---|---|---|
| `users` | id, auth_type(도메인/초대코드), cohort(기수), taste_profile(JSONB) | 1 : N reviews |
| `restaurants` | id, name, category, lat, lng, price_level, seat_class(small/mid/large), beplpay(bool), **beplpay_checked_at(date)** | 1 : N reviews |
| `reviews` | id, user_id(FK), restaurant_id(FK), rating(1~5), tags(array), comment, created_at | N : 1 |
| `restaurant_meta` | restaurant_id(FK), ai_summary, seat_hint, review_digest | 1 : 1 (AI 산출 캐시) |

- `taste_profile`는 가변 구조이므로 **JSONB**로 저장한다.
- MVP에서 `tags`는 PostgreSQL `ARRAY`로 단순화한다.
- **`beplpay_checked_at`는 필수 필드**다. 30일 초과 시 앱단에서 "최근 확인 안 됨"으로 강등 표시한다. (숨기지 않음)

---

## 8. 비즈니스 로직 (규칙 기반 — FastAPI가 직접 계산)

- **총 소요시간** = (도보 편도 × 2) + 음식 나오는 시간 + 식사 시간. 보행속도 ≈ **67m/분**.
- **음식 나오는 시간** = 카테고리 기본값(국밥·분식 5분 / 정식·구이 15분) + 리뷰 "빨리나옴" 태그 비율 보정.
- **식사 시간** = 카테고리 기본값(분식 15분 · 카페 30분) + 사용자 조정.
- **웨이팅 가중치** = 점심 피크(12:00~13:00) 대기 가중치 옵션.
- **신호등 판정** = 총 소요 ≤ 잔여시간 → 🟢 / 근접 → 🟡 / 초과 → 🔴.
- **좌석 규모** = 소(1~2)/중(3~4)/대(5인+). 소스: 등록 입력 + 리뷰 태그 비율.
- **비플페이 신뢰** = "확인 날짜" 기반. 오래되면 "최근 확인 안 됨" 표시.

---

## 9. AI 파이프라인 (LangChain)

gpt-5.4-mini를 세 태스크에 사용한다. 모두 **백엔드가 컨텍스트 조립 → 프롬프트 호출 → JSON 응답 파싱 → 프론트 전달** 구조로 통일한다.

1. **자연어 추천** — DB로 1차 필터한 소수 후보 위에서만 랭킹·추천 이유 생성.
2. **예상 별점** — 안 가본 집에 대해 취향 프로필 + 타인 리뷰 요약으로 예상 별점(1.0~5.0, 소수 1자리) + 근거 1줄.
3. **리뷰 요약·태그 추출** — 리뷰가 임계치(예: 3건) 이상 쌓이면 한 문단 요약 + 표준 태그 분류.

**규칙**:

- **Structured Output 강제**: LangChain `with_structured_output` + Pydantic 스키마로 JSON 스키마에 고정.
- **DB 1차 필터 후 LLM**: 비플페이·거리·좌석·영업 조건으로 후보를 압축한 뒤에만 LLM을 호출한다 (환각·비용 억제).
- **AI 결과에는 항상 라벨 고정**: 추천/예상 별점은 `*AI 추정*`, 요약은 `AI 요약`. 실제 별점과 분리 표기한다.

### Fallback (필수 — 서비스 핵심은 항상 작동해야 함)

| 상황 | Fallback |
|---|---|
| LLM 지연/타임아웃 | 규칙 기반 정렬(거리순·별점순)로 즉시 대체 |
| JSON 파싱 실패 | 재시도 1회 → 실패 시 규칙 기반 결과 노출, AI 카드 숨김 |
| 예상 별점 근거 부족(리뷰 0건) | "데이터 부족" 표기, 별점 미출력 |
| 리뷰 임계치 미달(3건 미만) | AI 요약 생략, 원문 리뷰만 노출 |
| 카카오맵 API 실패 | 캐시된 좌표·거리 사용, 길찾기는 외부 앱 링크 우회 |
| 검색 결과 0개 | 조건 완화 안내 버튼 노출 |

---

## 10. API 엔드포인트 (초안)

| 메서드 | 경로 | 설명 | AI |
|---|---|---|---|
| POST | `/auth/login` | 도메인/초대코드 인증 | — |
| GET | `/restaurants` | 식당 목록(필터: 비플페이·거리·좌석·영업) | — |
| GET | `/restaurants/{id}` | 식당 상세 | — |
| POST | `/restaurants/{id}/reviews` | 리뷰 등록(별점+태그+한줄평) | — |
| GET | `/restaurants/{id}/route` | 도보 거리·총소요·신호등 | 규칙+카카오맵 |
| POST | `/ai/recommend` | 자연어 추천 (태스크 1) | ✅ |
| GET | `/restaurants/{id}/predicted-rating` | 예상 별점 (태스크 2) | ✅ |
| POST | `/admin/restaurants` | 씨앗 등록·확인일 갱신 | — |

---

## 11. 보안 규칙

- **최소 수집**: 인증에 필요한 최소 식별 정보(도메인 이메일 또는 초대코드)만 동의 후 저장.
- **실시간 위치 미수집**: 개인 GPS를 받지 않고 캠퍼스 고정 기준점으로 거리 계산.
- **폐쇄형 접근 통제**: 인증된 수강생만 조회·작성 가능. 리뷰 작성자는 기수 단위("같은 수업 N명")로만 노출.
- **AI 데이터 취급**: LLM 호출 시 개인 식별정보(이메일 등) 전송 금지. 익명 `user_id`·집계된 취향 태그만 전달.
- **입력 검증**: 서버측 검증(길이·금지어·인젝션 방지). LLM 프롬프트 인젝션 대비 사용자 입력과 시스템 지시를 분리한다.
- **권한 분리**: 어드민 기능은 관리자 역할(RBAC)로만 접근.
- **시크릿 관리**: 카카오맵·OpenAI 등 API 키와 DB 접속 정보는 `.env`로만 다루고 저장소에 커밋하지 않는다. (4장 Git 규칙과 정합)

---

## 12. 개발 우선순위 (MVP)

작업 시 우선순위를 지킨다. 기본기(지도·데이터·리뷰) 먼저, AI는 그 위에 얹는다.

- **🔴 P0**: 비플페이 필터 지도/리스트, 식당 상세, 별점+태그 리뷰, 수강생 로그인, 씨앗 데이터 20~30곳, 어드민(등록/확인일 갱신).
- **🟡 P1**: 총 소요시간·세이프존 필터, 인원 수용 뱃지·필터, LLM 자연어 추천+예상 별점, 리뷰 자동 요약·태그.
- **⚪ P2 (이번 범위 제외)**: 사진 업로드, 밥친구 매칭, 기수 랭킹, 협업 필터링, 날씨 모드, 알림.

**화면(총 6개 + 어드민)**: 진입/로그인 → 홈(지도+리스트) → 결과 목록 → 식당 상세 → 리뷰 작성 → AI 검색/추천 → 내 페이지 / 어드민.

**4일 로드맵**: 1일차(DB 설계·카카오맵 연동·리스트/상세·도보 N분) → 2일차(리뷰·로그인·씨앗 데이터·인원 뱃지) → 3일차(AI 모듈·필터/정렬·세이프존) → 4일차(UI 다듬기·버그·시연). 각 단계 완료 시 브랜치를 PR로 마감한다(4장).

---

## 13. 표현·라벨 원칙 (UI 카피)

- 결론(신호등 / O·X)을 먼저, 숫자는 뒤에 둔다.
- "새싹에서·우리" 맥락 언어를 쓴다.
- 비플페이는 확인 기반("비플페이 O · 2026-07 팀 확인"), AI는 추정 라벨("`*AI 추정*`")로 고정한다.
- 좌석은 "👥 4인석 있음 / 단체 가능 / 좌석 빠듯" 같은 상황 언어로 표현한다.

---

## 14. 작업 시 체크리스트

- [ ] 새 작업을 최신 `main`에서 딴 `feature/` 브랜치에서 시작했는가? (`main` 직접 푸시 금지)
- [ ] 브랜치명·커밋이 규칙(`feature/fe-…` · `Type: 요약`)을 따르는가?
- [ ] 의존성 추가 시 lock 파일(`package-lock.json` / `poetry.lock`)을 함께 커밋했는가?
- [ ] API 키·`.env` 등 시크릿을 커밋에 넣지 않았는가?
- [ ] PR 리뷰어를 `haneebunny`로 지정하고 조장에게 알렸는가?
- [ ] 백엔드 패키지 추가는 `poetry add`로 했는가? (`pip install` 금지)
- [ ] 프론트 패키지는 npm으로 설치했는가? (yarn 금지)
- [ ] 프론트 레이아웃을 flex·gap 위주로 짰는가? (absolute·margin 최소화)
- [ ] (conda 사용 시) 패키지를 `conda install`이 아닌 `poetry add`로 넣었는가?
- [ ] 사실 계산(거리·신호등·좌석)을 규칙 기반으로 처리했는가? (LLM에 맡기지 않음)
- [ ] LLM 응답에 Pydantic structured output + Fallback을 적용했는가?
- [ ] AI 결과에 `*AI 추정*` / `AI 요약` 라벨을 붙였는가?
- [ ] `beplpay_checked_at`를 필수로 다루고 30일 만료 강등을 처리했는가?
- [ ] LLM 프롬프트에 개인 식별정보를 넣지 않았는가?
- [ ] `ruff`/`black`/`npm run lint`를 통과했는가?
- [ ] 작업을 완료하고 루트의 `PROGRESS.md`에 진행 상황을 기록하고, `DEVELOPMENT_LOG.md`에 개발 로그를 작성했는가?
