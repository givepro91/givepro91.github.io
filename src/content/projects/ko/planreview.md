---
title: "PlanReview — 건축 도면 규정 검토 자동화"
theme: proptech
kind: work
order: 5
positioning: "건축 도면(PDF)을 올리면 분석 엔진이 규정 적합성을 자동 검토해주는 SaaS입니다."
shows:
  - "비동기 분석 파이프라인"
  - "배포 가드레일 설계"
  - "엔진↔프론트 경계 설계"
  - "팀 협업 · 자문"
angle: "프론트가 엔진 결과를 ‘보정’하기 시작하면, 진실원이 둘로 갈라집니다."
problem: "사람이 수작업으로 하던 도면 규정 검토를, 업로드 한 번으로 자동화해야 했습니다."
role: "초기 분석 엔진을 제외한 인프라부터 개발 전반에 참여했고, 현재는 자문 역할을 맡고 있습니다."
decision: "‘엔진을 단일 진실원(SoT)으로 두고 프론트엔드의 재분류·보정을 금지한다’는 경계를 세웠습니다. 결과를 화면에서 손대기 시작하면 어디가 진짜인지 알 수 없게 되기 때문입니다."
result: "web → server → 큐 → worker(Docker 엔진)로 이어지는 비동기 검토 파이프라인을 운영했습니다."
learning: "사고는 대부분 ‘환경 경계’에서 났습니다. build-time 환경변수가 이미지에 박히는 특성을 간과해 스테이징 이미지를 운영에 올린 장애를 겪고, 배포 가드레일로 봉합했습니다."
decisionLog:
  - why: "엔진 결과는 server가 보존하고 worker는 상태만 콜백하는 이중 콜백으로, 진실원이 덮어써지지 않게 했습니다."
  - why: "운영 단계에서 스테이징 이미지 PULL을 차단하는 가드를 넣어, 같은 장애의 재발을 막았습니다."
    tradeoff: "배포 절차가 한 단계 엄격해졌습니다."
stack: ["TypeScript", "Hono", "Prisma", "Redis", "Next.js", "Python", "Docker"]
period: "2026"
metrics: "기여 · 인프라~개발 참여, 현재 자문"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
