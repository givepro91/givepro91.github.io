---
title: "Ground Control — 자율 인프라 관제"
theme: agentops
kind: work
order: 3
featured: true
positioning: "장애를 감지하는 것을 넘어, 원인을 추론해 담당자에게 조용히 묻고 피드백으로 학습하는 자율 인프라 관제 에이전트입니다."
shows:
  - "AI 에이전트 운영 설계"
  - "human-in-the-loop"
  - "장애 진단 자동화"
  - "Slack 인시던트 워크플로우"
angle: "AI는 범인을 단정하는 게 아니라, 확인할 범위를 좁혀주는 조력자라고 봤습니다."
problem: "모니터링 도구는 ‘무언가 잘못됐다’까지만 알려주고, 원인 지목·담당자 호출·재발 학습은 사람이 매번 수동으로 했습니다."
role: "주기적 관찰 → 원인 추론 → 담당자 DM 확인 → 피드백 학습으로 이어지는 관제 에이전트를 단독 설계·구현했습니다."
decision: "‘오탐이 사람을 지치게 하면 알림은 죽는다’고 봤습니다. 그래서 공개 채널에 떠드는 대신 의심 지점을 몇 건으로 좁혀 담당자에게 조용히 DM하고, 진단 신뢰도를 certain·likely·hypothesis 3단계 <b>언어</b>로만 표현해 퍼센트로 과신하지 않게 했습니다."
result: "진단을 사람이 믿고 결정할 수 있는 형태로 바꿨고, 오탐의 심리적 비용까지 설계에 넣었습니다."
learning: "자동화의 어려움은 탐지가 아니라, 사람이 신뢰하고 행동하게 만드는 ‘표현’에 있었습니다."
decisionLog:
  - why: "퍼센트 정확도 수치를 전부 제거했습니다. 과신을 부르고 검증도 되지 않기 때문입니다."
    tradeoff: "정량적 인상은 약해지지만, 신뢰는 단단해집니다."
  - why: "공개 채널 오발신을 막는 다중 잠금을 둬, 기본값이 항상 ‘조용한 DM’이 되게 했습니다."
stack: ["Python", "Claude Code CLI", "FastAPI", "Slack Bolt", "SQLite", "AWS"]
period: "2026"
metrics: "단독 · 600 커밋"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
