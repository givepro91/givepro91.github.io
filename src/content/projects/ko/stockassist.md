---
title: "stockAssist — 안전 우선 자동매매"
theme: reliability
kind: work
order: 8
positioning: "실제 내 돈으로 도는 한국 주식 룰 자동매매를, 멋진 알고리즘보다 ‘잘못 발주하면 돈을 잃는다’를 막는 데 집중해 만든 개인 운영 시스템입니다."
shows:
  - "리스크를 코드로 강제"
  - "단일 주문 경로"
  - "모드 FSM · 비상정지"
  - "실전 진입 게이트"
angle: "트레이딩 시스템에서 먼저 설계한 건 수익이 아니라, 손실을 막는 경로였습니다."
problem: "비개발자가 본업과 병행하며 소액으로 자동매매를 안전하게 운영해야 했습니다."
role: "단독으로 설계·구현·운영했습니다."
decision: "모든 주문을 <b>단일 OrderExecutor 지점</b>만 통과하게 하고, 직접 호출을 정적 테스트로 차단했습니다. 실전 전환은 dry-run 누적 게이트(체결 수·손익비)를 통과해야만 가능하게 했습니다."
result: "봇 미가동 구간을 빼면, 자금 리스크를 다층 차단(자동 손절·시간 손절·비상정지) 아래에서 운영합니다."
learning: "안전은 ‘조심하기’가 아니라 ‘잘못할 수 없는 경로를 만들기’였습니다."
decisionLog:
  - why: "주문 경로를 하나로 모으고, 새 기능이 우회 발주를 못 하도록 테스트로 잠갔습니다."
  - why: "PAUSE·FULL_AUTO·CONFIRM·EMERGENCY 모드 FSM으로 시스템 상태를 명시화했습니다."
stack: ["Python", "FastAPI", "KIS API", "SQLite", "Telegram"]
period: "2026"
metrics: "단독 · 개인 운영"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
