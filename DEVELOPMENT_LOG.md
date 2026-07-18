# 📝 새싹당 개발 로그 (Development Log)

이 파일은 새싹당 프로젝트의 개발 작업이 진행될 때마다 작업 내역, 변경 사항, 테스트 결과 등을 상세히 기록하는 개발 로그입니다. 
코딩 에이전트(Antigravity)는 매번 작업을 완료한 후 이 로그에 작업 내용을 추가로 기록해야 합니다.

---

## 📅 개발 로그 기록 양식
새로운 로그를 작성할 때는 아래 양식을 복사하여 **최상단(가장 최근 로그가 위로 오도록)**에 추가합니다.

```markdown
### [YYYY-MM-DD] [작업 제목]
- **작업 브랜치**: `feature/...`
- **구현 기능 및 변경 사항**:
  - [ ] 주요 변경 사항 1
  - [ ] 주요 변경 사항 2
- **수정/생성 파일**:
  - `modify/new/delete` [파일명](링크)
- **테스트 결과 / 검증 내용**:
  - [ ] 테스트 명령어 및 수행 내용
- **특이사항 및 전달사항**:
  - 특이사항 기술
---
```

---

## 📂 개발 로그 이력

### 2026-07-18: 카테고리 필터 드롭다운 내부에 가격 및 정렬 필터 통합 & 가격 필터 기준 단순화
- **작업 브랜치**: `feature/fe-review-layout-fix`
- **구현 기능 및 변경 사항**:
  - [x] 홈 화면의 필터 칩 영역에서 독립적으로 나열되던 '가격' 버튼과 '거리순' 정렬 버튼 제거
  - [x] '카테고리' 드롭다운 메뉴 하단에 '정렬 및 필터' 섹션을 추가하여 '거리순/별점순 정렬' 및 '가격 필터' 통합 제어 구현
  - [x] 카테고리 버튼에 가격 필터나 정렬 기준이 켜진 경우, 활성화 색상 반영 및 뱃지(💰, ⭐ 등)로 현재 설정 상태 노출
  - [x] 부모 컨테이너의 `overflow-x-auto` 속성으로 인해 드롭다운 요소가 하단에 가려져 렌더링되지 않던 렌더링 버그 수정 (`overflow-visible` 변경 및 레이아웃 유지)
  - [x] 가격 필터 기준을 기존 3단계($, $$, $$$)에서 **'만원 이하' (under_10k)** 및 **'만원 초과' (over_10k)** 2단계로 단순화
  - [x] Mock 데이터베이스([restaurantsData.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/data/restaurantsData.js)), 홈 화면([page.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/page.js)), 식당 상세([restaurants/[id]/page.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/restaurants/[id]/page.js)), AI 검색([ai/page.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/ai/page.js))에 기준 변경 일괄 반영
  - [x] 상황 변경 모달 내 '취소' 버튼의 테두리 및 글자 색 대비 개선 (상단 비활성화 필터 칩과 동일한 `border-white/80`, `text-secondary`, `bg-white/40` 스타일로 통일하여 시인성 확보)
  - [x] 카테고리 드롭다운 기능 추가로 `useRef` 및 `useEffect`가 새로 쓰이게 되었으나, 롤백 과정에서 import 선언이 누락되어 발생한 `Runtime ReferenceError: useRef is not defined` 버그 수정 (import 구문 재복구)
  - [x] '지금 갈 수 있는 곳' 헤딩 우측의 **거리순 정렬 버튼** 제거 (정렬 기능은 카테고리 드롭다운 내 통합 유지)
  - [x] 홈 화면 우하단에 남아 있던 **AI 플로팅 버튼(FAB, `auto_awesome`)** 재확인 후 완전 제거 (바텀 네비게이션 '검색' 탭과 기능 중복)
- **수정/생성 파일**:
  - [MODIFY] [home.html](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/design_reference/home.html)
  - [MODIFY] [page.js (홈)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/page.js)
  - [MODIFY] [restaurantsData.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/data/restaurantsData.js)
  - [MODIFY] [page.js (식당상세)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/restaurants/[id]/page.js)
  - [MODIFY] [page.js (AI추천)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/ai/page.js)
- **테스트 결과 / 검증 내용**:
  - [x] `npm run lint` 검사 통과 (총 3회 — 드롭다운 통합 / 가격필터 변경 / FAB 제거 후 각각 수행)
  - [x] 로컬 개발 서버 실시간 반영 및 런타임 에러 해소 확인
- **특이사항 및 전달사항**:
  - 이번 통합 및 단순화로 홈 화면의 필터 영역이 더 미니멀해지고 모바일 가로 스크롤 범위가 정돈되었으며, 가격 구분 기준이 원화(만원) 직관성 기준으로 개선되었습니다.
  - AI 플로팅 버튼은 제거되었으나 `/ai` 페이지 자체는 유지되며, 바텀 네비게이션 '검색' 탭으로 진입합니다.

---

### 2026-07-18: 헤더 배너 홈 링크 추가 & 플로팅 AI 버튼 제거
- **작업 브랜치**: `feature/fe-ui-cleanup`
- **구현 기능 및 변경 사항**:
  - [x] `Header.js` 배너(새싹당 로고+텍스트)를 `<Link href="/">` 로 감싸 어느 페이지에서든 클릭 시 홈(`/`)으로 이동하도록 기능 추가
  - [x] 홈(`/page.js`), 식당 상세(`/restaurants/[id]/page.js`), 마이페이지(`/mypage/page.js`) 우하단에 있던 플로팅 AI 버튼(FAB, `auto_awesome` 아이콘) 전체 제거
- **수정/생성 파일**:
  - [MODIFY] [Header.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/components/Header.js)
  - [MODIFY] [page.js (홈)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/page.js)
  - [MODIFY] [page.js (restaurants/[id])](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/restaurants/[id]/page.js)
  - [MODIFY] [page.js (mypage)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/mypage/page.js)
- **테스트 결과 / 검증 내용**:
  - [x] 로컬 개발 서버(`npm run dev`) 실행 중 실시간 반영 확인
  - [x] 헤더 배너 클릭 시 홈 이동 동작 확인 (Next.js `Link` 컴포넌트 사용)
  - [x] 세 페이지 모두 AI FAB 버튼 미표시 확인
- **특이사항 및 전달사항**:
  - AI 페이지(`/ai`) 자체는 유지되며, 진입점(FAB)만 제거한 것입니다. 필요 시 바텀 네비게이션이나 다른 경로로 재연결 가능합니다.

---

### 2026-07-17: 리뷰 작성 탭 UI 및 레이아웃 홈 화면 기준 통일

- **작업 브랜치**: `feature/fe-review-layout-fix`
- **구현 기능 및 변경 사항**:
  - [x] 리뷰 생성 페이지(`/review/create`)에서 전역 헤더(`Header.js`)와 바텀 네비게이션 바(`BottomNavigation.js`)가 노출되도록 예외 처리 수정
  - [x] `/review/create/page.js` 내부의 fixed 헤더와 fixed 푸터(등록 버튼) 제거
  - [x] 리뷰 쓰기 페이지 본문 맨 위로 스크롤 가능하게 `리뷰 쓰기` 타이틀 추가 및 본문 하단에 `리뷰 등록하기` 버튼을 배치하여 바텀바와 겹침 해결
  - [x] 페이지 컨테이너 배경색을 기존 `bg-surface`에서 홈 화면과 동일한 `bg-background`로 변경하고 패딩값을 정렬
  - [x] 개별 식당 상세 리뷰 작성 페이지(`/restaurants/[id]/review`)의 배경색 및 헤더 스타일도 일관되게 맞춤
  - [x] 바텀 네비게이션 바(`BottomNavigation.js`) 배경의 반투명(글래스모피즘) 스타일은 유지하되, 불투명도를 `bg-surface-container/85`(85% 불투명도) 및 `backdrop-blur-2xl`로 미세 조정하여 스크롤 시 뒷배경 비침으로 인한 탭별 색상 차이 현상을 방지
  - [x] 마이페이지(`/mypage/page.js`)에 적용되어 있던 그라데이션 배경 및 뒷배경의 글로우 데코 요소를 삭제하여 홈 화면의 기본 `bg-background` 레이아웃과 일관되게 통일
  - [x] fixed 요소(헤더, 바텀바)의 스크롤 시 툭툭 끊김 및 미세 흔들림 현상을 제거하기 위해 `Header.js` 및 `restaurants/[id]/review/page.js`에서 translate transform을 제거하고, left/right 0와 max-w-md mx-auto 래퍼 구조로 변경
  - [x] `globals.css`에 GPU 하드웨어 가속(`will-change: transform`, `translate3d(0,0,0)`) 및 iOS 모바일 터치 스크롤 최적화 코드를 추가하여 스크롤 시 렌더링 프레임 저하 및 화면 깨짐 개선
- **수정/생성 파일**:
  - [MODIFY] [Header.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/components/Header.js)
  - [MODIFY] [BottomNavigation.js](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/components/BottomNavigation.js)
  - [MODIFY] [page.js (review/create)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/review/create/page.js)
  - [MODIFY] [page.js (restaurants/[id]/review)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/restaurants/[id]/review/page.js)
  - [MODIFY] [page.js (mypage)](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/mypage/page.js)
  - [MODIFY] [globals.css](file:///c:/Users/bbigs/sesac_pjt/sesacdang/frontend/src/app/globals.css)
- **테스트 결과 / 검증 내용**:
  - [x] `npm run lint` 검사 통과
- **특이사항 및 전달사항**:
  - 이번 레이아웃 정합성 및 배경 톤앤매너 수정을 통해 앱 쉘의 일관된 사용성을 완성했습니다.

---

### 2026-07-17: 개발 로그 기록 체계 구축 및 규칙 추가
- **작업 브랜치**: `feature/devlog-setup`
- **구현 기능 및 변경 사항**:
  - [x] 프로젝트 개발 기록을 날짜별로 누적 추적하기 위한 `DEVELOPMENT_LOG.md` 최초 생성 및 규칙 양식 제정
  - [x] `.agents/AGENTS.md`의 Git 협업 규칙 및 개발 완료 체크리스트에 개발 로그(`DEVELOPMENT_LOG.md`) 업데이트 의무 사항 추가
- **수정/생성 파일**:
  - [NEW] [DEVELOPMENT_LOG.md](file:///c:/Users/bbigs/sesac_pjt/sesacdang/DEVELOPMENT_LOG.md)
  - [MODIFY] [.agents/AGENTS.md](file:///c:/Users/bbigs/sesac_pjt/sesacdang/.agents/AGENTS.md)
- **테스트 결과 / 검증 내용**:
  - [x] 로컬 git branch 생성 확인 (`feature/devlog-setup`)
  - [x] 변경 사항 체크리스트 및 규칙 정의 완료
- **특이사항 및 전달사항**:
  - 향후 진행되는 모든 기능 개발 및 버그 수정 작업 완료 시, `PROGRESS.md`뿐만 아니라 본 개발 로그 파일(`DEVELOPMENT_LOG.md`)에도 작업 상세 내역을 누적 기록합니다.
