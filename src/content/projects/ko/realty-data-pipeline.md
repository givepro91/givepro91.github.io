---
title: "Realty Data Pipeline — 무중단 부동산 ETL"
theme: reliability
kind: work
order: 6
positioning: "전국 부동산 데이터를 매월, 운영 DB를 단 한 번도 깨지 않고 무중단으로 갱신하는 Blue-Green ETL입니다."
shows:
  - "Blue-Green 데이터 배포"
  - "데이터 신뢰성"
  - "안전 규칙을 코드로 강제"
  - "파이프라인 시각화"
angle: "workflow가 성공해도 데이터는 멈춰 있을 수 있습니다 — 그 침묵을 구조로 막았습니다."
problem: "외부 원천의 전국 데이터를 매월 갱신해야 하는데, 운영 DB를 덮어쓰면 사고가 나고 서버는 OOM에 취약했습니다."
role: "파이프라인 설계와 안전 규칙 enforcement를 담당했습니다."
decision: "운영 DB를 덮어쓰지 않고 staging에서 전 과정을 계산한 뒤 <b>atomic swap</b>으로 전환하고(역방향 금지), 워커 수 제한 같은 규칙을 문장이 아니라 <b>훅으로 하드 블록</b>했습니다. 두 번의 서버 다운 경험에서 나온 결정입니다."
result: "‘성공 표시 ≠ 데이터 성공’이라는 침묵형 실패를 구조적으로 차단했습니다."
learning: "안전 규칙은 문서에 적으면 지켜지지 않았습니다 — 코드로 강제해야 지켜졌습니다."
decisionLog:
  - why: "OOM을 부른 다중 워커를 사전 훅으로 막아, 사람이 실수해도 시스템이 거부하게 했습니다."
  - why: "행이 2배로 뻥튀기된 사고를 Known Mistakes로 명문화해, 같은 실수의 재발을 막았습니다."
stack: ["Python", "PostgreSQL", "Shapely(PostGIS)", "React", "Slack"]
period: "2026"
metrics: "기여 · 안전 규칙 enforcement"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
