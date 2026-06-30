---
title: "Zippit — 통장에서 시작하는 집 찾기"
theme: proptech
kind: work
order: 7
featured: true
positioning: "매물이 아니라 내 소득·현금에서 출발해, DSR/LTV 규제를 시뮬레이션해 전국 단지의 매수 가능성을 등급으로 보여주는 플랫폼입니다."
shows:
  - "역방향 매칭 UX 설계"
  - "금융 규제 엔진(순수 함수)"
  - "풀스택 설계·운영"
  - "실서비스 런칭"
angle: "집을 먼저 고르지 말고, 당신의 통장에서 시작하세요."
problem: "‘내 소득과 현금으로 살 수 있는 집이 어디인가’를 일반 사용자가 직관적으로 알기 어려웠습니다. 정보는 늘 매물에서 출발했으니까요."
role: "기획·설계·구현을 단독으로 주도했습니다(거의 전량 커밋)."
decision: "복잡한 금융 규제(DSR·LTV·취득세·정책대출)를 <b>외부 의존이 없는 순수 TypeScript 함수</b>로 구현했습니다. ‘규제 로직은 테스트로 증명되어야 한다’고 봤기 때문입니다."
result: "전국 단지를 사용자의 지갑 기준으로 등급화하는 실서비스로 운영하고 있습니다."
learning: "도메인 규칙을 순수 함수로 분리하니, 규제가 바뀔 때 바꿀 곳이 한 군데로 모였습니다."
decisionLog:
  - why: "매물 중심이 아니라 사용자 재무에서 출발하는 역방향 매칭으로 정보 구조 자체를 뒤집었습니다."
  - why: "부동산 데이터는 읽기 전용으로 분리하고, 앱 데이터와 DB를 나눴습니다."
    tradeoff: "조인 편의 대신 데이터 경계의 안전을 택했습니다."
stack: ["Next.js", "React", "TypeScript", "Prisma", "PostGIS"]
period: "2025–2026"
metrics: "단독 · 550 커밋"
visibility: public
link: "https://zippit.im"
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
